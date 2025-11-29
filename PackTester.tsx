import React, { useState } from 'react';
import { Package, Sparkles, TrendingUp } from 'lucide-react';
import { Pack, Rarity, PackItem, DrawnItem } from '../XRP-Bloom-Garden/gameModels';
import { PACKS } from '../XRP-Bloom-Garden/packsData';
import { drawFromPack, simulate1000Draws } from '../XRP-Bloom-Garden/packSystem';

export default function PackTester() {
  const [selectedPack, setSelectedPack] = useState<Pack>(PACKS.pack_nature_basic);
  const [drawnItems, setDrawnItems] = useState<DrawnItem[]>([]);
  const [simulationStats, setSimulationStats] = useState<Record<Rarity, number> | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleDraw = () => {
    const item = drawFromPack(selectedPack);
    setDrawnItems(prev => [item, ...prev].slice(0, 20));
  };

  const handleSimulate = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const stats = simulate1000Draws(selectedPack);
      setSimulationStats(stats);
      setIsSimulating(false);
    }, 100);
  };

  const getRarityColor = (rarity: Rarity) => {
    const colors = {
      [Rarity.COMMON]: "bg-gray-500",
      [Rarity.RARE]: "bg-blue-500",
      [Rarity.EPIC]: "bg-purple-500",
      [Rarity.LEGENDARY]: "bg-yellow-500",
    };
    return colors[rarity];
  };

  const getRarityBgColor = (rarity: Rarity) => {
    const colors = {
      [Rarity.COMMON]: "bg-gray-100",
      [Rarity.RARE]: "bg-blue-100",
      [Rarity.EPIC]: "bg-purple-100",
      [Rarity.LEGENDARY]: "bg-yellow-100",
    };
    return colors[rarity];
  };

  const itemsByRarity = {
    [Rarity.COMMON]: selectedPack.pool.filter(i => i.rarity === Rarity.COMMON),
    [Rarity.RARE]: selectedPack.pool.filter(i => i.rarity === Rarity.RARE),
    [Rarity.EPIC]: selectedPack.pool.filter(i => i.rarity === Rarity.EPIC),
    [Rarity.LEGENDARY]: selectedPack.pool.filter(i => i.rarity === Rarity.LEGENDARY),
  };

  const packsList = Object.values(PACKS);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-3 flex items-center justify-center gap-3">
            <Package className="w-12 h-12 text-green-600" />
            Testeur de Packs Nature
          </h1>
          <p className="text-gray-600 text-lg">
            Testez les probabilités et découvrez les objets disponibles
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* COLONNE 1 : Sélection Pack */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Sélection du Pack</h2>
              
              <div className="space-y-3">
                {packsList.map(pack => (
                  <button
                    key={pack.id}
                    onClick={() => {
                      setSelectedPack(pack);
                      setSimulationStats(null);
                    }}
                    className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                      selectedPack.id === pack.id
                        ? 'border-green-500 bg-green-50 shadow-md'
                        : 'border-gray-200 hover:border-green-300 hover:shadow'
                    }`}
                  >
                    <div className="font-bold text-lg mb-1">
                      {pack.id === 'pack_nature_basic' ? '🌱' : '🌳'} {pack.name}
                    </div>
                    <div className="text-sm text-gray-600 mb-2">{pack.description}</div>
                    <div className="text-green-600 font-bold text-lg">{pack.price} XRPL</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <button
                onClick={handleDraw}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition shadow-lg mb-3 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                🎲 Tirer 1 objet
              </button>
              
              <button
                onClick={handleSimulate}
                disabled={isSimulating}
                className={`w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 rounded-xl font-bold text-lg transition shadow-lg flex items-center justify-center gap-2 ${
                  isSimulating ? 'opacity-50 cursor-not-allowed' : 'hover:from-blue-700 hover:to-cyan-700'
                }`}
              >
                <TrendingUp className="w-5 h-5" />
                {isSimulating ? '⏳ Simulation...' : '📊 Simuler 1000 tirages'}
              </button>
            </div>
          </div>

          {/* COLONNE 2 : Probabilités et Pool */}
          <div className="space-y-6">
            {/* Probabilités */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">📊 Probabilités</h2>
              
              <div className="space-y-4">
                {Object.entries(selectedPack.probabilities).map(([rarity, prob]) => (
                  <div key={rarity}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-bold text-sm px-3 py-1 rounded-full ${getRarityColor(rarity as Rarity)} text-white`}>
                        {rarity}
                      </span>
                      <span className="font-bold text-lg">{prob}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className={`h-full ${getRarityColor(rarity as Rarity)} transition-all duration-500`}
                        style={{ width: `${prob}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pool d'objets */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">🎁 Objets Disponibles</h2>
              
              <div className="space-y-3">
                {Object.entries(itemsByRarity).map(([rarity, items]) => (
                  items.length > 0 && (
                    <div key={rarity} className={`p-3 rounded-lg ${getRarityBgColor(rarity as Rarity)}`}>
                      <div className={`text-xs font-bold mb-2 px-2 py-1 rounded inline-block ${getRarityColor(rarity as Rarity)} text-white`}>
                        {rarity}
                      </div>
                      <div className="space-y-1">
                        {items.map(item => (
                          <div key={item.id} className="text-sm font-medium text-gray-700">
                            • {item.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>

          {/* COLONNE 3 : Résultats */}
          <div className="space-y-6">
            {/* Simulation Stats */}
            {simulationStats && (
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl shadow-lg p-6 border-2 border-blue-200">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                  Résultats 1000 Tirages
                </h2>
                
                <div className="space-y-4">
                  {Object.entries(simulationStats).map(([rarity, count]) => {
                    const expected = selectedPack.probabilities[rarity as Rarity];
                    const actual = (count / 10).toFixed(1);
                    const diff = Math.abs(parseFloat(actual) - expected);
                    
                    return (
                      <div key={rarity} className="bg-white rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-xs font-bold px-2 py-1 rounded ${getRarityColor(rarity as Rarity)} text-white`}>
                            {rarity}
                          </span>
                          <span className="text-2xl font-black text-gray-800">{count}</span>
                        </div>
                        <div className="text-sm space-y-1">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Attendu:</span>
                            <span className="font-semibold">{expected}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Obtenu:</span>
                            <span className="font-semibold">{actual}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Différence:</span>
                            <span className={`font-semibold ${diff < 2 ? 'text-green-600' : diff < 5 ? 'text-orange-600' : 'text-red-600'}`}>
                              ±{diff.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-4 text-xs text-gray-600 bg-white rounded-lg p-3">
                  ℹ️ Une différence de ±2-3% est normale avec 1000 tirages
                </div>
              </div>
            )}

            {/* Tirages individuels */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">🎁 Derniers Tirages</h2>
              
              {drawnItems.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Package className="w-16 h-16 mx-auto mb-3 opacity-30" />
                  <p>Aucun tirage effectué</p>
                  <p className="text-sm mt-2">Cliquez sur "Tirer 1 objet"</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {drawnItems.map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-lg border-l-4 ${getRarityColor(item.rarity)} ${getRarityBgColor(item.rarity)} transition-all hover:shadow-md`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-800">{item.name}</span>
                        <span className={`text-xs font-bold px-2 py-1 rounded ${getRarityColor(item.rarity)} text-white`}>
                          {item.rarity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}