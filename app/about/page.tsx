'use client';

import { Header } from '@/components/Header';
import { Heart, Sparkles, Shield, Zap, Users, Globe, Leaf, Droplet } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-sky-50">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-sky-400 rounded-3xl flex items-center justify-center shadow-xl mx-auto">
              <span className="text-5xl">🌸</span>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-green-800 mb-6">
            À propos de XRP Bloom Garden
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Une plateforme innovante qui transforme les dons en expérience ludique
            tout en soutenant des causes importantes sur la blockchain XRPL.
          </p>
        </div>

        {/* Mission */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 border-2 border-green-200">
          <div className="flex items-center gap-3 mb-6">
            <Heart className="w-8 h-8 text-red-500" />
            <h2 className="text-3xl font-bold text-gray-900">Notre Mission</h2>
          </div>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            XRP Bloom Garden révolutionne la philanthropie en combinant la transparence de la blockchain XRPL 
            avec une expérience gamifiée unique. Notre objectif est de rendre les dons plus engageants, 
            transparents et gratifiants pour tous.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Chaque don contribue non seulement à des causes importantes, mais permet également aux donateurs 
            de construire leur propre village virtuel, créant ainsi une connexion émotionnelle durable avec 
            leur impact philanthropique.
          </p>
        </div>

        {/* Comment ça marche */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center flex items-center justify-center gap-3">
            <Sparkles className="w-8 h-8 text-yellow-500" />
            Comment ça marche ?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Étape 1 */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  1
                </div>
                <h3 className="text-xl font-bold text-gray-900">Connectez votre Wallet</h3>
              </div>
              <p className="text-gray-700">
                Utilisez GemWallet, Xaman, Crossmark ou WalletConnect pour vous connecter 
                à la plateforme de manière sécurisée sur le réseau XRPL.
              </p>
            </div>

            {/* Étape 2 */}
            <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl p-6 border-2 border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  2
                </div>
                <h3 className="text-xl font-bold text-gray-900">Choisissez une Association</h3>
              </div>
              <p className="text-gray-700">
                Parcourez nos associations approuvées et choisissez celle qui vous tient à cœur : 
                nature, eau, humanitaire, air ou prévention des incendies.
              </p>
            </div>

            {/* Étape 3 */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  3
                </div>
                <h3 className="text-xl font-bold text-gray-900">Faites un Don en XRP</h3>
              </div>
              <p className="text-gray-700">
                Effectuez votre don directement en XRP. Chaque transaction est enregistrée 
                sur la blockchain pour une transparence totale. Minimum 5 XRP.
              </p>
            </div>

            {/* Étape 4 */}
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-6 border-2 border-orange-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  4
                </div>
                <h3 className="text-xl font-bold text-gray-900">Recevez des Objets</h3>
              </div>
              <p className="text-gray-700">
                Obtenez des tirages selon le montant de votre don (1 tirage par tranche de 5 XRP). 
                Débloquez des objets de différentes raretés pour décorer votre village !
              </p>
            </div>
          </div>
        </div>

        {/* Événements */}
        <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl shadow-lg p-8 mb-12 border-2 border-orange-300">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl">🔥</span>
            <h2 className="text-3xl font-bold text-gray-900">Événements Spéciaux</h2>
          </div>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            Les associations peuvent créer des <strong>événements de levée de fonds</strong> limités dans le temps. 
            Lorsqu'un événement est actif, votre village peut être affecté par une crise (comme un incendie) !
          </p>
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-bold text-gray-900 mb-2">💧 Participez à l'événement</h4>
              <p className="text-sm text-gray-700">
                Faites des dons pour obtenir des objets spéciaux (comme des seaux d'eau) 
                et aidez à résoudre la crise dans votre village.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-bold text-gray-900 mb-2">🏆 Gagnez des récompenses</h4>
              <p className="text-sm text-gray-700">
                Les contributeurs les plus généreux apparaissent dans le classement et 
                peuvent gagner des récompenses exclusives.
              </p>
            </div>
          </div>
        </div>

        {/* Caractéristiques */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Pourquoi XRP Bloom Garden ?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-200 hover:shadow-xl transition">
              <Shield className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Transparence Totale</h3>
              <p className="text-gray-700">
                Toutes les transactions sont enregistrées sur la blockchain XRPL, 
                garantissant une traçabilité complète de chaque don.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-200 hover:shadow-xl transition">
              <Zap className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Rapide & Économique</h3>
              <p className="text-gray-700">
                Grâce à XRPL, les transactions sont quasi-instantanées avec des frais 
                minimes, maximisant l'impact de votre don.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-200 hover:shadow-xl transition">
              <Sparkles className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Expérience Gamifiée</h3>
              <p className="text-gray-700">
                Construisez votre village virtuel, collectionnez des objets rares et 
                participez à des événements communautaires.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-pink-200 hover:shadow-xl transition">
              <Users className="w-12 h-12 text-pink-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Communauté Engagée</h3>
              <p className="text-gray-700">
                Rejoignez une communauté de donateurs passionnés et suivez l'impact 
                collectif en temps réel.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-yellow-200 hover:shadow-xl transition">
              <Globe className="w-12 h-12 text-yellow-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Impact Global</h3>
              <p className="text-gray-700">
                Soutenez des associations du monde entier travaillant sur des causes 
                environnementales et humanitaires.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-200 hover:shadow-xl transition">
              <Leaf className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Écologique</h3>
              <p className="text-gray-700">
                XRPL est l'une des blockchains les plus éco-responsables, avec une 
                empreinte carbone minimale.
              </p>
            </div>
          </div>
        </div>

        {/* Types d'associations */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 border-2 border-sky-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Types d'Associations Supportées
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
              <span className="text-3xl">🌿</span>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Nature & Forêts</h4>
                <p className="text-sm text-gray-700">Reforestation, protection de la biodiversité</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
              <span className="text-3xl">💧</span>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Eau & Océans</h4>
                <p className="text-sm text-gray-700">Nettoyage des océans, accès à l'eau potable</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-pink-50 rounded-lg">
              <span className="text-3xl">❤️</span>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Humanitaire</h4>
                <p className="text-sm text-gray-700">Aide d'urgence, éducation, santé</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-sky-50 rounded-lg">
              <span className="text-3xl">💨</span>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Air & Climat</h4>
                <p className="text-sm text-gray-700">Réduction des émissions, énergies renouvelables</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg">
              <span className="text-3xl">🔥</span>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Prévention Incendies</h4>
                <p className="text-sm text-gray-700">Lutte contre les feux de forêt, sensibilisation</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
              <span className="text-3xl">🌍</span>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Et bien plus...</h4>
                <p className="text-sm text-gray-700">Nouvelles associations ajoutées régulièrement</p>
              </div>
            </div>
          </div>
        </div>

        {/* Système de raretés */}
        <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl shadow-lg p-8 mb-12 border-2 border-purple-300">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Système de Raretés
          </h2>
          <p className="text-center text-gray-700 mb-8">
            Chaque tirage peut vous faire gagner un objet d'une rareté différente :
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 text-center border-2 border-gray-300">
              <div className="text-3xl mb-2">⚪</div>
              <h4 className="font-bold text-gray-700 mb-1">COMMUN</h4>
              <p className="text-sm text-gray-600">60% de chances</p>
            </div>

            <div className="bg-white rounded-lg p-4 text-center border-2 border-green-300">
              <div className="text-3xl mb-2">🟢</div>
              <h4 className="font-bold text-green-700 mb-1">PEU COMMUN</h4>
              <p className="text-sm text-gray-600">25% de chances</p>
            </div>

            <div className="bg-white rounded-lg p-4 text-center border-2 border-blue-300">
              <div className="text-3xl mb-2">🔵</div>
              <h4 className="font-bold text-blue-700 mb-1">RARE</h4>
              <p className="text-sm text-gray-600">10% de chances</p>
            </div>

            <div className="bg-white rounded-lg p-4 text-center border-2 border-purple-300">
              <div className="text-3xl mb-2">🟣</div>
              <h4 className="font-bold text-purple-700 mb-1">ÉPIQUE</h4>
              <p className="text-sm text-gray-600">4% de chances</p>
            </div>

            <div className="bg-white rounded-lg p-4 text-center border-2 border-yellow-300 md:col-span-2">
              <div className="text-3xl mb-2">🟡</div>
              <h4 className="font-bold text-yellow-700 mb-1">LÉGENDAIRE</h4>
              <p className="text-sm text-gray-600">1% de chances</p>
            </div>
          </div>
        </div>

        {/* CTA Final */}
        <div className="bg-gradient-to-r from-green-600 to-sky-600 rounded-2xl shadow-2xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Prêt à faire la différence ?</h2>
          <p className="text-xl mb-8 opacity-90">
            Rejoignez XRP Bloom Garden dès aujourd'hui et transformez vos dons en impact réel.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/donate"
              className="px-8 py-4 bg-white text-green-600 font-bold rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1"
            >
              Faire un don maintenant
            </a>
            <a
              href="/onboarding"
              className="px-8 py-4 bg-green-800 text-white font-bold rounded-lg shadow-lg hover:bg-green-900 transition transform hover:-translate-y-1"
            >
              Créer un compte
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

