"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface StatusMessage {
  message: string;
  type: "success" | "error" | "warning" | "info";
}

interface Event {
  timestamp: string;
  name: string;
  data: any;
}

interface WalletContextType {
  walletManager: any;
  isConnected: boolean;
  accountInfo: any;
  events: Event[];
  statusMessage: StatusMessage | null;
  setWalletManager: (manager: any) => void;
  setIsConnected: (connected: boolean) => void;
  setAccountInfo: (info: any) => void;
  addEvent: (name: string, data: any) => void;
  clearEvents: () => void;
  showStatus: (message: string, type: StatusMessage["type"]) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [walletManager, setWalletManagerState] = useState<any>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [accountInfo, setAccountInfo] = useState<any>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null);

  const setWalletManager = useCallback((manager: any) => {
    setWalletManagerState(manager);
  }, []);

  const addEvent = useCallback((name: string, data: any) => {
    const timestamp = new Date().toLocaleTimeString();
    setEvents((prev) => [{ timestamp, name, data }, ...prev]);
  }, []);

  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  const showStatus = useCallback((message: string, type: StatusMessage["type"]) => {
    setStatusMessage({ message, type });
    setTimeout(() => {
      setStatusMessage(null);
    }, 5000);
  }, []);

  return (
    <WalletContext.Provider
      value={{
        walletManager,
        isConnected,
        accountInfo,
        events,
        statusMessage,
        setWalletManager,
        setIsConnected,
        setAccountInfo,
        addEvent,
        clearEvents,
        showStatus,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
