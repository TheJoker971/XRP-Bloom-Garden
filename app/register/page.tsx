'use client';

import Link from 'next/link';
import { Header } from '@/components/Header';
import { Building2, User, ArrowRight } from 'lucide-react';

export default function RegisterChoice() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-sky-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Créer un compte
          </h1>
          <p className="text-lg text-gray-600">
            Choisissez le type de compte que vous souhaitez créer
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Carte Association */}
          <Link href="/register/association">
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-green-500 group">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Building2 className="w-10 h-10 text-white" />
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Association
                </h2>
                
                <p className="text-gray-600 mb-6">
                  Vous représentez une association et souhaitez recevoir des dons via la plateforme
                </p>
                
                <ul className="text-left space-y-2 mb-6 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Créer des campagnes de dons</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Recevoir des XRP et des NFTs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Dashboard de gestion</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Validation par l'administrateur</span>
                  </li>
                </ul>
                
                <div className="flex items-center gap-2 text-green-600 font-semibold group-hover:gap-4 transition-all">
                  S'inscrire comme association
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          </Link>

          {/* Carte Utilisateur */}
          <Link href="/register/user">
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-sky-500 group">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-sky-500 to-blue-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <User className="w-10 h-10 text-white" />
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Utilisateur
                </h2>
                
                <p className="text-gray-600 mb-6">
                  Vous souhaitez faire des dons et participer aux événements de la plateforme
                </p>
                
                <ul className="text-left space-y-2 mb-6 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-sky-600 mt-1">✓</span>
                    <span>Faire des dons aux associations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sky-600 mt-1">✓</span>
                    <span>Participer aux tirages</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sky-600 mt-1">✓</span>
                    <span>Collecter des NFTs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sky-600 mt-1">✓</span>
                    <span>Accès immédiat</span>
                  </li>
                </ul>
                
                <div className="flex items-center gap-2 text-sky-600 font-semibold group-hover:gap-4 transition-all">
                  S'inscrire comme utilisateur
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          </Link>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-600">
            Vous avez déjà un compte ?{' '}
            <Link href="/login" className="text-green-600 hover:text-green-700 font-semibold">
              Se connecter
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
