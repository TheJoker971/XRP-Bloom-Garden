'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { Client } from 'xrpl';
import { WalletType, WalletInfo, connectWallet, getWalletName } from '@/lib/wallets';

interface XRPLWalletContextType {
  isConnected: boolean;
  walletInfo: WalletInfo | null;
  walletType: WalletType | null;
  balance: string | null;
  isLoading: boolean;
  error: string | null;
  connect: (type: WalletType) => Promise<void>;
  disconnect: () => void;
  refreshBalance: () => Promise<void>;
}

const XRPLWalletContext = createContext<XRPLWalletContextType | undefined>(undefined);

const XRPL_TESTNET_URL = 'wss://s.altnet.rippletest.net:51233';
const XRPL_MAINNET_URL = 'wss://xrplcluster.com';

export function XRPLWalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [walletType, setWalletType] = useState<WalletType | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [client, setClient] = useState<Client | null>(null);

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

  // Restaurer la session au chargement
  useEffect(() => {
    const savedWallet = localStorage.getItem('xrpl_wallet');
    if (savedWallet) {
      try {
        const { type, info } = JSON.parse(savedWallet);
        setWalletType(type);
        setWalletInfo(info);
        setIsConnected(true);
        refreshBalance();
      } catch (error) {
        console.error('Erreur lors de la restauration du wallet:', error);
        localStorage.removeItem('xrpl_wallet');
      }
    }
  }, []);

  const refreshBalance = useCallback(async () => {
    if (!client || !walletInfo?.address) return;

    try {
      await client.connect();
      const response = await client.request({
        command: 'account_info',
        account: walletInfo.address,
        ledger_index: 'validated',
      });

      const xrpBalance = Number(response.result.account_data.Balance) / 1000000;
      setBalance(xrpBalance.toFixed(6));
    } catch (error: any) {
      console.error('Erreur lors de la récupération du solde:', error);
      if (error?.data?.error === 'actNotFound') {
        setBalance('0');
      }
    }
  }, [client, walletInfo]);

  const connect = useCallback(async (type: WalletType) => {
    setIsLoading(true);
    setError(null);

    try {
      const info = await connectWallet(type);
      
      if (!info) {
        throw new Error(`Impossible de se connecter à ${getWalletName(type)}`);
      }

      setWalletType(type);
      setWalletInfo(info);
      setIsConnected(true);

      // Sauvegarder dans localStorage
      localStorage.setItem('xrpl_wallet', JSON.stringify({ type, info }));

      // Récupérer le solde
      await refreshBalance();
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion');
      console.error('Erreur de connexion:', err);
    } finally {
      setIsLoading(false);
    }
  }, [refreshBalance]);

  const disconnect = useCallback(() => {
    setIsConnected(false);
    setWalletInfo(null);
    setWalletType(null);
    setBalance(null);
    setError(null);
    localStorage.removeItem('xrpl_wallet');
  }, []);

  return (
    <XRPLWalletContext.Provider
      value={{
        isConnected,
        walletInfo,
        walletType,
        balance,
        isLoading,
        error,
        connect,
        disconnect,
        refreshBalance,
      }}
    >
      {children}
    </XRPLWalletContext.Provider>
  );
}

export function useXRPLWallet() {
  const context = useContext(XRPLWalletContext);
  if (context === undefined) {
    throw new Error('useXRPLWallet must be used within a XRPLWalletProvider');
  }
  return context;
}

