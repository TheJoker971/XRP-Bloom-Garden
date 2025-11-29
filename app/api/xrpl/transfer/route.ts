import { NextRequest, NextResponse } from 'next/server';
import { Client, Wallet, xrpToDrops } from 'xrpl';

const XRPL_TESTNET_URL = 'wss://s.altnet.rippletest.net:51233';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fromAddress, toAddress, amount, seed } = body;

    if (!fromAddress || !toAddress || !amount) {
      return NextResponse.json(
        { error: 'Données manquantes' },
        { status: 400 }
      );
    }

    // Note: Dans une vraie application, le seed ne devrait JAMAIS être envoyé au serveur
    // Utilisez plutôt la signature côté client avec le wallet de l'utilisateur
    
    const client = new Client(XRPL_TESTNET_URL);
    await client.connect();

    // Pour la démo, on retourne juste les infos de la transaction
    // En production, vous devriez utiliser le wallet connecté pour signer
    const txInfo = {
      from: fromAddress,
      to: toAddress,
      amount: amount,
      timestamp: new Date().toISOString(),
      // txHash serait généré après signature réelle
      txHash: `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    await client.disconnect();

    return NextResponse.json({
      success: true,
      transaction: txInfo,
      message: 'Transaction préparée (démo)',
    });
  } catch (error) {
    console.error('Erreur lors du transfert:', error);
    return NextResponse.json(
      { error: 'Erreur lors du transfert' },
      { status: 500 }
    );
  }
}

