'use client';

import { useState } from 'react';
import { useXRPLWallet } from './providers/XRPLWalletProvider';
import { WalletType, getWalletName } from '@/lib/wallets';
import { Wallet, LogOut, ChevronDown } from 'lucide-react';

export function WalletButton() {
  const { isConnected, walletInfo, walletType, balance, isLoading, error, connect, disconnect } = useXRPLWallet();
  const [showMenu, setShowMenu] = useState(false);

  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (isConnected && walletInfo) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-green-200 rounded-lg hover:border-green-300 transition shadow-sm max-w-xs"
        >
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0"></div>
          <div className="text-left min-w-0 flex-1">
            <div className="text-sm font-medium text-gray-700 truncate">
              {formatAddress(walletInfo.address)}
            </div>
            {balance && (
              <div className="text-xs text-gray-500 truncate">
                {balance} XRP
              </div>
            )}
          </div>
          <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
        </button>

        {showMenu && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowMenu(false)}
            />
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
              <div className="p-4 border-b border-gray-200">
                <div className="text-xs text-gray-500 mb-1">Connecté avec</div>
                <div className="font-medium text-gray-800">
                  {walletType && getWalletName(walletType)}
                </div>
                <div className="text-sm text-gray-600 mt-2 font-mono break-all">
                  {walletInfo.address}
                </div>
                {balance && (
                  <div className="text-lg font-bold text-green-600 mt-2">
                    {balance} XRP
                  </div>
                )}
              </div>
              <button
                onClick={() => {
                  disconnect();
                  setShowMenu(false);
                }}
                className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 transition flex items-center gap-2 rounded-b-lg"
              >
                <LogOut className="w-4 h-4" />
                Déconnecter
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        disabled={isLoading}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition shadow-lg disabled:opacity-50"
      >
        <Wallet className="w-4 h-4" />
        {isLoading ? 'Connexion...' : 'Connecter Wallet'}
      </button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-20 overflow-hidden">
            <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-200">
              <h3 className="font-semibold text-gray-800">Choisir un wallet</h3>
              <p className="text-xs text-gray-600 mt-1">Sélectionnez votre wallet XRPL</p>
            </div>
            
            <div className="p-2">
              <WalletOption
                type="gem"
                name="GemWallet"
                description="Extension navigateur"
                icon="💎"
                onClick={(type) => {
                  connect(type);
                  setShowMenu(false);
                }}
              />
              
              <WalletOption
                type="xaman"
                name="Xaman (XUMM)"
                description="Mobile & Desktop"
                icon="🔷"
                onClick={(type) => {
                  connect(type);
                  setShowMenu(false);
                }}
              />
              
              <WalletOption
                type="crossmark"
                name="Crossmark"
                description="Extension navigateur"
                icon="✖️"
                onClick={(type) => {
                  connect(type);
                  setShowMenu(false);
                }}
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border-t border-red-200">
                <p className="text-xs text-red-600">{error}</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function WalletOption({
  type,
  name,
  description,
  icon,
  onClick,
}: {
  type: WalletType;
  name: string;
  description: string;
  icon: string;
  onClick: (type: WalletType) => void;
}) {
  return (
    <button
      onClick={() => onClick(type)}
      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition text-left"
    >
      <span className="text-2xl">{icon}</span>
      <div className="flex-1">
        <div className="font-medium text-gray-800">{name}</div>
        <div className="text-xs text-gray-500">{description}</div>
      </div>
    </button>
  );
}

