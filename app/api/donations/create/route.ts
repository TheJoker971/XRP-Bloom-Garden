import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { mintDonationNFT } from '@/lib/xrpl-nft-service';
import { drawFromPack } from '@/utils/packSystem';
import { PACKS } from '@/utils/packsData';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      walletAddress,        // Adresse wallet du donateur
      associationWalletAddress, // Adresse wallet de l'association DIRECTEMENT
      amount, 
      paymentTxHash,        // Hash de la transaction déjà signée côté client
      userId,              // Optionnel : ID de l'utilisateur connecté
    } = body;

    if (!walletAddress || !associationWalletAddress || !amount || !paymentTxHash) {
      return NextResponse.json(
        { error: 'Données manquantes (walletAddress, associationWalletAddress, amount, paymentTxHash requis)' },
        { status: 400 }
      );
    }

    // Vérifier que l'association existe avec cette adresse wallet
    const association = await prisma.association.findFirst({
      where: { 
        walletAddress: associationWalletAddress,
        status: 'APPROVED',
      },
    });

    if (!association) {
      return NextResponse.json(
        { error: 'Association introuvable ou non approuvée pour cette adresse wallet' },
        { status: 400 }
      );
    }

    const amountNum = parseFloat(amount.toString());
    if (amountNum < 5) {
      return NextResponse.json(
        { error: 'Le don minimum est de 5 XRP' },
        { status: 400 }
      );
    }

    // 1. Créer l'enregistrement de don avec le txHash déjà signé côté client
    const donation = await prisma.donation.create({
      data: {
        userId,
        donorWalletAddress: walletAddress,
        associationWalletAddress: associationWalletAddress,
        amount: amountNum,
        txHash: paymentTxHash, // Hash de la transaction déjà signée
        status: 'confirmed',
      },
    });

    // 2. Enregistrer l'événement blockchain pour le paiement
    await prisma.blockchainEvent.create({
      data: {
        type: 'payment',
        txHash: paymentTxHash,
        donationId: donation.id,
        status: 'confirmed',
        confirmedAt: new Date(),
        metadata: JSON.stringify({
          from: walletAddress,
          to: associationWalletAddress,
          amount: amountNum,
          associationName: association.name,
        }),
      },
    });

    // 4. Calculer les tirages (les NFTs seront créés côté client plus tard)
    const numDraws = Math.floor(amountNum / 5);
    const pack = PACKS.pack_nature_basic;
    const items = [];

    for (let i = 0; i < numDraws; i++) {
      const drawnItem = drawFromPack(pack);
      
      // Pour l'instant, on crée juste l'enregistrement sans NFT
      // TODO: Les NFTs doivent être créés côté client avec le wallet connecté
      const donationItem = await prisma.donationItem.create({
        data: {
          donationId: donation.id,
          itemName: drawnItem.name,
          itemType: drawnItem.id,
          rarity: drawnItem.rarity,
          nftTokenId: null, // Sera rempli plus tard quand on implémentera les NFTs côté client
          nftTxHash: null,
        },
      });

      items.push(donationItem);
    }

    return NextResponse.json({
      donation,
      items: items.map(item => ({
        id: item.id,
        itemName: item.itemName,
        rarity: item.rarity,
        nftTokenId: item.nftTokenId,
        nftTxHash: item.nftTxHash,
      })),
      paymentTxHash: paymentTxHash,
    });
  } catch (error: any) {
    console.error('Erreur:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}

