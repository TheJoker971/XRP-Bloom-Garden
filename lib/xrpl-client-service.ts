'use client';

import { Client, Payment, xrpToDrops } from 'xrpl';
import { WalletInfo, WalletType } from './wallets';

const XRPL_TESTNET_URL = 'wss://s.altnet.rippletest.net:51233';
const XRPL_MAINNET_URL = 'wss://xrplcluster.com';

export interface PaymentParams {
  fromAddress: string;
  toAddress: string;
  amount: number;
  memo?: string;
  eventMetadata?: {
    type: string;
    donationId?: string;
    eventId?: string;
    [key: string]: any;
  };
}

export interface PaymentResult {
  txHash: string;
  status: string;
  fee: string;
  ledgerIndex: number;
}

/**
 * Envoie un paiement XRPL depuis le client (navigateur)
 * La transaction est signée côté client avec le wallet connecté
 */
export async function sendPaymentClient(
  walletInfo: WalletInfo,
  walletType: WalletType,
  params: PaymentParams
): Promise<PaymentResult> {
  const client = new Client(
    process.env.NEXT_PUBLIC_XRPL_NETWORK === 'mainnet' 
      ? XRPL_MAINNET_URL 
      : XRPL_TESTNET_URL
  );

  try {
    await client.connect();

    // Préparer les memos avec les métadonnées de l'événement
    const memos = [];
    
    if (params.memo) {
      memos.push({
        Memo: {
          MemoData: Buffer.from(params.memo, 'utf8').toString('hex').toUpperCase()
        }
      });
    }

    // Ajouter les métadonnées de l'événement blockchain dans un memo séparé
    if (params.eventMetadata) {
      const eventData = JSON.stringify({
        eventType: params.eventMetadata.type,
        timestamp: new Date().toISOString(),
        ...params.eventMetadata,
      });
      memos.push({
        Memo: {
          MemoType: Buffer.from('Event', 'utf8').toString('hex').toUpperCase(),
          MemoData: Buffer.from(eventData, 'utf8').toString('hex').toUpperCase()
        }
      });
    }

    // Préparer la transaction
    const payment: Payment = {
      TransactionType: 'Payment',
      Account: params.fromAddress,
      Destination: params.toAddress,
      Amount: xrpToDrops(params.amount.toString()),
      Memos: memos.length > 0 ? memos : undefined,
    };

    // Auto-remplir
    const prepared = await client.autofill(payment);

    // Signer avec le wallet (côté client)
    const signed = await signTransactionClient(walletInfo, walletType, prepared);

    // Soumettre et attendre la confirmation
    const result = await client.submitAndWait(signed.tx_blob);

    const meta = result.result.meta;
    const transactionResult = typeof meta === 'object' && meta !== null && 'TransactionResult' in meta 
      ? (meta as any).TransactionResult 
      : null;

    if (transactionResult === 'tesSUCCESS') {
      return {
        txHash: result.result.hash || '',
        status: 'confirmed',
        fee: (result.result as any).Fee || '0',
        ledgerIndex: result.result.ledger_index || 0,
      };
    } else {
      throw new Error(`Transaction failed: ${transactionResult || 'Unknown error'}`);
    }
  } finally {
    await client.disconnect();
  }
}

/**
 * Signe une transaction avec le wallet approprié (côté client)
 */
async function signTransactionClient(
  walletInfo: WalletInfo,
  walletType: WalletType,
  prepared: Payment
): Promise<{ tx_blob: string }> {
  // Pour GemWallet
  if (walletType === 'gem') {
    const gemWalletModule = await import('@gemwallet/api');
    const GemWalletApi = gemWalletModule.default || gemWalletModule;
    
    if (!GemWalletApi || typeof GemWalletApi.signTransaction !== 'function') {
      throw new Error('GemWallet API not available');
    }
    
    const result = await GemWalletApi.signTransaction({
      transaction: prepared as any,
    });
    
    // GemWallet retourne soit tx_blob soit signedTransaction
    const txBlob = (result as any).tx_blob || (result as any).signedTransaction || (result as any).blob;
    
    if (!txBlob) {
      throw new Error('Failed to sign transaction with GemWallet: no tx_blob in response');
    }
    
    return { tx_blob: txBlob };
  }

  // Pour Xaman (XUMM) - utiliser xrpl-wallet-standard si disponible
  if (walletType === 'xaman') {
    if (typeof window !== 'undefined' && (window as any).xrpl) {
      const wallet = (window as any).xrpl;
      if (wallet.signTransaction) {
        return await wallet.signTransaction(prepared);
      }
    }
    throw new Error('Xaman wallet not available');
  }

  // Pour Crossmark
  if (walletType === 'crossmark') {
    if (typeof window !== 'undefined' && (window as any).xrpToolkit) {
      const crossmark = (window as any).xrpToolkit;
      if (crossmark.methods && crossmark.methods.signTransaction) {
        const result = await crossmark.methods.signTransaction(prepared);
        if (result && result.tx_blob) {
          return { tx_blob: result.tx_blob };
        }
      }
    }
    throw new Error('Crossmark wallet not available');
  }

  throw new Error(`Wallet type ${walletType} not supported for signing`);
}

