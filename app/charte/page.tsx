'use client';

import React from 'react';

export default function CharteGraphiquePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-green-800 mb-4">
            Charte Graphique - Projet Social & Environnemental
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Guide de style pour un projet dédié à la protection de l'environnement et au développement social durable
          </p>
        </header>

        {/* Palette de couleurs principales */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-green-800 mb-6">Palette de Couleurs Principales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Verts */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Verts Nature</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg border"></div>
                  <div>
                    <p className="font-medium">Vert Clair</p>
                    <p className="text-sm text-gray-600">#F0FDF4</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-200 rounded-lg"></div>
                  <div>
                    <p className="font-medium">Vert Doux</p>
                    <p className="text-sm text-gray-600">#DCFCE7</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-400 rounded-lg"></div>
                  <div>
                    <p className="font-medium">Vert Vif</p>
                    <p className="text-sm text-gray-600">#4ADE80</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-600 rounded-lg"></div>
                  <div>
                    <p className="font-medium">Vert Principal</p>
                    <p className="text-sm text-gray-600">#16A34A</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-800 rounded-lg"></div>
                  <div>
                    <p className="font-medium">Vert Foncé</p>
                    <p className="text-sm text-gray-600">#166534</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bleus */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Bleus Ciel</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-sky-100 rounded-lg border"></div>
                  <div>
                    <p className="font-medium">Bleu Clair</p>
                    <p className="text-sm text-gray-600">#F0F9FF</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-sky-200 rounded-lg"></div>
                  <div>
                    <p className="font-medium">Bleu Doux</p>
                    <p className="text-sm text-gray-600">#E0F2FE</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-sky-400 rounded-lg"></div>
                  <div>
                    <p className="font-medium">Bleu Vif</p>
                    <p className="text-sm text-gray-600">#38BDF8</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-sky-600 rounded-lg"></div>
                  <div>
                    <p className="font-medium">Bleu Principal</p>
                    <p className="text-sm text-gray-600">#0284C7</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-sky-800 rounded-lg"></div>
                  <div>
                    <p className="font-medium">Bleu Foncé</p>
                    <p className="text-sm text-gray-600">#075985</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Couleurs complémentaires */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Couleurs Terre</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-amber-100 rounded-lg border"></div>
                  <div>
                    <p className="font-medium">Sable Clair</p>
                    <p className="text-sm text-gray-600">#FFFBEB</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-amber-300 rounded-lg"></div>
                  <div>
                    <p className="font-medium">Soleil</p>
                    <p className="text-sm text-gray-600">#FCD34D</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-400 rounded-lg"></div>
                  <div>
                    <p className="font-medium">Terre</p>
                    <p className="text-sm text-gray-600">#FB923C</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-stone-600 rounded-lg"></div>
                  <div>
                    <p className="font-medium">Roche</p>
                    <p className="text-sm text-gray-600">#57534E</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Couleurs neutres */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Neutres</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-lg border-2 border-gray-200"></div>
                  <div>
                    <p className="font-medium">Blanc Pur</p>
                    <p className="text-sm text-gray-600">#FFFFFF</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg"></div>
                  <div>
                    <p className="font-medium">Gris Clair</p>
                    <p className="text-sm text-gray-600">#F3F4F6</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-400 rounded-lg"></div>
                  <div>
                    <p className="font-medium">Gris Moyen</p>
                    <p className="text-sm text-gray-600">#9CA3AF</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-800 rounded-lg"></div>
                  <div>
                    <p className="font-medium">Gris Foncé</p>
                    <p className="text-sm text-gray-600">#1F2937</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Typographie */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-green-800 mb-6">Typographie</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Titres & Headers</h3>
              <div className="space-y-4">
                <div>
                  <h1 className="text-4xl font-bold text-green-800">Titre Principal H1</h1>
                  <p className="text-sm text-gray-600 mt-1">Font: Inter Bold, 36px</p>
                </div>
                <div>
                  <h2 className="text-3xl font-semibold text-green-700">Titre Secondaire H2</h2>
                  <p className="text-sm text-gray-600 mt-1">Font: Inter Semibold, 30px</p>
                </div>
                <div>
                  <h3 className="text-2xl font-medium text-green-600">Titre Tertiaire H3</h3>
                  <p className="text-sm text-gray-600 mt-1">Font: Inter Medium, 24px</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Corps de Texte</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-lg text-gray-800">
                    Paragraphe principal - Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Font: Inter Regular, 18px</p>
                </div>
                <div>
                  <p className="text-base text-gray-700">
                    Texte standard - Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Font: Inter Regular, 16px</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    Texte secondaire - Ut enim ad minim veniam, quis nostrud exercitation.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Font: Inter Regular, 14px</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Boutons */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-green-800 mb-6">Boutons & Éléments Interactifs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Boutons Principaux</h3>
              <div className="space-y-3">
                <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                  Action Principale
                </button>
                <button className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                  Action Secondaire
                </button>
                <button className="w-full border-2 border-green-600 text-green-600 hover:bg-green-50 font-semibold py-3 px-6 rounded-lg transition-colors">
                  Action Tertiaire
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">États des Boutons</h3>
              <div className="space-y-3">
                <button className="w-full bg-green-600 text-white font-semibold py-3 px-6 rounded-lg">
                  Normal
                </button>
                <button className="w-full bg-green-700 text-white font-semibold py-3 px-6 rounded-lg">
                  Hover
                </button>
                <button className="w-full bg-green-400 text-white font-semibold py-3 px-6 rounded-lg opacity-50 cursor-not-allowed">
                  Désactivé
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Boutons Spéciaux</h3>
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-green-500 to-sky-500 text-white font-semibold py-3 px-6 rounded-lg">
                  Gradient Nature
                </button>
                <button className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                  Alerte/Warning
                </button>
                <button className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                  Danger/Urgence
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Cards & Composants */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-green-800 mb-6">Cards & Composants</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card basique */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <div className="w-6 h-6 bg-green-600 rounded"></div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Card Basique</h3>
              <p className="text-gray-600 mb-4">Description du contenu avec un style cohérent.</p>
              <button className="text-green-600 font-semibold hover:text-green-700">En savoir plus →</button>
            </div>

            {/* Card avec gradient */}
            <div className="bg-gradient-to-br from-green-50 to-sky-50 rounded-xl shadow-lg p-6 border border-sky-100">
              <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center mb-4">
                <div className="w-6 h-6 bg-sky-600 rounded"></div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Card Gradient</h3>
              <p className="text-gray-600 mb-4">Variante avec fond dégradé subtil.</p>
              <button className="text-sky-600 font-semibold hover:text-sky-700">Découvrir →</button>
            </div>

            {/* Card highlight */}
            <div className="bg-green-600 text-white rounded-xl shadow-lg p-6">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                <div className="w-6 h-6 bg-white rounded"></div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Card Highlight</h3>
              <p className="text-green-100 mb-4">Pour mettre en avant du contenu important.</p>
              <button className="text-white font-semibold hover:text-green-100">Action →</button>
            </div>
          </div>
        </section>

        {/* Iconographie */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-green-800 mb-6">Style d'Iconographie</h2>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
              {/* Icônes nature */}
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="text-green-600 text-xl">🌱</span>
                </div>
                <p className="text-sm text-gray-600">Croissance</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="text-green-600 text-xl">🌿</span>
                </div>
                <p className="text-sm text-gray-600">Nature</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="text-sky-600 text-xl">💧</span>
                </div>
                <p className="text-sm text-gray-600">Eau Pure</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="text-sky-600 text-xl">🌤️</span>
                </div>
                <p className="text-sm text-gray-600">Ciel Clair</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="text-amber-600 text-xl">♻️</span>
                </div>
                <p className="text-sm text-gray-600">Recyclage</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="text-green-600 text-xl">🌍</span>
                </div>
                <p className="text-sm text-gray-600">Planète</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="text-amber-600 text-xl">☀️</span>
                </div>
                <p className="text-sm text-gray-600">Énergie</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="text-green-600 text-xl">🤝</span>
                </div>
                <p className="text-sm text-gray-600">Social</p>
              </div>
            </div>
          </div>
        </section>

        {/* Principes de Design */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-green-800 mb-6">Principes de Design</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Philosophie</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">•</span>
                  <span><strong>Naturel :</strong> Inspiré par la nature, couleurs organiques</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sky-600 font-bold">•</span>
                  <span><strong>Pur :</strong> Design épuré, espaces blancs généreux</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">•</span>
                  <span><strong>Accessible :</strong> Contrastes suffisants, lisibilité optimale</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sky-600 font-bold">•</span>
                  <span><strong>Durable :</strong> Cohérence sur tous les supports</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Bonnes Pratiques</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-600">✓</span>
                  <span>Utiliser les verts pour les actions positives</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sky-600">✓</span>
                  <span>Utiliser les bleus pour l'information</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600">✓</span>
                  <span>Maintenir des espaces blancs généreux</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sky-600">✓</span>
                  <span>Privilégier la simplicité et la clarté</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-8 border-t border-green-200">
          <p className="text-gray-600">
            Charte graphique - Projet Social & Environnemental
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Version 1.0 - Créée pour promouvoir un avenir durable
          </p>
        </footer>
      </div>
    </div>
  );
}
