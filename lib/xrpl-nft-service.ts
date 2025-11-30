import { Client, NFTokenMint, xrpToDrops } from 'xrpl';
import { WalletInfo, WalletType } from './wallets';

const XRPL_TESTNET_URL = 'wss://s.altnet.rippletest.net:51233';
const XRPL_MAINNET_URL = 'wss://xrplcluster.com';

export interface NFTMetadata {
  itemType: string;
  itemName: string;
  rarity: string;
  associationWalletAddress: string; // Adresse wallet directement
  associationName: string;
  donationDate: string;
  donationAmount: number;
  donationTxHash?: string;
}

export interface NFTMintResult {
  nftTokenId: string;
  txHash: string;
  status: string;
  ledgerIndex: number;
}

/**
 * Crée un NFT semi-fongible avec métadonnées et événement blockchain
 */
export async function mintDonationNFT(
  walletInfo: WalletInfo,
  walletType: WalletType,
  metadata: NFTMetadata,
  eventMetadata?: {
    type: string;
    donationId?: string;
    [key: string]: any;
  }
): Promise<NFTMintResult> {
  const client = new Client(
    process.env.NEXT_PUBLIC_XRPL_NETWORK === 'mainnet' 
      ? XRPL_MAINNET_URL 
      : XRPL_TESTNET_URL
  );

  try {
    await client.connect();

    // Encoder les métadonnées en JSON base64
    const metadataJson = JSON.stringify(metadata);
    const metadataBase64 = Buffer.from(metadataJson).toString('base64');
    const metadataUri = `data:application/json;base64,${metadataBase64}`;

    // Préparer les memos pour l'événement blockchain
    const memos = [];
    if (eventMetadata) {
      const eventData = JSON.stringify({
        eventType: 'nft_mint',
        timestamp: new Date().toISOString(),
        ...eventMetadata,
      });
      memos.push({
        Memo: {
          MemoType: Buffer.from('Event', 'utf8').toString('hex').toUpperCase(),
          MemoData: Buffer.from(eventData, 'utf8').toString('hex').toUpperCase()
        }
      });
    }

    // Préparer la transaction NFTokenMint
    const nftMint: NFTokenMint = {
      TransactionType: 'NFTokenMint',
      Account: walletInfo.address,
      NFTokenTaxon: 0,
      URI: Buffer.from(metadataUri).toString('hex').toUpperCase(),
      Flags: 8, // Transferable
      Memos: memos.length > 0 ? memos : undefined,
    };

    const prepared = await client.autofill(nftMint);
    const signed = await signTransaction(walletInfo, walletType, prepared);
    const result = await client.submitAndWait(signed.tx_blob);

    if (result.result.meta?.TransactionResult === 'tesSUCCESS') {
      const nftTokenId = extractNFTokenID(result.result.meta);
      
      return {
        nftTokenId: nftTokenId || '',
        txHash: result.result.hash || '',
        status: 'confirmed',
        ledgerIndex: result.result.ledger_index || 0,
      };
    } else {
      throw new Error(`NFT mint failed: ${result.result.meta?.TransactionResult}`);
    }
  } finally {
    await client.disconnect();
  }
}

/**
 * Extrait le TokenID du NFT depuis les métadonnées de transaction
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
    }
  }
  return null;
}

/**
 * Signe une transaction NFT avec le wallet approprié
 */
async function signTransaction(
  walletInfo: WalletInfo,
  walletType: WalletType,
  prepared: NFTokenMint
): Promise<{ tx_blob: string }> {
  // Pour GemWallet
  if (walletType === 'gem') {
    const { GemWalletApi } = await import('@gemwallet/api');
    return await GemWalletApi.signTransaction({
      transaction: prepared as any,
    });
  }

  // Pour Xaman (XUMM)
  if (walletType === 'xaman') {
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

