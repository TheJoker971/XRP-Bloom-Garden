'use client';

import Link from 'next/link';
import { Users, Building2 } from 'lucide-react';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Rejoignez XRP Bloom Garden
          </h1>
          <p className="text-lg text-gray-600">
            Choisissez votre type de compte pour commencer
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Inscription Utilisateur */}
          <Link href="/register/user">
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer border-2 border-transparent hover:border-green-500">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <Users className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Utilisateur
                </h2>
                <p className="text-gray-600 mb-6">
                  Créez votre jardin virtuel, faites des dons et collectionnez des objets rares pour embellir votre village.
                </p>
                <ul className="text-left text-sm text-gray-600 space-y-2 mb-6">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Créer et personnaliser votre jardin
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Faire des dons aux associations
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Collecter des objets via les tirages
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Participer aux événements
                  </li>
                </ul>
                <div className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                  S'inscrire en tant qu'utilisateur
                </div>
              </div>
            </div>
          </Link>

          {/* Inscription Association */}
          <Link href="/register/association">
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer border-2 border-transparent hover:border-blue-500">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <Building2 className="w-10 h-10 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Association
                </h2>
                <p className="text-gray-600 mb-6">
                  Inscrivez votre association pour recevoir des dons et créer des événements pour mobiliser la communauté.
                </p>
                <ul className="text-left text-sm text-gray-600 space-y-2 mb-6">
                  <li className="flex items-center">
                    <span className="text-blue-500 mr-2">✓</span>
                    Recevoir des dons en XRP
                  </li>
                  <li className="flex items-center">
                    <span className="text-blue-500 mr-2">✓</span>
                    Créer des événements de crise
                  </li>
                  <li className="flex items-center">
                    <span className="text-blue-500 mr-2">✓</span>
                    Gérer votre profil d'association
                  </li>
                  <li className="flex items-center">
                    <span className="text-blue-500 mr-2">✓</span>
                    Suivre vos contributions
                  </li>
                </ul>
                <div className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  S'inscrire en tant qu'association
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
      </div>
    </div>
  );
}

