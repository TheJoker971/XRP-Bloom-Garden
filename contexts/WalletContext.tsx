'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Client, Wallet as XrplWallet } from 'xrpl';
import {
  createWalletConnectSession,
  openQRCodeModal,
  closeQRCodeModal,
  disconnectWalletConnect,
  getXRPLAddress,
  isWalletConnectConnected,
  onWalletConnectConnect,
  onWalletConnectDisconnect,
} from '@/utils/walletConnectXRPL';
import { createWalletFromAddress } from '@/utils/walletConnectors';

export type WalletConnectionType = 'walletconnect' | 'seed' | 'generated';

interface WalletContextType {
  wallet: XrplWallet | null;
  address: string | null;
  balance: string | null;
  client: Client | null;
  isConnected: boolean;
  isLoading: boolean;
  connectionType: WalletConnectionType | null;
  connect: (seed?: string) => Promise<void>;
  connectWalletConnect: () => Promise<void>;
  disconnect: () => void;
  refreshBalance: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const XRPL_TESTNET_URL = 'wss://s.altnet.rippletest.net:51233';
const XRPL_MAINNET_URL = 'wss://xrplcluster.com';

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<XrplWallet | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionType, setConnectionType] = useState<WalletConnectionType | null>(null);

  // Initialiser le client XRPL
  useEffect(() => {
    const xrplClient = new Client(
      process.env.NEXT_PUBLIC_XRPL_NETWORK === 'mainnet' 
        ? XRPL_MAINNET_URL 
        : XRPL_TESTNET_URL
    );
    
    xrplClient.connect().catch(console.error);
    setClient(xrplClient);

    return () => {
      xrplClient.disconnect().catch(console.error);
    };
  }, []);

  // Vérifier si un wallet est stocké localement
  useEffect(() => {
    const storedAddress = localStorage.getItem('xrpl_address');
    const storedSeed = localStorage.getItem('xrpl_seed');
    const storedConnectionType = localStorage.getItem('xrpl_connection_type') as WalletConnectionType | null;
    
    if (storedAddress && client) {
      // Si c'est un wallet WalletConnect, vérifier si la session est toujours active
      if (storedConnectionType === 'walletconnect') {
        if (isWalletConnectConnected()) {
          const wcAddress = getXRPLAddress();
          if (wcAddress && wcAddress === storedAddress) {
            const walletData = createWalletFromAddress(wcAddress);
            const wallet = walletData as XrplWallet;
            setWallet(wallet);
            setAddress(wcAddress);
            setConnectionType('walletconnect');
            refreshBalanceForAddress(wcAddress);
            return;
          }
        }
        // Session expirée ou invalide
        localStorage.removeItem('xrpl_address');
        localStorage.removeItem('xrpl_connection_type');
        return;
      }
      
      // Restaurer les wallets locaux (seed/generated)
      if (storedSeed) {
        try {
          const restoredWallet = XrplWallet.fromSeed(storedSeed);
          setWallet(restoredWallet);
          setAddress(restoredWallet.classicAddress);
          setConnectionType(storedConnectionType || 'seed');
          refreshBalanceForAddress(restoredWallet.classicAddress);
        } catch (error) {
          console.error('Erreur lors de la restauration du wallet:', error);
          localStorage.removeItem('xrpl_address');
          localStorage.removeItem('xrpl_seed');
          localStorage.removeItem('xrpl_connection_type');
        }
      }
    }
  }, [client]);

  const refreshBalanceForAddress = async (addressToCheck: string) => {
    if (!client) return;
    
    try {
      const response = await client.request({
        command: 'account_info',
        account: addressToCheck,
        ledger_index: 'validated',
      });
      
      const xrpBalance = response.result.account_data.Balance;
      const balanceInXrp = (parseInt(xrpBalance) / 1_000_000).toString();
      setBalance(balanceInXrp);
    } catch (error) {
      console.error('Erreur lors de la récupération du solde:', error);
      setBalance('0');
    }
  };

  const refreshBalanceForWallet = async (walletToCheck: XrplWallet) => {
    await refreshBalanceForAddress(walletToCheck.classicAddress);
  };

  const connect = async (seed?: string) => {
    if (!client) {
      throw new Error('Client XRPL non initialisé');
    }

    setIsLoading(true);
    try {
      let newWallet: XrplWallet;
      let connectionTypeValue: WalletConnectionType;
      
      if (seed) {
        // Connexion avec un seed existant
        newWallet = XrplWallet.fromSeed(seed);
        connectionTypeValue = 'seed';
      } else {
        // Générer un nouveau wallet (pour le test)
        newWallet = XrplWallet.generate();
        connectionTypeValue = 'generated';
        console.warn('Nouveau wallet généré. Sauvegardez votre seed:', newWallet.seed);
      }

      setWallet(newWallet);
      setAddress(newWallet.classicAddress);
      setConnectionType(connectionTypeValue);
      
      // Sauvegarder localement (en production, utilisez un stockage sécurisé)
      if (seed || newWallet.seed) {
        localStorage.setItem('xrpl_address', newWallet.classicAddress);
        localStorage.setItem('xrpl_seed', newWallet.seed || seed || '');
        localStorage.setItem('xrpl_connection_type', connectionTypeValue);
      }
      
      await refreshBalanceForWallet(newWallet);
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Écouter les événements WalletConnect
  useEffect(() => {
    if (!client) return;

    const handleConnect = async (error: Error | null, payload?: any) => {
      if (error) {
        console.error('Erreur WalletConnect:', error);
        setIsLoading(false);
        return;
      }

      if (payload) {
        const accounts = payload.params?.[0]?.accounts || [];
        if (accounts.length > 0) {
          const wcAddress = accounts[0];
          const walletData = createWalletFromAddress(wcAddress);
          const wallet = walletData as XrplWallet;
          
          setWallet(wallet);
          setAddress(wcAddress);
          setConnectionType('walletconnect');
          
          localStorage.setItem('xrpl_address', wcAddress);
          localStorage.setItem('xrpl_connection_type', 'walletconnect');
          
          closeQRCodeModal();
          await refreshBalanceForAddress(wcAddress);
          setIsLoading(false);
        }
      }
    };

    const handleDisconnect = (error: Error | null) => {
      if (error) {
        console.error('Erreur déconnexion WalletConnect:', error);
      }
      disconnect();
    };

    onWalletConnectConnect(handleConnect);
    onWalletConnectDisconnect(handleDisconnect);

    return () => {
      // Cleanup si nécessaire
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client]);

  const handleConnectWalletConnect = async () => {
    if (!client) {
      throw new Error('Client XRPL non initialisé');
    }

    // Vérifier si déjà connecté
    if (isWalletConnectConnected()) {
      const wcAddress = getXRPLAddress();
      if (wcAddress) {
        const walletData = createWalletFromAddress(wcAddress);
        const wallet = walletData as XrplWallet;
        setWallet(wallet);
        setAddress(wcAddress);
        setConnectionType('walletconnect');
        await refreshBalanceForAddress(wcAddress);
        return;
      }
    }

    setIsLoading(true);
    try {
      // Créer une nouvelle session WalletConnect
      const uri = await createWalletConnectSession();
      
      // Ouvrir le modal QR Code
      openQRCodeModal(uri, () => {
        setIsLoading(false);
      });
      
      // La connexion sera gérée par l'event listener
    } catch (error) {
      console.error('Erreur lors de la connexion WalletConnect:', error);
      setIsLoading(false);
      closeQRCodeModal();
      throw error;
    }
  };

  const disconnect = async () => {
    // Déconnecter WalletConnect si connecté
    if (connectionType === 'walletconnect') {
      await disconnectWalletConnect();
    }
    
    setWallet(null);
    setAddress(null);
    setBalance(null);
    setConnectionType(null);
    localStorage.removeItem('xrpl_address');
    localStorage.removeItem('xrpl_seed');
    localStorage.removeItem('xrpl_connection_type');
    closeQRCodeModal();
  };

  const refreshBalance = async () => {
    if (address) {
      await refreshBalanceForAddress(address);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        wallet,
        address,
        balance,
        client,
        isConnected: !!wallet && !!address,
        isLoading,
        connectionType,
        connect,
        connectWalletConnect: handleConnectWalletConnect,
        disconnect,
        refreshBalance,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet doit être utilisé dans un WalletProvider');
  }
  return context;
}

