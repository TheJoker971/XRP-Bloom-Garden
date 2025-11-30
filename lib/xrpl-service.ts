import { Client, Payment, xrpToDrops, dropsToXrp } from 'xrpl';
import { WalletInfo, WalletType } from './wallets';

const XRPL_TESTNET_URL = 'wss://s.altnet.rippletest.net:51233';
const XRPL_MAINNET_URL = 'wss://xrplcluster.com';

export interface PaymentParams {
  fromAddress: string;
  toAddress: string; // Adresse wallet de l'association directement
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
 * Envoie un paiement XRPL avec événement blockchain
 */
export async function sendPayment(
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
      Destination: params.toAddress, // Adresse wallet de l'association directement
      Amount: xrpToDrops(params.amount.toString()),
      Memos: memos.length > 0 ? memos : undefined,
    };

    // Auto-remplir
    const prepared = await client.autofill(payment);

    // Signer avec le wallet
    const signed = await signTransaction(walletInfo, walletType, prepared);

    // Soumettre et attendre la confirmation
    const result = await client.submitAndWait(signed.tx_blob);

    if (result.result.meta?.TransactionResult === 'tesSUCCESS') {
      return {
        txHash: result.result.hash || '',
        status: 'confirmed',
        fee: dropsToXrp(result.result.Fee || '0'),
        ledgerIndex: result.result.ledger_index || 0,
      };
    } else {
      throw new Error(`Transaction failed: ${result.result.meta?.TransactionResult}`);
    }
  } finally {
    await client.disconnect();
  }
}

/**
 * Signe une transaction avec le wallet approprié
 */
async function signTransaction(
  walletInfo: WalletInfo,
  walletType: WalletType,
  prepared: Payment
): Promise<{ tx_blob: string }> {
  // Pour GemWallet
  if (walletType === 'gem') {
    const { GemWalletApi } = await import('@gemwallet/api');
    return await GemWalletApi.signTransaction({
      transaction: prepared as any,
    });
  }

  // Pour Xaman (XUMM) - Note: nécessite @xaman-sdk/sdk
  if (walletType === 'xaman') {
    // Utiliser le wallet standard si disponible
    if (typeof window !== 'undefined' && (window as any).xrpl) {
      const wallet = (window as any).xrpl;
      return await wallet.signTransaction(prepared);
    }
    throw new Error('Xaman wallet not available');
  }

  // Pour Crossmark
  if (walletType === 'crossmark') {
    if (typeof window !== 'undefined' && (window as any).crossmark) {
      const wallet = (window as any).crossmark;
      return await wallet.signTransaction(prepared);
    }
    throw new Error('Crossmark wallet not available');
  }

  throw new Error(`Wallet type ${walletType} not supported for signing`);
}

