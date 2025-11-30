'use client';

import { Client, Payment, xrpToDrops } from 'xrpl';

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
 * Envoie un paiement XRPL en utilisant walletManager (xrpl-connect)
 */
export async function sendPaymentWithWalletManager(
  walletManager: any,
  params: PaymentParams
): Promise<PaymentResult> {
  if (!walletManager || !walletManager.account) {
    throw new Error('Wallet not connected');
  }

  const client = new Client(
    process.env.NEXT_PUBLIC_XRPL_NETWORK === 'mainnet' 
      ? XRPL_MAINNET_URL 
      : XRPL_TESTNET_URL
  );

  try {
    await client.connect();

    const memos = [];
    
    if (params.memo) {
      memos.push({
        Memo: {
          MemoData: Buffer.from(params.memo, 'utf8').toString('hex').toUpperCase()
        }
      });
    }

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

    const transaction = {
      TransactionType: 'Payment',
      Account: walletManager.account.address,
      Destination: params.toAddress,
      Amount: xrpToDrops(params.amount.toString()),
      Memos: memos.length > 0 ? memos : undefined,
    };

    const prepared = await client.autofill(transaction as Payment);
    const txResult = await walletManager.signAndSubmit(prepared);

    if (txResult.hash || txResult.id) {
      try {
        await client.disconnect();
        await client.connect();
        
        const result = await client.request({
          command: 'tx',
          transaction: txResult.hash || txResult.id,
        });

        if (result.result.meta && typeof result.result.meta === 'object' && 'TransactionResult' in result.result.meta) {
          const transactionResult = (result.result.meta as any).TransactionResult;
          if (transactionResult === 'tesSUCCESS') {
            return {
              txHash: txResult.hash || txResult.id || '',
              status: 'confirmed',
              fee: (result.result as any).Fee || '0',
              ledgerIndex: result.result.ledger_index || 0,
            };
          } else {
            throw new Error(`Transaction failed: ${transactionResult}`);
          }
        }
      } catch (error) {
        console.warn('Could not verify transaction status:', error);
      }
    }

    return {
      txHash: txResult.hash || txResult.id || 'Pending',
      status: 'pending',
      fee: '0',
      ledgerIndex: 0,
    };
  } finally {
    await client.disconnect();
  }
}

/**
 * Envoie un paiement XRPL en utilisant les wallets connectés via XRPLWalletProvider
 * (GemWallet, Xaman, Crossmark)
 */
export async function sendPaymentWithWallet(
  walletType: 'gem' | 'xaman' | 'crossmark',
  params: PaymentParams
): Promise<PaymentResult> {
  const client = new Client(
    process.env.NEXT_PUBLIC_XRPL_NETWORK === 'mainnet' 
      ? XRPL_MAINNET_URL 
      : XRPL_TESTNET_URL
  );

  try {
    await client.connect();

    const memos = [];
    
    if (params.memo) {
      memos.push({
        Memo: {
          MemoData: Buffer.from(params.memo, 'utf8').toString('hex').toUpperCase()
        }
      });
    }

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

    const transaction = {
      TransactionType: 'Payment',
      Account: params.fromAddress,
      Destination: params.toAddress,
      Amount: xrpToDrops(params.amount.toString()),
      Memos: memos.length > 0 ? memos : undefined,
    };

    const prepared = await client.autofill(transaction as Payment);

    // Signer selon le type de wallet
    let txResult: any;

    if (walletType === 'gem') {
      // GemWallet utilise sendPayment directement au lieu de signTransaction
      const { isInstalled, sendPayment } = await import('@gemwallet/api');
      
      const installed = await isInstalled();
      if (!installed) {
        throw new Error('GemWallet n\'est pas installé');
      }

      // Utiliser sendPayment de GemWallet qui gère tout automatiquement
      // GemWallet attend le montant en DROPS (string), pas en XRP !
      // 1 XRP = 1,000,000 drops
      const amountInDrops = xrpToDrops(params.amount.toString());
      
      const gemPayment = {
        amount: amountInDrops, // Montant en drops (ex: "5000000" pour 5 XRP)
        destination: params.toAddress,
        memos: memos.length > 0 ? memos.map(m => ({
          memo: {
            memoData: m.Memo.MemoData,
            memoType: m.Memo.MemoType,
          }
        })) : undefined,
      };

      console.log('💎 GemWallet Payment:', {
        amountInXRP: params.amount,
        amountInDrops: amountInDrops,
        destination: gemPayment.destination,
      });

      const response = await sendPayment(gemPayment);
      if (!response.result) {
        throw new Error('Transaction annulée par l\'utilisateur');
      }

      txResult = {
        hash: response.result.hash,
        result: response.result
      };

    } else if (walletType === 'xaman') {
      // Xaman (XUMM)
      throw new Error('Xaman signing not yet implemented. Please use GemWallet or Crossmark.');

    } else if (walletType === 'crossmark') {
      // Crossmark
      if (typeof window !== 'undefined' && (window as any).xrpToolkit) {
        const crossmark = (window as any).xrpToolkit;
        const response = await crossmark.signAndSubmit(prepared);
        
        if (response.error) {
          throw new Error(response.error);
        }

        txResult = {
          hash: response.hash,
          result: response
        };
      } else {
        throw new Error('Crossmark n\'est pas installé');
      }

    } else {
      throw new Error(`Wallet type ${walletType} not supported`);
    }

    // Vérifier le résultat
    if (txResult.hash) {
      try {
        const result = await client.request({
          command: 'tx',
          transaction: txResult.hash,
        });

        if (result.result.meta && typeof result.result.meta === 'object' && 'TransactionResult' in result.result.meta) {
          const transactionResult = (result.result.meta as any).TransactionResult;
          if (transactionResult === 'tesSUCCESS') {
            return {
              txHash: txResult.hash,
              status: 'confirmed',
              fee: (result.result as any).Fee || '0',
              ledgerIndex: result.result.ledger_index || 0,
            };
          } else {
            throw new Error(`Transaction failed: ${transactionResult}`);
          }
        }
      } catch (error) {
        console.warn('Could not verify transaction status:', error);
      }
    }

    return {
      txHash: txResult.hash || 'Pending',
      status: 'pending',
      fee: '0',
      ledgerIndex: 0,
    };
  } finally {
    await client.disconnect();
  }
}
