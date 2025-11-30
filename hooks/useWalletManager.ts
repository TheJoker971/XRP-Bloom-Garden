"use client";

import { useEffect, useCallback } from "react";
import { useWallet } from "@/components/providers/WalletProvider";

// Configuration - Replace with your API keys
const XAMAN_API_KEY = process.env.NEXT_PUBLIC_XAMAN_API_KEY || "";
const WALLETCONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "";

export function useWalletManager() {
  const { walletManager, isConnected, accountInfo, setWalletManager, setIsConnected, setAccountInfo, addEvent, showStatus } =
    useWallet();

  // Fonction pour enregistrer le wallet si l'utilisateur est connecté et que c'est la première fois
  const registerWalletIfNeeded = useCallback(async (walletAddress: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // L'utilisateur n'est pas connecté, pas besoin d'enregistrer
        return;
      }

      // Vérifier si l'utilisateur a déjà un walletAddress enregistré
      const walletResponse = await fetch('/api/users/wallet', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!walletResponse.ok) {
        // Token invalide ou utilisateur non trouvé
        return;
      }

      const walletData = await walletResponse.json();
      
      // Si l'utilisateur n'a pas de walletAddress ou si c'est différent, on l'enregistre
      if (!walletData.walletAddress || walletData.walletAddress !== walletAddress) {
        const updateResponse = await fetch('/api/users/wallet', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ walletAddress }),
        });

        if (updateResponse.ok) {
          addEvent("Wallet Registered", { walletAddress });
          // Afficher un message seulement si c'est la première fois (pas de walletAddress avant)
          if (!walletData.walletAddress) {
            showStatus("Wallet enregistré avec succès pour recevoir les fonds", "success");
          } else {
            showStatus("Wallet mis à jour", "success");
          }
        } else {
          const errorData = await updateResponse.json();
          console.error('Erreur lors de l\'enregistrement du wallet:', errorData);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la vérification/enregistrement du wallet:', error);
      // Ne pas afficher d'erreur à l'utilisateur, c'est silencieux
    }
  }, [addEvent, showStatus]);

  // Fonction pour mettre à jour l'état de connexion
  const updateConnectionState = useCallback(async (manager: any) => {
    // Utiliser account comme source de vérité principale
    const account = manager?.account;
    const connected = !!account; // Si on a un account, on est connecté
    
    console.log('[WalletManager] updateConnectionState:', { 
      connected,
      managerConnectedProp: manager?.connected,
      hasAccount: !!account,
      accountAddress: account?.address,
      accountFull: account
    });
    
    setIsConnected(connected);
    if (connected && account) {
      const wallet = manager.wallet;
      if (wallet) {
        setAccountInfo({
          address: account.address,
          network: `${account.network.name} (${account.network.id})`,
          walletName: wallet.name,
        });

        // Enregistrer automatiquement le wallet si l'utilisateur est connecté
        await registerWalletIfNeeded(account.address);
      } else {
        // Si on a un account mais pas de wallet, on met quand même à jour
        setAccountInfo({
          address: account.address,
          network: `${account.network.name} (${account.network.id})`,
          walletName: 'Unknown',
        });
      }
    } else {
      setAccountInfo(null);
    }
  }, [setIsConnected, setAccountInfo, registerWalletIfNeeded]);

  useEffect(() => {
    // Dynamic import to avoid SSR issues
    const initWalletManager = async () => {
      try {
        const xrplConnect = await import("xrpl-connect");
        const {
          WalletManager,
          XamanAdapter,
          WalletConnectAdapter,
          CrossmarkAdapter,
          GemWalletAdapter,
        } = xrplConnect as any;

        const adapters = [];

        // Only add Xaman if API key is available
        if (XAMAN_API_KEY) {
          adapters.push(new XamanAdapter({ apiKey: XAMAN_API_KEY }));
        }

        // Only add WalletConnect if project ID is available
        if (WALLETCONNECT_PROJECT_ID) {
          adapters.push(new WalletConnectAdapter({ projectId: WALLETCONNECT_PROJECT_ID }));
        }

        // Add browser extension wallets (no config needed)
        adapters.push(new CrossmarkAdapter());
        adapters.push(new GemWalletAdapter());

        const manager = new WalletManager({
          adapters,
          network: process.env.NEXT_PUBLIC_XRPL_NETWORK === 'mainnet' ? 'mainnet' : 'testnet',
          autoConnect: true,
          logger: { level: "info" },
        });

        setWalletManager(manager);

        // Event listeners
        manager.on("connect", (account: any) => {
          addEvent("Connected", account);
          updateConnectionState(manager);
        });

        manager.on("disconnect", () => {
          addEvent("Disconnected", null);
          updateConnectionState(manager);
        });

        manager.on("error", (error: any) => {
          addEvent("Error", error);
          showStatus(error.message, "error");
        });

        // Vérifier si un wallet est déjà connecté via l'ancien système (localStorage)
        // et synchroniser avec le nouveau système
        const syncWithOldSystem = async () => {
          try {
            const savedWallet = localStorage.getItem('xrpl_wallet');
            if (savedWallet) {
              const { type, info } = JSON.parse(savedWallet);
              if (info && info.address) {
                console.log('[WalletManager] Found wallet in localStorage, trying to connect:', info.address);
                
                // Essayer de se connecter avec le walletManager si on a un type
                // Note: xrpl-connect devrait gérer autoConnect, mais on peut forcer une connexion
                try {
                  // Si autoConnect n'a pas fonctionné, on peut essayer de se connecter manuellement
                  // Mais d'abord, vérifions si le manager a déjà un account
                  if (!manager.account) {
                    // Attendre un peu pour que autoConnect fonctionne
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                    // Si toujours pas de compte, on peut essayer de forcer la connexion
                    // mais xrpl-connect gère ça automatiquement avec autoConnect
                    console.log('[WalletManager] Waiting for autoConnect...');
                  }
                } catch (error) {
                  console.warn('[WalletManager] Could not auto-connect:', error);
                }
              }
            }
          } catch (error) {
            console.warn('[WalletManager] Error syncing with old system:', error);
          }
        };

        // Check initial connection status après un court délai pour s'assurer que autoConnect a fonctionné
        // Utiliser account comme indicateur de connexion (plus fiable que connected)
        const checkConnection = () => {
          const hasAccount = !!manager.account;
          if (!hasAccount) {
            // Vérifier aussi l'ancien système
            syncWithOldSystem();
          } else {
            console.log('[WalletManager] Account detected on init:', manager.account?.address);
            showStatus("Wallet reconnected from previous session", "success");
            updateConnectionState(manager);
          }
        };

        // Vérifier immédiatement
        checkConnection();
        
        // Vérifier après 500ms, 1s et 2s pour s'assurer que autoConnect a fonctionné
        setTimeout(checkConnection, 500);
        setTimeout(checkConnection, 1000);
        setTimeout(checkConnection, 2000);

        console.log("XRPL Connect initialized", manager);
      } catch (error) {
        console.error("Failed to initialize wallet manager:", error);
        showStatus("Failed to initialize wallet connection", "error");
      }
    };

    initWalletManager();
  }, [setWalletManager, setIsConnected, setAccountInfo, addEvent, showStatus, registerWalletIfNeeded, updateConnectionState]);

  // Surveiller les changements de walletManager en temps réel
  // Utiliser walletManager.account comme source de vérité principale (plus fiable que connected)
  useEffect(() => {
    if (!walletManager) {
      console.log('[WalletManager] No walletManager yet');
      return;
    }

    // Fonction pour synchroniser l'état
    // On considère connecté si on a un account, même si connected est false
    const syncConnectionState = () => {
      const hasAccount = !!walletManager.account;
      const stateConnected = isConnected && accountInfo;

      // Si on a un account mais que l'état n'est pas synchronisé, mettre à jour
      if (hasAccount && (!stateConnected || accountInfo?.address !== walletManager.account?.address)) {
        console.log('[WalletManager] Account detected, updating connection state:', walletManager.account?.address);
        updateConnectionState(walletManager);
      } else if (!hasAccount && stateConnected) {
        console.log('[WalletManager] No account but state says connected, disconnecting...');
        setIsConnected(false);
        setAccountInfo(null);
      }
      // Sinon, l'état est déjà synchronisé, pas besoin de log
    };

    // Synchroniser immédiatement
    syncConnectionState();

    // Vérifier périodiquement pour s'assurer que l'état est synchronisé
    // Réduire la fréquence pour éviter trop de logs
    const interval = setInterval(syncConnectionState, 2000);

    return () => clearInterval(interval);
  }, [walletManager, isConnected, accountInfo, updateConnectionState, setIsConnected, setAccountInfo]);

  return { walletManager };
}

