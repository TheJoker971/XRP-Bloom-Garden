"use client";

import Link from "next/link";
import { WalletConnector } from "./WalletConnector";
import { useWallet } from "./providers/WalletProvider";

interface StatusMessage {
  message: string;
  type: "success" | "error" | "warning" | "info";
}

export function Header() {
  const { statusMessage, isConnected, accountInfo } = useWallet();
  const message = statusMessage as StatusMessage | null;

  const formatAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatBalance = (balance: string | number) => {
    if (!balance) return "0";
    const num = typeof balance === "string" ? parseFloat(balance) : balance;
    return num.toFixed(2);
  };

  return (
    <header className="w-full border-b border-green-100 bg-gradient-to-r from-green-50 to-sky-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-sky-500 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <span className="text-white text-xl">🌸</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-800 to-sky-800 bg-clip-text text-transparent">
                XRP Bloom Garden
              </h1>
              <p className="text-xs text-gray-600 hidden sm:block">Plateforme de dons NFT</p>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/"
                className="text-gray-700 hover:text-green-600 font-medium transition-colors"
              >
                Accueil
              </Link>
              <Link
                href="/charte"
                className="text-gray-700 hover:text-sky-600 font-medium transition-colors"
              >
                Charte
              </Link>
            </nav>

            {/* Wallet Info si connecté */}
            {isConnected && accountInfo && (
              <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-white rounded-lg border border-green-200 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700">
                    {formatAddress(accountInfo.address || accountInfo.account || "")}
                  </span>
                </div>
                {accountInfo.balance && (
                  <div className="text-xs text-gray-500 border-l border-gray-200 pl-3">
                    {formatBalance(accountInfo.balance)} XRP
                  </div>
                )}
              </div>
            )}

            {/* Message de statut */}
            {message && message.type && message.message && (
              <div
                className={`text-sm px-3 py-1.5 rounded-lg font-medium ${
                  message.type === "success"
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : message.type === "error"
                    ? "bg-red-100 text-red-700 border border-red-200"
                    : message.type === "warning"
                    ? "bg-amber-100 text-amber-700 border border-amber-200"
                    : "bg-sky-100 text-sky-700 border border-sky-200"
                }`}
              >
                {message.message}
              </div>
            )}

            {/* Wallet Connector */}
            <div className="flex items-center">
              <WalletConnector />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
