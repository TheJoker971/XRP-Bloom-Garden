'use client';

import Header from '@/components/Header';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-sky-50">
      <Header />
      
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-sky-400 rounded-2xl flex items-center justify-center shadow-lg mx-auto">
              <span className="text-4xl">🌸</span>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-green-800 mb-6">
            XRP Bloom Garden
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8 leading-relaxed">
            Plateforme de dons NFT sur XRPL. Créez des jardins NFT pour vos associations
            et recevez des dons en XRP pour un impact social et environnemental durable.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">
              Commencer maintenant
            </button>
            <button className="px-8 py-4 border-2 border-green-600 text-green-600 hover:bg-green-50 font-semibold rounded-lg transition-all">
              En savoir plus
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Feature 1 */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-green-100 hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-6">
              <span className="text-3xl">🌱</span>
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">
              Créer un Garden NFT
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Créez une collection NFT unique pour votre association. Chaque NFT représente un don et contribue à votre cause.
            </p>
            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
              Créer maintenant
            </button>
          </div>

          {/* Feature 2 */}
          <div className="bg-gradient-to-br from-green-50 to-sky-50 rounded-xl shadow-lg p-8 border border-sky-100 hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-sky-100 rounded-lg flex items-center justify-center mb-6">
              <span className="text-3xl">💧</span>
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">
              Faire un don
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Faites un don à une association et recevez un NFT unique en retour. Chaque don contribue à un avenir meilleur.
            </p>
            <button className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
              Faire un don
            </button>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-amber-100 hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-amber-100 rounded-lg flex items-center justify-center mb-6">
              <span className="text-3xl">🌍</span>
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">
              Impact durable
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Suivez l'impact de vos dons en temps réel. Chaque contribution est transparente et traçable sur la blockchain.
            </p>
            <button className="w-full border-2 border-green-600 text-green-600 hover:bg-green-50 font-semibold py-3 px-6 rounded-lg transition-colors">
              Découvrir
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-green-600 to-sky-600 rounded-2xl shadow-xl p-12 mb-16 text-white">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">100+</div>
              <div className="text-green-100 text-lg">Associations</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">10K+</div>
              <div className="text-green-100 text-lg">Dons réalisés</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">50K+</div>
              <div className="text-green-100 text-lg">XRP collectés</div>
            </div>
          </div>
        </div>

        {/* How it works */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-green-800 text-center mb-12">
            Comment ça fonctionne ?
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: '1️⃣', title: 'Créer', desc: 'Créez votre collection NFT' },
              { icon: '2️⃣', title: 'Partager', desc: 'Partagez votre cause' },
              { icon: '3️⃣', title: 'Recevoir', desc: 'Recevez des dons en XRP' },
              { icon: '4️⃣', title: 'Impact', desc: 'Suivez votre impact' },
            ].map((step, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-lg p-6 border border-green-100 text-center">
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-white rounded-2xl shadow-xl p-12 border border-green-100 text-center">
          <h2 className="text-4xl font-bold text-green-800 mb-4">
            Prêt à faire la différence ?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Rejoignez notre communauté et contribuez à un avenir plus durable et solidaire.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-8 py-4 bg-gradient-to-r from-green-500 to-sky-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all">
              Commencer maintenant
            </button>
            <Link 
              href="/charte" 
              className="px-8 py-4 border-2 border-green-600 text-green-600 hover:bg-green-50 font-semibold rounded-lg transition-all"
            >
              Voir la charte
            </Link>
          </div>
        </section>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-green-800 to-sky-800 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🌸</span>
                <h3 className="text-xl font-bold">XRP Bloom Garden</h3>
              </div>
              <p className="text-green-100">
                Plateforme de dons NFT pour un impact social et environnemental durable.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Navigation</h4>
              <ul className="space-y-2 text-green-100">
                <li><Link href="/" className="hover:text-white transition-colors">Accueil</Link></li>
                <li><Link href="/charte" className="hover:text-white transition-colors">Charte graphique</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <p className="text-green-100">
                Rejoignez notre communauté pour plus d'informations.
              </p>
            </div>
          </div>
          <div className="border-t border-green-700 pt-8 text-center text-green-100">
            <p>&copy; 2024 XRP Bloom Garden. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
