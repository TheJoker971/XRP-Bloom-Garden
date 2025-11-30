"use client";

import { useWalletManager } from "@/hooks/useWalletManager";

export function WalletManagerInitializer() {
  // Initialise le walletManager avec xrpl-connect
  useWalletManager();
  
  return null;
}

