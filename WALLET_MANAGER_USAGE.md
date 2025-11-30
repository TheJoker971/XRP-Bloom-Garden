# Utilisation de walletManager avec xrpl-connect

Ce projet utilise maintenant `walletManager` de `xrpl-connect` pour signer les transactions, comme dans le code de référence.

## Configuration

1. Créez un fichier `.env.local` à la racine du projet avec :

```env
# XRPL Network Configuration
NEXT_PUBLIC_XRPL_NETWORK=testnet

# Xaman (XUMM) API Key (optionnel)
# Obtenez votre clé API sur: https://xumm.app/developers
NEXT_PUBLIC_XAMAN_API_KEY=votre_clé_api_xaman

# WalletConnect Project ID (optionnel)
# Obtenez votre Project ID sur: https://cloud.walletconnect.com/
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=votre_project_id_walletconnect
```

## Utilisation dans les composants

### Exemple avec walletManager

```typescript
'use client';

import { useWallet } from '@/components/providers/WalletProvider';
import { sendPaymentWithWalletManager } from '@/lib/xrpl-client-service-v2';

export function MyComponent() {
  const { walletManager, isConnected, addEvent, showStatus } = useWallet();

  const handlePayment = async () => {
    if (!walletManager || !walletManager.account) {
      showStatus("Please connect a wallet first", "error");
      return;
    }

    try {
      const result = await sendPaymentWithWalletManager(walletManager, {
        fromAddress: walletManager.account.address,
        toAddress: 'rN7n7otQDd6FczFgLdlqtyMVrn3HMfXoQT',
        amount: 10,
        memo: 'Test payment',
        eventMetadata: {
          type: 'payment',
        },
      });

      showStatus("Transaction submitted successfully!", "success");
      addEvent("Transaction Submitted", result);
    } catch (error: any) {
      showStatus(`Transaction failed: ${error.message}`, "error");
      addEvent("Transaction Failed", error);
    }
  };

  if (!isConnected) {
    return <div>Please connect a wallet</div>;
  }

  return (
    <button onClick={handlePayment}>
      Send Payment
    </button>
  );
}
```

### Pattern comme dans le code de référence

```typescript
const transaction = {
  TransactionType: "Payment",
  Account: walletManager.account.address,
  Destination: destination,
  Amount: amount,
};

const txResult = await walletManager.signAndSubmit(transaction);

addEvent("Transaction Submitted", txResult);
```

## Migration depuis useXRPLWallet

Si vous utilisez actuellement `useXRPLWallet`, vous pouvez migrer vers `useWallet` + `walletManager` :

**Avant :**
```typescript
const { isConnected, walletInfo, walletType } = useXRPLWallet();
const { sendPaymentClient } = await import('@/lib/xrpl-client-service');
const result = await sendPaymentClient(walletInfo, walletType!, params);
```

**Après :**
```typescript
const { walletManager, isConnected, addEvent, showStatus } = useWallet();
const { sendPaymentWithWalletManager } = await import('@/lib/xrpl-client-service-v2');
const result = await sendPaymentWithWalletManager(walletManager, params);
```

## Avantages de walletManager

1. **Unifié** : Un seul système pour tous les wallets (GemWallet, Xaman, Crossmark, WalletConnect)
2. **Auto-connect** : Reconnexion automatique depuis la session précédente
3. **Événements** : Gestion automatique des événements de connexion/déconnexion
4. **Standardisé** : Utilise le standard xrpl-connect utilisé par la communauté

