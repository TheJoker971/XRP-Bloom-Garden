"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { WalletButton } from "./WalletButton";
import { useXRPLWallet } from "./providers/XRPLWalletProvider";
import { LogOut, User, ChevronDown } from "lucide-react";

export function Header() {
  const router = useRouter();
  const { isConnected: isWalletConnected, walletInfo, balance } = useXRPLWallet();
  const [user, setUser] = useState<any>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
        }
      } catch {
        localStorage.removeItem('token');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setShowUserMenu(false);
    router.push('/');
  };

  const formatBalance = (balance: string | number) => {
    if (!balance) return "0";
    const num = typeof balance === "string" ? parseFloat(balance) : balance;
    return num.toFixed(2);
  };

  const getUserRoleLabel = (role: string) => {
    switch (role) {
      case 'ADMIN': return '👨‍💼 Admin';
      case 'ASSOCIATION': return '🏢 Association';
      case 'USER': return '👤 Utilisateur';
      default: return '👤';
    }
  };

  const getUserRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'ASSOCIATION': return 'bg-green-100 text-green-700 border-green-200';
      case 'USER': return 'bg-sky-100 text-sky-700 border-sky-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <header className="w-full border-b border-green-100 bg-gradient-to-r from-green-50 to-sky-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
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

          <div className="flex items-center gap-3">
            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-4">
              <Link
                href="/"
                className="text-gray-700 hover:text-green-600 font-medium transition-colors text-sm"
              >
                Accueil
              </Link>
              <Link
                href="/donate"
                className="text-gray-700 hover:text-green-600 font-medium transition-colors text-sm"
              >
                Faire un don
              </Link>
              <Link
                href="/events"
                className="text-gray-700 hover:text-orange-600 font-medium transition-colors flex items-center gap-1 text-sm"
              >
                🔥 Événement
              </Link>
              <Link
                href="/partnership"
                className="text-gray-700 hover:text-sky-600 font-medium transition-colors text-sm"
              >
                Partenaire
              </Link>
            </nav>

            {/* Séparateur */}
            <div className="hidden md:block w-px h-8 bg-gray-300"></div>

            {/* Section Compte Utilisateur */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${getUserRoleColor(user.role)} hover:shadow-md`}
                >
                  <User className="w-4 h-4" />
                  <div className="hidden sm:flex flex-col items-start">
                    <span className="text-xs font-medium">{user.name || user.email}</span>
                    <span className="text-[10px] opacity-75">{getUserRoleLabel(user.role)}</span>
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-20 overflow-hidden">
                      <div className="p-4 border-b border-gray-200 bg-gray-50">
                        <p className="text-sm font-semibold text-gray-900">{user.name || 'Utilisateur'}</p>
                        <p className="text-xs text-gray-600 mt-1">{user.email}</p>
                        <p className="text-xs mt-2">
                          <span className={`px-2 py-1 rounded ${getUserRoleColor(user.role)}`}>
                            {getUserRoleLabel(user.role)}
                          </span>
                        </p>
                      </div>

                      {(user.role === 'ADMIN' || user.role === 'ASSOCIATION') && (
                        <Link
                          href={user.role === 'ADMIN' ? '/dashboard/admin' : '/dashboard/association'}
                          onClick={() => setShowUserMenu(false)}
                          className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
                        >
                          📊 Dashboard
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 transition flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Déconnexion
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                href="/register"
                className="px-4 py-2 text-sm bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition font-semibold shadow-sm"
              >
                S'inscrire
              </Link>
            )}

            {/* Séparateur */}
            <div className="hidden md:block w-px h-8 bg-gray-300"></div>

            {/* Section Wallet XRPL */}
            <div className="flex items-center gap-2">
              {isWalletConnected && walletInfo && balance && (
                <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-green-200 shadow-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 hidden sm:block">Wallet XRPL</span>
                    <span className="text-sm font-semibold text-green-600">
                      {formatBalance(balance)} XRP
                    </span>
                  </div>
                </div>
              )}
              <WalletButton />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
