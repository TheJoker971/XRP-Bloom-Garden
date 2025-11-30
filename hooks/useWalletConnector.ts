import { useRef, useEffect } from "react";

export function useWalletConnector(walletManager: any) {
  const walletConnectorRef = useRef<any>(null);

  useEffect(() => {
    if (walletManager && walletConnectorRef.current) {
      // Connecter le walletManager au composant web
      if (walletConnectorRef.current.setWalletManager) {
        walletConnectorRef.current.setWalletManager(walletManager);
      }
    }
  }, [walletManager]);

  return walletConnectorRef;
}

