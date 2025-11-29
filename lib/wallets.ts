// Import dynamique pour éviter les erreurs SSR
let gemWalletAPI: any = null;
if (typeof window !== 'undefined') {
  import('@gemwallet/api').then(module => {
    gemWalletAPI = module;
  }).catch(() => {
    console.warn('GemWallet API not available');
  });
}

export type WalletType = 'gem' | 'xaman' | 'crossmark';

export interface WalletInfo {
  address: string;
  network: string;
  publicKey?: string;
}

// GemWallet
export async function connectGemWallet(): Promise<WalletInfo | null> {
  try {
    if (!gemWalletAPI) {
      gemWalletAPI = await import('@gemwallet/api');
    }

    const installed = await gemWalletAPI.isInstalled();
    if (!installed) {
      throw new Error('GemWallet n\'est pas installé');
    }

    const addressResponse = await gemWalletAPI.getAddress();
    if (!addressResponse.result) {
      throw new Error('Impossible de récupérer l\'adresse');
    }

    const networkResponse = await gemWalletAPI.getNetwork();
    
    return {
      address: addressResponse.result.address,
      network: networkResponse.result?.network || 'testnet',
      publicKey: addressResponse.result.publicKey,
    };
  } catch (error) {
    console.error('Erreur GemWallet:', error);
    return null;
  }
}

// Xaman (XUMM)
export async function connectXaman(): Promise<WalletInfo | null> {
  try {
    // Xaman utilise un QR code ou deep link
    // Pour l'instant, on retourne null et on utilisera xrpl-connect
    console.log('Xaman doit être connecté via xrpl-connect');
    return null;
  } catch (error) {
    console.error('Erreur Xaman:', error);
    return null;
  }
}

// Crossmark
export async function connectCrossmark(): Promise<WalletInfo | null> {
  try {
    if (typeof window === 'undefined' || !(window as any).xrpToolkit) {
      throw new Error('Crossmark n\'est pas installé');
    }

    const crossmark = (window as any).xrpToolkit;
    const response = await crossmark.methods.signInAndWait();
    
    if (response && response.response && response.response.data) {
      return {
        address: response.response.data.address,
        network: response.response.data.network || 'testnet',
      };
    }
    
    return null;
  } catch (error) {
    console.error('Erreur Crossmark:', error);
    return null;
  }
}

export async function connectWallet(type: WalletType): Promise<WalletInfo | null> {
  switch (type) {
    case 'gem':
      return connectGemWallet();
    case 'xaman':
      return connectXaman();
    case 'crossmark':
      return connectCrossmark();
    default:
      return null;
  }
}

export function getWalletName(type: WalletType): string {
  switch (type) {
    case 'gem':
      return 'GemWallet';
    case 'xaman':
      return 'Xaman';
    case 'crossmark':
      return 'Crossmark';
    default:
      return 'Unknown';
  }
}

