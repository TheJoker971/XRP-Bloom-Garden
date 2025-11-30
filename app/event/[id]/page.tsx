'use client';

import { useState, useEffect, use } from 'react';
import { Header } from '@/components/Header';
import { useXRPLWallet } from '@/components/providers/XRPLWalletProvider';
import { Flame, Droplet, Trophy, Zap, Users } from 'lucide-react';

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
    associationId: string;
    associationWalletAddress?: string | null;
  } | null;
  leaderboard: Array<{
    walletAddress: string;
    totalTickets: number;
    totalDamage: number;
    totalAmount: number;
    contributions: number;
  }>;
}

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { isConnected, walletInfo, walletType } = useXRPLWallet();
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  const [showCrisisPopup, setShowCrisisPopup] = useState(false);
  const [popupWasClosedThisSession, setPopupWasClosedThisSession] = useState(false);
  const [lastDamage, setLastDamage] = useState<number | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [damageHistory, setDamageHistory] = useState<Array<{damage: number, timestamp: number}>>([]);
  const [winnerAddress, setWinnerAddress] = useState<string | null>(null);

  useEffect(() => {
    fetchEventData();
    const interval = setInterval(fetchEventData, 5000);
    return () => clearInterval(interval);
  }, [resolvedParams.id]);

  useEffect(() => {
    // Afficher la popup de crise si l'événement est actif
    // ET si elle n'a pas été fermée pendant cette session
    if (eventData?.event && eventData.event.status === 'active' && !popupWasClosedThisSession) {
      // Utiliser un petit délai pour s'assurer que le DOM est prêt
      setTimeout(() => {
        setShowCrisisPopup(true);
      }, 100);
    } else if (eventData?.event?.status !== 'active') {
      setShowCrisisPopup(false);
    }
  }, [eventData, resolvedParams.id, popupWasClosedThisSession]);

  const fetchEventData = async () => {
    try {
      const response = await fetch(`/api/events/${resolvedParams.id}`);
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

    if (!eventData?.event?.associationWalletAddress) {
      alert('L\'association n\'a pas configuré son adresse wallet');
      return;
    }

    setPurchasing(true);
    setLastDamage(null);

    const amount = packType === 'basic' ? 5 : 20;

    try {
      // 1. Envoyer le paiement XRPL réel
      const { sendPaymentWithWallet } = await import('@/lib/xrpl-client-service-v2');
      
      // Utiliser le type de wallet connecté (gem, xaman, crossmark)
      const currentWalletType = walletType || 'gem'; // Par défaut GemWallet si non défini
      
      const paymentResult = await sendPaymentWithWallet(
        currentWalletType,
        {
          fromAddress: walletInfo.address,
          toAddress: eventData.event.associationWalletAddress,
          amount,
          memo: `Contribution à l'événement: ${eventData.event.name}`,
          eventMetadata: {
            type: 'event_contribution',
            eventId: resolvedParams.id,
            eventName: eventData.event.name,
            packType,
            amount,
          },
        }
      );

      // 2. Enregistrer la contribution
      const response = await fetch('/api/events/contribute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: resolvedParams.id,
          walletAddress: walletInfo.address,
          packType,
          amount,
          paymentTxHash: paymentResult.txHash,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'achat');
      }

      setLastDamage(data.damage);
      setDamageHistory(prev => [...prev, { damage: data.damage, timestamp: Date.now() }]);
      
      const impactMessages = {
        basic: [
          `Votre don vient d'éteindre ${data.damage * 5} m² du brasier !`,
          `${data.damage} litres d'eau déversés ! Merci pour votre générosité.`,
          `Vous avez sauvé ${Math.floor(data.damage / 2)} arbres ! Bravo !`,
        ],
        premium: [
          `Canadair en vol grâce à vous ! ${data.damage * 5} m² protégés !`,
          `Intervention d'urgence déclenchée ! ${data.damage} PV de dégâts !`,
          `Vous venez de sauver une zone entière de la forêt ! Merci !`,
        ],
      };
      
      const messages = impactMessages[packType];
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      setNotification(randomMessage);
      setTimeout(() => setNotification(null), 6000);

      if (data.eventCompleted) {
        if (data.isWinner) {
          setWinnerAddress(walletInfo.address);
        }
        setTimeout(() => setShowVictory(true), 1500);
      }

      await fetchEventData();
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
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Événement introuvable</h1>
          <p className="text-gray-600 mb-8">Cet événement n'existe pas ou a été supprimé.</p>
          <a
            href="/events"
            className="inline-block px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-bold hover:from-green-700 hover:to-emerald-700 transition"
          >
            Voir tous les événements
          </a>
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

      {isCrisis && (
        <div className="fixed inset-0 bg-gradient-to-b from-orange-500/20 to-red-500/20 pointer-events-none z-0 animate-pulse" />
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {notification && (
          <div className="fixed top-24 right-4 z-50 animate-slide-in-right">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-lg shadow-2xl border-2 border-white">
              <div className="flex items-center gap-3">
                <div className="text-2xl">✅</div>
                <div>
                  <div className="font-bold">{notification}</div>
                  <div className="text-xs text-white/80">Continuez à combattre l'incendie !</div>
                </div>
              </div>
            </div>
          </div>
        )}

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

          {damageHistory.length > 0 && (
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {damageHistory.slice(-5).reverse().map((item, index) => (
                <span
                  key={item.timestamp}
                  className={`inline-block px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full font-bold text-sm shadow-lg ${
                    index === 0 ? 'animate-bounce scale-110' : 'opacity-70'
                  }`}
                >
                  -{item.damage} PV
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Bouton pour activer l'événement dans le village */}
        <div className="mb-8 text-center">
          <button
            onClick={() => {
              localStorage.setItem("participatingEvent", JSON.stringify({
                id: event.id,
                name: event.name,
                associationId: event.associationId,
                usedBuckets: 0,
                totalNeeded: 10
              }));
              alert("🔥 L'événement incendie est maintenant actif dans ton village ! Va sur la page 'Faire un don' pour obtenir des sceaux d'eau et éteindre l'incendie (10 sceaux nécessaires = 50 XRP). Tes dons iront automatiquement à l'association qui a créé cet événement !");
            }}
            className="px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-2xl font-bold text-lg hover:from-orange-700 hover:to-red-700 transition shadow-xl hover:shadow-2xl hover:scale-105 transform"
          >
            🏡 Activer l'événement dans mon village
          </button>
          <p className="text-sm text-gray-600 mt-2">
            Ton village passera en mode incendie. Utilise des sceaux d'eau pour éteindre le feu !
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Combattez l'Incendie !</h2>
            
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
                disabled={purchasing || isCompleted || !isConnected || !walletInfo}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-lg font-bold hover:from-blue-600 hover:to-cyan-600 transition disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transform"
              >
                {purchasing ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⏳</span>
                    Action en cours...
                  </span>
                ) : isCompleted ? '✅ Événement Terminé' : !isConnected || !walletInfo ? '🔒 Connectez votre wallet' : '💧 Lancer un Seau'}
              </button>
            </div>

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
                disabled={purchasing || isCompleted || !isConnected || !walletInfo}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-bold hover:from-purple-600 hover:to-pink-600 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:scale-105 active:scale-95 transform"
              >
                {purchasing ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⏳</span>
                    Action en cours...
                  </span>
                ) : isCompleted ? '✅ Événement Terminé' : !isConnected || !walletInfo ? '🔒 Connectez votre wallet' : '✈️ Appeler le Canadair'}
              </button>
            </div>
          </div>

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

      {showCrisisPopup && isCrisis && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4 backdrop-blur-sm overflow-y-auto">
          {/* Images du pompier de chaque côté - à l'extérieur de la popup */}
          <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden lg:block z-[101] pointer-events-none">
            <img 
              src="/pompier.png" 
              alt="Pompier" 
              className="w-40 h-40 object-contain animate-bounce"
            />
          </div>
          <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block z-[101] pointer-events-none">
            <img 
              src="/pompier.png" 
              alt="Pompier" 
              className="w-40 h-40 object-contain animate-bounce scale-x-[-1]"
            />
          </div>
          
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 max-w-2xl w-full border-4 border-orange-500 shadow-2xl animate-pulse-slow relative z-[102] my-auto">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-4 mb-4">
                <Flame className="w-16 h-16 text-orange-600 animate-bounce" />
                <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
                  Le ciel s'embrase !
                </h2>
                <Flame className="w-16 h-16 text-orange-600 animate-bounce" />
              </div>
              
              <div className="bg-white/80 rounded-xl p-6 mb-6 border-2 border-orange-300">
                <p className="text-xl text-gray-800 leading-relaxed mb-4">
                  Un vent violent attise un feu de forêt menaçant tout le village. Les équipes manquent de moyens : <strong className="text-orange-600">nous avons besoin de vous</strong> pour déclencher l'intervention d'urgence !
                </p>
                <p className="text-lg text-gray-700">
                  Chaque contribution compte <strong className="text-red-600">DOUBLE</strong> pendant cette crise. Ensemble, sauvons la forêt !
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 text-left">
                <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-300">
                  <div className="text-3xl mb-2">💧</div>
                  <div className="font-bold text-blue-800">Seau d'eau</div>
                  <div className="text-sm text-gray-600">5 XRP • Impact immédiat</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-300">
                  <div className="text-3xl mb-2">✈️</div>
                  <div className="font-bold text-purple-800">Canadair</div>
                  <div className="text-sm text-gray-600">20 XRP • Impact massif</div>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowCrisisPopup(false);
                  setPopupWasClosedThisSession(true);
                }}
                className="w-full px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-bold text-xl hover:from-orange-700 hover:to-red-700 transition shadow-lg"
              >
                🚨 Rejoindre la lutte !
              </button>
            </div>
          </div>
        </div>
      )}

      {showVictory && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 max-w-2xl w-full border-4 border-green-500 shadow-2xl">
            <div className="text-center">
              <div className="text-8xl mb-6 animate-bounce">🎉</div>
              <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 mb-4">
                L'incendie est maîtrisé !
              </h2>
              <p className="text-2xl text-gray-800 font-bold mb-6">
                La communauté a gagné ! 🏆
              </p>
              
              <div className="bg-white rounded-xl p-6 mb-6 border-2 border-green-300">
                <p className="text-lg text-gray-700 mb-4">
                  Grâce à votre mobilisation collective, le brasier a été éteint et la forêt est sauvée !
                </p>
                <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                  <div>
                    <div className="text-2xl font-bold text-green-600">{leaderboard.length}</div>
                    <div>Héros</div>
                  </div>
                  <div className="w-px h-12 bg-gray-300"></div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {leaderboard.reduce((sum, entry) => sum + Number(entry.totalAmount), 0).toFixed(0)}
                    </div>
                    <div>XRP collectés</div>
                  </div>
                  <div className="w-px h-12 bg-gray-300"></div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">1000</div>
                    <div>PV éteints</div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-100 to-red-100 rounded-xl p-6 mb-6 border-4 border-orange-400">
                <div className="text-6xl mb-3">🔥</div>
                <h3 className="text-3xl font-bold text-gray-800 mb-2">Ignis</h3>
                <p className="text-lg font-semibold text-orange-700 mb-3">Le Soldat du Feu</p>
                <div className="bg-white/80 rounded-lg p-4 text-sm text-gray-700 leading-relaxed">
                  <p className="italic">
                    « Ignis, Soldat du Feu légendaire, n'apparaît que lors des crises les plus intenses. Seuls les donateurs les plus courageux du Brasier des Cimes pourront l'accueillir dans leur village. »
                  </p>
                </div>
                
                {winnerAddress ? (
                  <div className="mt-4 p-4 bg-yellow-50 border-2 border-yellow-400 rounded-lg">
                    <p className="text-lg font-bold text-yellow-800 mb-2">
                      🎊 Félicitations, vous avez gagné Ignis !
                    </p>
                    <p className="text-sm text-gray-600">
                      Le NFT légendaire sera transféré vers votre wallet
                    </p>
                  </div>
                ) : (
                  <div className="mt-4 p-4 bg-gray-50 border-2 border-gray-300 rounded-lg">
                    <p className="text-sm font-bold text-gray-700 mb-1">
                      🎲 Tirage au sort en cours...
                    </p>
                    <p className="text-xs text-gray-600">
                      Un contributeur sera tiré au sort pour recevoir Ignis
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={() => setShowVictory(false)}
                className="w-full px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold text-xl hover:from-green-700 hover:to-emerald-700 transition shadow-lg"
              >
                Continuer l'aventure
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

