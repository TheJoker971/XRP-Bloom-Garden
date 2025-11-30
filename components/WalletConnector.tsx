"use client";

import { useState, useEffect, createElement, useRef } from "react";
import { useWallet } from "./providers/WalletProvider";

const THEMES = {
  light: {
    "--xc-background-color": "#ffffff",
    "--xc-background-secondary": "#F0FDF4", // green-50
    "--xc-background-tertiary": "#E0F2FE", // sky-50
    "--xc-text-color": "#166534", // green-800
    "--xc-text-muted-color": "rgba(22, 101, 52, 0.6)", // green-800 with opacity
    "--xc-primary-color": "#16A34A", // green-600
    "--xc-secondary-color": "#0284C7", // sky-600
  },
  dark: {
    "--xc-background-color": "#1a202c",
    "--xc-background-secondary": "#2d3748",
    "--xc-background-tertiary": "#4a5568",
    "--xc-text-color": "#F5F4E7",
    "--xc-text-muted-color": "rgba(245, 244, 231, 0.6)",
    "--xc-primary-color": "#3b99fc",
  },
};

export function WalletConnector() {
  const walletConnectorRef = useRef<any>(null);
  const [currentTheme] = useState("light");
  const [isClient, setIsClient] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Register the web component
    const registerWebComponent = async () => {
      try {
        const { WalletConnectorElement } = await import("xrpl-connect");

        // Define the custom element if not already defined
        if (!customElements.get("xrpl-wallet-connector")) {
          customElements.define("xrpl-wallet-connector", WalletConnectorElement);
          setIsRegistered(true);
          console.log("xrpl-wallet-connector registered successfully");
        } else {
          setIsRegistered(true);
          console.log("xrpl-wallet-connector already registered");
        }
      } catch (error) {
        console.error("Failed to load xrpl-connect:", error);
      }
    };

    registerWebComponent();
  }, []);

  // Attendre que l'élément soit monté et prêt
  useEffect(() => {
    if (isClient && isRegistered) {
      // Attendre que le composant soit complètement monté
      const timer = setTimeout(() => {
        if (walletConnectorRef.current) {
          const element = walletConnectorRef.current;
          
          // Le composant xrpl-wallet-connector détecte automatiquement les wallets XRPL
          // (Gem, Xaman, etc.) s'ils sont installés dans le navigateur
          console.log("✅ Wallet connector prêt");
          
          // Vérifier que l'élément est bien défini
          if (element && element.shadowRoot) {
            console.log("✅ Shadow DOM disponible");
  }
        }
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [isClient, isRegistered]);

  if (!isClient || !isRegistered) {
  return (
      <div className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm">
        Chargement...
      </div>
    );
  }

  return createElement(
    "xrpl-wallet-connector",
    {
      ref: walletConnectorRef,
      id: "wallet-connector",
      // Configuration pour XRPL natif (testnet)
      // Note: Si vous utilisez des contrats Solidity, vous devez utiliser la sidechain EVM XRPL
      // qui nécessite MetaMask configuré pour la sidechain EVM (pas le XRPL natif)
      "network": "testnet", // "testnet" pour XRPL natif, ou "mainnet" pour la production
      "primary-wallet": "xaman", // Wallet XRPL natif préféré (Gem, Xaman, etc.)
      style: {
        ...(THEMES[currentTheme as keyof typeof THEMES] || THEMES.light),
        "--xc-font-family": "inherit",
        "--xc-border-radius": "12px",
        "--xc-modal-box-shadow": "0 10px 40px rgba(0, 0, 0, 0.15)",
        "--xc-button-border-radius": "8px",
        // Styles du bouton Connect Wallet
        "--xc-connect-button-background": "#16A34A", // green-600
        "--xc-connect-button-color": "#ffffff",
        "--xc-connect-button-hover-background": "#15803D", // green-700
        "--xc-connect-button-hover-color": "#ffffff",
        "--xc-connect-button-border": "none",
        "--xc-connect-button-padding-vertical": "10px",
        "--xc-connect-button-padding-horizontal": "20px",
        "--xc-connect-button-font-weight": "600",
        "--xc-connect-button-transition": "all 0.2s ease-in-out",
        // Styles des boutons primaires dans le modal
        "--xc-primary-button-background": "#16A34A", // green-600
        "--xc-primary-button-color": "#ffffff",
        "--xc-primary-button-hover-background": "#15803D", // green-700
        "--xc-primary-button-hover-color": "#ffffff",
        "--xc-primary-button-border-radius": "8px",
        // Styles des boutons de wallet dans le modal
        "--xc-wallet-button-hover-background": "#F0FDF4", // green-50
        "--xc-wallet-button-hover-border-color": "#16A34A", // green-600
      },
    }
  );
}
