"use client";

import { useState, useEffect, createElement } from "react";
import { useWallet } from "./providers/WalletProvider";
import { useWalletConnector } from "../hooks/useWalletConnector";

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
  const { walletManager } = useWallet();
  const walletConnectorRef = useWalletConnector(walletManager);
  const [currentTheme] = useState("light");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Register the web component
    const registerWebComponent = async () => {
      try {
        const { WalletConnectorElement } = await import("xrpl-connect");

        // Define the custom element if not already defined
        if (!customElements.get("xrpl-wallet-connector")) {
          customElements.define("xrpl-wallet-connector", WalletConnectorElement);
        }
      } catch (error) {
        console.error("Failed to load xrpl-connect:", error);
      }
    };

    registerWebComponent();
  }, []);

  if (!isClient) {
    return null;
  }

  return createElement(
    "xrpl-wallet-connector",
    {
      ref: walletConnectorRef,
      id: "wallet-connector",
      style: {
        ...(THEMES[currentTheme as keyof typeof THEMES] || THEMES.light),
        "--xc-font-family": "inherit",
        "--xc-border-radius": "12px",
        "--xc-modal-box-shadow": "0 10px 40px rgba(0, 0, 0, 0.15)",
        "--xc-button-border-radius": "8px",
      },
      "primary-wallet": "xaman",
    }
  );
}