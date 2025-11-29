'use client';

import Link from 'next/link';

export default function Header() {
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
          
          <nav className="flex items-center gap-6">
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
        </div>
      </div>
    </header>
  );
}
