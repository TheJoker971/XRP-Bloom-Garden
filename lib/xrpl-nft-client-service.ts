'use client';

import { Client, NFTokenMint } from 'xrpl';
import { WalletType } from './wallets';

const XRPL_TESTNET_URL = 'wss://s.altnet.rippletest.net:51233';
const XRPL_DEVNET_URL = 'wss://s.devnet.rippletest.net:51233';
const XRPL_MAINNET_URL = 'wss://xrplcluster.com';

export interface NFTMetadata {
  itemType: string;
  itemName: string;
  rarity: string;
  associationName: string;
  donationAmount: number;
  donationDate: string;
  quantity: number; // Quantité de cet objet obtenu
}

export interface NFTMintResult {
  nftTokenId: string;
  txHash: string;
  status: string;
  ledgerIndex: number;
}

/**
 * Crée un NFT XRPL côté client avec les métadonnées de l'objet
 */
export async function mintItemNFT(
  walletType: WalletType,
  fromAddress: string,
  metadata: NFTMetadata
): Promise<NFTMintResult> {
  // Utiliser Devnet par défaut (plus stable que Testnet)
  const networkUrl = process.env.NEXT_PUBLIC_XRPL_NETWORK === 'mainnet' 
    ? XRPL_MAINNET_URL 
    : process.env.NEXT_PUBLIC_XRPL_NETWORK === 'testnet'
    ? XRPL_TESTNET_URL
    : XRPL_DEVNET_URL;

  const client = new Client(networkUrl, {
    connectionTimeout: 30000, // 30 secondes au lieu de 20
  });

  try {
    console.log('🔗 Connexion au réseau XRPL:', networkUrl);
    await client.connect();

    // Encoder les métadonnées en JSON base64 pour l'URI
    const metadataJson = JSON.stringify({
      name: metadata.itemName,
      type: metadata.itemType,
      rarity: metadata.rarity,
      association: metadata.associationName,
      donationAmount: metadata.donationAmount,
      donationDate: metadata.donationDate,
      quantity: metadata.quantity,
      description: `${metadata.itemName} (${metadata.rarity}) obtenu suite à un don de ${metadata.donationAmount} XRP à ${metadata.associationName}`,
    });
    
    const metadataBase64 = Buffer.from(metadataJson).toString('base64');
    const metadataUri = `data:application/json;base64,${metadataBase64}`;

    // Préparer les memos avec les détails de l'objet
    const memos = [
      {
        Memo: {
          MemoType: Buffer.from('ItemDrop', 'utf8').toString('hex').toUpperCase(),
          MemoData: Buffer.from(JSON.stringify({
            itemType: metadata.itemType,
            itemName: metadata.itemName,
            rarity: metadata.rarity,
            quantity: metadata.quantity,
            timestamp: new Date().toISOString(),
          }), 'utf8').toString('hex').toUpperCase()
        }
      }
    ];

    // Préparer la transaction NFTokenMint
    const nftMint: NFTokenMint = {
      TransactionType: 'NFTokenMint',
      Account: fromAddress,
      NFTokenTaxon: 0, // Taxon 0 pour les objets de donation
      URI: Buffer.from(metadataUri).toString('hex').toUpperCase(),
      Flags: 8, // tfTransferable - le NFT peut être transféré
      Memos: memos,
    };

    // Autofill pour calculer les frais
    const prepared = await client.autofill(nftMint);

    // Signer selon le type de wallet
    let txResult: any;

    if (walletType === 'gem') {
      const { isInstalled, submitTransaction } = await import('@gemwallet/api');
      
      const installed = await isInstalled();
      if (!installed) {
        throw new Error('GemWallet n\'est pas installé');
      }

      console.log('💎 Minting NFT with GemWallet:', {
        itemName: metadata.itemName,
        rarity: metadata.rarity,
        quantity: metadata.quantity,
      });

      // GemWallet : soumettre la transaction préparée
      txResult = await submitTransaction({
        transaction: prepared as any,
      });

      if (!txResult.result?.hash) {
        throw new Error(txResult.result?.reason || 'GemWallet NFT mint failed');
      }
      
      txResult.hash = txResult.result.hash;
    } else if (walletType === 'crossmark') {
      if (typeof window === 'undefined' || !(window as any).xrpToolkit) {
        throw new Error('Crossmark n\'est pas installé');
      }
      const crossmark = (window as any).xrpToolkit;
      const signedTx = await crossmark.methods.signAndSubmit(prepared);
      txResult = { hash: signedTx.response.data.hash };
    } else if (walletType === 'xaman') {
      // Pour Xaman, on pourrait utiliser xumm-sdk mais pour l'instant on lance une erreur
      throw new Error('Xaman NFT minting not yet implemented');
    } else {
      throw new Error(`Wallet type ${walletType} not supported for NFT minting`);
    }

    // Attendre la confirmation
    if (txResult.hash) {
      try {
        await client.disconnect();
        await client.connect();
        
        const result = await client.request({
          command: 'tx',
          transaction: txResult.hash,
        });

        if (result.result.meta && typeof result.result.meta === 'object' && 'TransactionResult' in result.result.meta) {
          const transactionResult = (result.result.meta as any).TransactionResult;
          
          if (transactionResult === 'tesSUCCESS') {
            // Extraire le NFTokenID
            const nftTokenId = extractNFTokenID(result.result.meta);
            
            return {
              nftTokenId: nftTokenId || '',
              txHash: txResult.hash,
              status: 'confirmed',
              ledgerIndex: result.result.ledger_index || 0,
            };
          } else {
            throw new Error(`NFT mint failed: ${transactionResult}`);
          }
        }
      } catch (error) {
        console.warn('Could not verify NFT mint status:', error);
      }
    }

    return {
      nftTokenId: '',
      txHash: txResult.hash || 'Pending',
      status: 'pending',
      ledgerIndex: 0,
    };
  } finally {
    await client.disconnect();
  }
}

/**
 * Extrait le NFTokenID depuis les métadonnées de transaction
 */
function extractNFTokenID(meta: any): string | null {
  if (meta?.AffectedNodes) {
    for (const node of meta.AffectedNodes) {
      if (node.CreatedNode?.LedgerEntryType === 'NFTokenPage') {
        const nftokens = node.CreatedNode.NewFields?.NFTokens;
        if (nftokens && nftokens.length > 0) {
          return nftokens[0].NFToken?.NFTokenID || null;
        }
      }
      // Vérifier aussi les modifications de pages existantes
      if (node.ModifiedNode?.LedgerEntryType === 'NFTokenPage') {
        const finalFields = node.ModifiedNode.FinalFields?.NFTokens;
        const previousFields = node.ModifiedNode.PreviousFields?.NFTokens;
        
        // Le nouveau NFT est celui qui est dans FinalFields mais pas dans PreviousFields
        if (finalFields && previousFields) {
          const newTokens = finalFields.filter((token: any) => 
            !previousFields.some((prev: any) => prev.NFToken?.NFTokenID === token.NFToken?.NFTokenID)
          );
          if (newTokens.length > 0) {
            return newTokens[0].NFToken?.NFTokenID || null;
          }
        }
      }
    }
  }
  return null;
}

