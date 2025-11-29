"use client";

import { useEffect } from "react";
import { useWallet } from "./providers/WalletProvider";

export function WalletManagerInitializer() {
  const { showStatus, setIsConnected, setAccountInfo } = useWallet();

  useEffect(() => {
    // Écouter les événements du composant web xrpl-wallet-connector
    const handleWalletConnect = (event: CustomEvent) => {
      console.log("Wallet connected:", event.detail);
      const wallet = event.detail;
      setIsConnected(true);
      setAccountInfo({
        address: wallet.address || wallet.account,
        balance: wallet.balance,
      });
      showStatus("Wallet connecté avec succès", "success");
    };

    const handleWalletDisconnect = () => {
      console.log("Wallet disconnected");
      setIsConnected(false);
      setAccountInfo(null);
      showStatus("Wallet déconnecté", "info");
    };

    const handleWalletError = (event: CustomEvent) => {
      console.error("Wallet error:", event.detail);
      showStatus(`Erreur: ${event.detail?.message || "Erreur de connexion"}`, "error");
    };

    // Ajouter les écouteurs d'événements
    window.addEventListener("xc:connect", handleWalletConnect as EventListener);
    window.addEventListener("xc:disconnect", handleWalletDisconnect);
    window.addEventListener("xc:error", handleWalletError as EventListener);

    return () => {
      // Nettoyer les écouteurs
      window.removeEventListener("xc:connect", handleWalletConnect as EventListener);
      window.removeEventListener("xc:disconnect", handleWalletDisconnect);
      window.removeEventListener("xc:error", handleWalletError as EventListener);
    };
  }, [showStatus, setIsConnected, setAccountInfo]);

  return null;
}

