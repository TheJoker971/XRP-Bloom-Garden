'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { useXRPLWallet } from '@/components/providers/XRPLWalletProvider';
import { Flame, Droplet, Trophy, Zap, Users } from 'lucide-react';
import { Client, Payment } from 'xrpl';

interface EventData {
  event: {
    id: string;
    name: string;
    description: string;
    currentHealth: number;
    maxHealth: number;
    multiplier: number;
    healthPercentage: number;
    status: string;
  } | null;
  leaderboard: Array<{
    walletAddress: string;
    totalTickets: number;
    totalDamage: number;
    totalAmount: number;
    contributions: number;
  }>;
}

export default function EventPage() {
  const { isConnected, walletInfo } = useXRPLWallet();
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  const [lastDamage, setLastDamage] = useState<number | null>(null);

  useEffect(() => {
    fetchEventData();
    const interval = setInterval(fetchEventData, 5000); // Refresh toutes les 5 secondes
    return () => clearInterval(interval);
  }, []);

  const fetchEventData = async () => {
    try {
      const response = await fetch('/api/events/current');
      const data = await response.json();
      setEventData(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (packType: 'basic' | 'premium') => {
    if (!isConnected || !walletInfo) {
      alert('Veuillez connecter votre wallet');
      return;
    }

    setPurchasing(true);
    setLastDamage(null);

    try {
      const amount = packType === 'basic' ? 5 : 20;
      const associationAddress = 'rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH'; // Adresse de GreenShield

      // Créer la transaction XRPL
      const client = new Client('wss://s.altnet.rippletest.net:51233');
      await client.connect();

      // Note: Dans une vraie implémentation, vous devriez signer avec le wallet
      // Pour la démo, on simule juste la transaction
      const txHash = `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Enregistrer la contribution
      const response = await fetch('/api/events/contribute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: walletInfo.address,
          packType,
          amount,
          txHash,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'achat');
      }

      setLastDamage(data.damage);

      // Si l'événement est terminé et que c'est le gagnant
      if (data.eventCompleted && data.isWinner) {
        setShowVictory(true);
      }

      // Rafraîchir les données
      await fetchEventData();

      await client.disconnect();
    } catch (error: any) {
      console.error('Erreur:', error);
      alert(error.message || 'Erreur lors de l\'achat');
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
        <Header />
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!eventData?.event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-sky-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Aucun événement actif</h1>
          <p className="text-gray-600">Revenez plus tard pour participer aux événements !</p>
        </div>
      </div>
    );
  }

  const { event, leaderboard } = eventData;
  const isCrisis = event.status === 'active';
  const isCompleted = event.status === 'completed';

  return (
    <div className={`min-h-screen transition-all duration-1000 ${
      isCrisis 
        ? 'bg-gradient-to-br from-orange-100 via-red-100 to-yellow-100' 
        : 'bg-gradient-to-br from-green-50 via-white to-sky-50'
    }`}>
      <Header />

      {/* Overlay de crise */}
      {isCrisis && (
        <div className="fixed inset-0 bg-gradient-to-b from-orange-500/20 to-red-500/20 pointer-events-none z-0 animate-pulse" />
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* En-tête de l'événement */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Flame className="w-12 h-12 text-orange-600 animate-bounce" />
            <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
              {event.name}
            </h1>
            <Flame className="w-12 h-12 text-orange-600 animate-bounce" />
          </div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            {event.description}
          </p>
          
          {isCrisis && (
            <div className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-bold text-lg animate-pulse shadow-lg">
              <Zap className="w-5 h-5" />
              IMPACT x{event.multiplier} !
              <Zap className="w-5 h-5" />
            </div>
          )}
        </div>

        {/* Barre de vie de l'incendie */}
        <div className="mb-8 bg-white rounded-xl shadow-lg p-6 border-4 border-orange-300">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Flame className="w-6 h-6 text-orange-600" />
              Santé de l'Incendie
            </h2>
            <span className="text-3xl font-black text-orange-600">
              {event.currentHealth} / {event.maxHealth} PV
            </span>
          </div>
          
          <div className="relative w-full h-12 bg-gray-200 rounded-full overflow-hidden border-2 border-gray-300">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 transition-all duration-1000 ease-out flex items-center justify-center"
              style={{ width: `${event.healthPercentage}%` }}
            >
              {event.healthPercentage > 10 && (
                <span className="text-white font-bold text-lg drop-shadow-lg">
                  {event.healthPercentage.toFixed(1)}%
                </span>
              )}
            </div>
          </div>

          {lastDamage && (
            <div className="mt-4 text-center">
              <span className="inline-block px-6 py-2 bg-blue-500 text-white rounded-full font-bold text-xl animate-bounce">
                -{lastDamage} PV !
              </span>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Packs d'action */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Combattez l'Incendie !</h2>
            
            {/* Pack Basic */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-200 hover:border-blue-400 transition">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Droplet className="w-6 h-6 text-blue-500" />
                    Seau d'Eau
                  </h3>
                  <p className="text-gray-600 mt-1">Pack Forêt Simple</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-blue-600">5 XRP</div>
                  <div className="text-sm text-gray-500">-{10 * event.multiplier} PV</div>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>Dégâts: {10 * event.multiplier} PV</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  <span>Récompense: 1 Ticket + Petit Arbre NFT</span>
                </div>
              </div>

              <button
                onClick={() => handlePurchase('basic')}
                disabled={purchasing || isCompleted || !isConnected}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-lg font-bold hover:from-blue-600 hover:to-cyan-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {purchasing ? '⏳ Achat...' : isCompleted ? '✅ Événement Terminé' : !isConnected ? '🔒 Connectez votre wallet' : '💧 Lancer un Seau'}
              </button>
            </div>

            {/* Pack Premium */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-lg p-6 border-4 border-purple-300 hover:border-purple-500 transition relative overflow-hidden">
              <div className="absolute top-2 right-2">
                <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full">
                  ⭐ PREMIUM
                </span>
              </div>

              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <span className="text-3xl">✈️</span>
                    Canadair
                  </h3>
                  <p className="text-gray-600 mt-1">Pack Forêt Premium</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-purple-600">20 XRP</div>
                  <div className="text-sm text-gray-500">-{50 * event.multiplier} PV</div>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  <span className="font-bold">Dégâts: {50 * event.multiplier} PV (MASSIF !)</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  <span>Récompense: 5 Tickets + Chêne Rare NFT</span>
                </div>
              </div>

              <button
                onClick={() => handlePurchase('premium')}
                disabled={purchasing || isCompleted || !isConnected}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-bold hover:from-purple-600 hover:to-pink-600 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {purchasing ? '⏳ Achat...' : isCompleted ? '✅ Événement Terminé' : !isConnected ? '🔒 Connectez votre wallet' : '✈️ Appeler le Canadair'}
              </button>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              Top Héros
            </h2>

            {leaderboard && leaderboard.length > 0 ? (
              <div className="space-y-3">
                {leaderboard.map((entry, index) => (
                  <div
                    key={entry.walletAddress}
                    className={`p-3 rounded-lg ${
                      index === 0
                        ? 'bg-gradient-to-r from-yellow-100 to-amber-100 border-2 border-yellow-400'
                        : index === 1
                        ? 'bg-gradient-to-r from-gray-100 to-slate-100 border-2 border-gray-400'
                        : index === 2
                        ? 'bg-gradient-to-r from-orange-100 to-amber-100 border-2 border-orange-400'
                        : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                      </span>
                      <span className="font-mono text-sm font-medium truncate flex-1">
                        {entry.walletAddress.slice(0, 8)}...{entry.walletAddress.slice(-6)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 ml-8">
                      <div className="font-bold text-purple-600">{Number(entry.totalTickets)} tickets</div>
                      <div>{Number(entry.totalDamage)} dégâts • {Number(entry.totalAmount)} XRP</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Soyez le premier à contribuer !</p>
              </div>
            )}

            {isCompleted && (
              <div className="mt-6 p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg border-2 border-green-400">
                <p className="text-center font-bold text-green-800">
                  🎉 Incendie éteint !<br />
                  Les 3 premiers reçoivent Ignis !
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de victoire */}
      {showVictory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center animate-bounce">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500 mb-4">
              VICTOIRE !
            </h2>
            <p className="text-xl text-gray-700 mb-4">
              Vous avez reçu le héros légendaire :
            </p>
            <div className="bg-gradient-to-br from-orange-100 to-red-100 rounded-xl p-6 mb-6 border-4 border-orange-400">
              <div className="text-5xl mb-2">🔥</div>
              <h3 className="text-2xl font-bold text-gray-800">Ignis</h3>
              <p className="text-gray-600">Le Soldat du Feu</p>
            </div>
            <button
              onClick={() => setShowVictory(false)}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-bold hover:from-green-600 hover:to-emerald-600 transition"
            >
              Continuer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

