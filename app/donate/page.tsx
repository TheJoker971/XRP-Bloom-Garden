"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { useXRPLWallet } from "@/components/providers/XRPLWalletProvider";
import { Heart, Gift, Sparkles, ChevronRight } from "lucide-react";
import { drawFromPack, simulate1000Draws } from "@/utils/packSystem";
import { PACKS } from "@/utils/packsData";
import GardenCanvas from "@/components/GardenCanvas";
import DraggableItem from "@/components/DraggableItem";
import CardReveal from "@/components/CardReveal";
import PackOpening from "@/components/PackOpening";

interface Association {
  id: string;
  name: string;
  type: string;
  description: string;
  walletAddress: string;
}

export default function DonatePage() {
  const { isConnected, walletInfo, walletType } = useXRPLWallet();
  const [associations, setAssociations] = useState<Association[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssociation, setSelectedAssociation] =
    useState<Association | null>(null);
  const [donationAmount, setDonationAmount] = useState("");
  const [donating, setDonating] = useState(false);
  const [drawnItems, setDrawnItems] = useState<any[]>([]);
  const [showRewards, setShowRewards] = useState(false);
  const [showCardReveal, setShowCardReveal] = useState(false);
  const [showPackOpening, setShowPackOpening] = useState(false);
  const [villageItems, setVillageItems] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [dragQuantities, setDragQuantities] = useState<Record<string, number>>({});
  const [activeEvent, setActiveEvent] = useState<any>(null);
  const [eventProgress, setEventProgress] = useState(0);

  useEffect(() => {
    fetchAssociations();
    loadVillageItems();
    fetchUser();
    loadActiveEvent();
  }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.user) {
          setUser(data.user);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    }
  };

  const fetchAssociations = async () => {
    try {
      const response = await fetch("/api/associations/approved");
      const data = await response.json();
      // Filtrer côté client aussi pour être sûr (seulement celles avec walletAddress)
      const associationsWithWallet = (data.associations || []).filter(
        (assoc: Association) => assoc.walletAddress && assoc.walletAddress.trim() !== ''
      );
      setAssociations(associationsWithWallet);
      
      // Si un événement est actif, pré-sélectionner l'association de cet événement
      const saved = localStorage.getItem("participatingEvent");
      if (saved) {
        const eventData = JSON.parse(saved);
        if (eventData.associationId) {
          const eventAssociation = associationsWithWallet.find(
            (assoc: Association) => assoc.id === eventData.associationId
          );
          if (eventAssociation) {
            setSelectedAssociation(eventAssociation);
          }
        }
      }
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadVillageItems = () => {
    const saved = localStorage.getItem("villageItems");
    if (saved) {
      setVillageItems(JSON.parse(saved));
    }
  };

  const loadActiveEvent = () => {
    const saved = localStorage.getItem("participatingEvent");
    if (saved) {
      const eventData = JSON.parse(saved);
      
      // Migration : corriger l'ancien totalNeeded de 20 à 10
      if (eventData.totalNeeded === 20) {
        eventData.totalNeeded = 10;
        // Ajuster aussi usedBuckets proportionnellement si nécessaire
        if (eventData.usedBuckets > 10) {
          eventData.usedBuckets = Math.min(10, Math.floor(eventData.usedBuckets / 2));
        }
        localStorage.setItem("participatingEvent", JSON.stringify(eventData));
      }
      
      setActiveEvent(eventData);
      const usedBuckets = eventData.usedBuckets || 0;
      const totalNeeded = eventData.totalNeeded || 10;
      setEventProgress(Math.min(100, (usedBuckets / totalNeeded) * 100));
    }
  };

  const saveVillageItems = (items: any[]) => {
    localStorage.setItem("villageItems", JSON.stringify(items));
    setVillageItems(items);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "nature":
        return "🌿";
      case "eau":
        return "💧";
      case "humanitaire":
        return "❤️";
      case "air":
        return "💨";
      case "feu":
        return "🔥";
      default:
        return "🌿";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "nature":
        return "from-green-500 to-emerald-500";
      case "eau":
        return "from-blue-500 to-cyan-500";
      case "humanitaire":
        return "from-pink-500 to-rose-500";
      case "air":
        return "from-sky-400 to-blue-400";
      case "feu":
        return "from-red-500 to-orange-500";
      default:
        return "from-green-500 to-emerald-500";
    }
  };

  const calculateDraws = (amount: number) => {
    return Math.floor(amount / 5);
  };

  const handleDonate = async () => {
    if (!isConnected || !walletInfo || !selectedAssociation || !donationAmount) {
      alert("Veuillez remplir tous les champs et connecter votre wallet");
      return;
    }

    if (!selectedAssociation.walletAddress) {
      alert('Cette association n\'a pas configuré son adresse wallet');
      return;
    }

    const amount = parseFloat(donationAmount);
    if (amount < 5) {
      alert("Le don minimum est de 5 XRP");
      return;
    }

    setDonating(true);

    try {
      // 1. Envoyer le paiement XRPL réel
      const { sendPaymentWithWallet } = await import('@/lib/xrpl-client-service-v2');
      
      const currentWalletType = walletType || 'gem';
      
      const paymentResult = await sendPaymentWithWallet(
        currentWalletType,
        {
          fromAddress: walletInfo.address,
          toAddress: selectedAssociation.walletAddress,
          amount,
          memo: `Don à ${selectedAssociation.name}`,
          eventMetadata: {
            type: 'donation',
            associationName: selectedAssociation.name,
            amount,
          },
        }
      );

      // 2. Envoyer le txHash à l'API pour enregistrer le don
      const response = await fetch('/api/donations/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: walletInfo.address,
          associationWalletAddress: selectedAssociation.walletAddress,
          amount,
          paymentTxHash: paymentResult.txHash,
          userId: user?.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors du don');
      }

      // Si un événement est actif et qu'on donne à l'association de l'événement,
      // donner des seaux d'eau au lieu de tirages normaux
      const isEventDonation = activeEvent && activeEvent.associationId === selectedAssociation.id;
      
      let items;
      if (isEventDonation) {
        // Calculer le nombre de seaux d'eau (1 seau par tranche de 5 XRP)
        const bucketCount = Math.floor(amount / 5);
        items = Array(bucketCount).fill(null).map(() => ({
          id: 'water_bucket',
          name: 'Seau d\'eau',
          rarity: 'COMMON',
          type: 'water_bucket',
          nftTokenId: null,
        }));
        console.log(`🔥 Don pour événement : ${bucketCount} seau(x) d'eau reçu(s) !`);
      } else {
        // Tirages normaux - mapper les items de l'API
        items = data.items.map((item: any) => ({
          id: item.itemType,
          name: item.itemName,
          rarity: item.rarity,
          type: item.itemType,
          nftTokenId: item.nftTokenId,
        }));
      }

      setDrawnItems(items);
      const newVillageItems = [...villageItems, ...items];
      saveVillageItems(newVillageItems);
      
      // Montrer l'ouverture du pack d'abord
      setShowPackOpening(true);
      setDonationAmount("");
      
      console.log(`✅ Don de ${amount} XRP envoyé avec succès ! Transaction: ${paymentResult.txHash}`);
    } catch (error: any) {
      console.error("Erreur:", error);
      alert(error.message || "Erreur lors du don");
    } finally {
      setDonating(false);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "COMMON":
        return "text-gray-600 bg-gray-100";
      case "RARE":
        return "text-blue-600 bg-blue-100";
      case "EPIC":
        return "text-purple-600 bg-purple-100";
      case "LEGENDARY":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-sky-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-800 to-sky-800 mb-4">
            💝 Faire un Don
          </h1>
          <p className="text-xl text-gray-700">
            Soutenez une association et gagnez des objets pour décorer votre
            village
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Village (gauche - 2 colonnes) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-green-200 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                🏡 Mon Village
              </h2>

              {/* Zone du village avec drag & drop */}
              <div className="relative rounded-xl overflow-hidden border-4 border-green-300">
                <GardenCanvas 
                  hasItems={villageItems.length > 0}
                  backgroundImage={activeEvent ? "/images/biome_en_feu.png.webp" : "/village.png"}
                  eventProgress={activeEvent ? eventProgress : undefined}
                  usedBuckets={activeEvent ? (activeEvent.usedBuckets || 0) : 0}
                  totalNeeded={activeEvent ? (activeEvent.totalNeeded || 10) : 10}
                  onItemPlaced={(itemId, quantity) => {
                    if (itemId === "water_bucket" && activeEvent) {
                      const newEvent = { ...activeEvent };
                      const previousBuckets = newEvent.usedBuckets || 0;
                      newEvent.usedBuckets = previousBuckets + quantity;
                      const totalNeeded = newEvent.totalNeeded || 10;
                      const newProgress = Math.min(100, (newEvent.usedBuckets / totalNeeded) * 100);
                      
                      setActiveEvent(newEvent);
                      setEventProgress(newProgress);
                      localStorage.setItem("participatingEvent", JSON.stringify(newEvent));
                      
                      if (newProgress >= 100) {
                        setTimeout(() => {
                          alert(`🎉 Victoire ! Tu as éteint l'incendie avec ${newEvent.usedBuckets} sceaux d'eau !`);
                          localStorage.removeItem("participatingEvent");
                          setActiveEvent(null);
                          setEventProgress(0);
                        }, 500);
                      }
                    }
                    
                    const newItems = [...villageItems];
                    let removed = 0;
                    
                    for (let i = newItems.length - 1; i >= 0 && removed < quantity; i--) {
                      if (newItems[i].id === itemId) {
                        newItems.splice(i, 1);
                        removed++;
                      }
                    }
                    
                    saveVillageItems(newItems);
                    
                    const remaining = newItems.filter(i => i.id === itemId).length;
                    if (remaining === 0) {
                      setDragQuantities(prev => {
                        const copy = { ...prev };
                        delete copy[itemId];
                        return copy;
                      });
                    } else if (dragQuantities[itemId] > remaining) {
                      setDragQuantities(prev => ({
                        ...prev,
                        [itemId]: remaining
                      }));
                    }
                  }}
                />
              </div>

              {/* Inventaire avec drag & drop */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-gray-900">
                    Inventaire (glissez vers le village)
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      {villageItems.length} objets
                    </span>
                    {villageItems.length > 0 && (
                      <button
                        onClick={() => {
                          if (confirm('Voulez-vous vraiment vider l\'inventaire ?')) {
                            saveVillageItems([]);
                          }
                        }}
                        className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition"
                        title="Vider l'inventaire"
                      >
                        🗑️ Vider
                      </button>
                    )}
                  </div>
                </div>
                {villageItems.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-5xl mb-4">🎁</div>
                    <p className="text-lg font-semibold text-gray-700 mb-2">
                      Tu n&apos;as encore aucun objet.
                    </p>
                    <p className="text-sm text-gray-600">
                      Fais ton premier don pour débloquer ton tout premier élément du village !
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-4">
                    {Array.from(new Set(villageItems.map((i) => i.id))).map(
                      (id, idx) => {
                        const item = villageItems.find((i) => i.id === id);
                        if (!item) return null;
                        const count = villageItems.filter(
                          (i) => i.id === id
                        ).length;
                        const currentQuantity = dragQuantities[id] || 1;
                        
                        return (
                          <div key={idx} className="flex flex-col items-center">
                            <DraggableItem 
                              item={item} 
                              width={64}
                              quantity={Math.min(currentQuantity, count)}
                              onQuantityChange={(delta) => {
                                const newQuantity = Math.max(1, Math.min(count, currentQuantity + delta));
                                setDragQuantities(prev => ({
                                  ...prev,
                                  [id]: newQuantity
                                }));
                              }}
                            />
                            <span
                              className={`mt-1 px-2 py-0.5 rounded text-xs font-medium ${getRarityColor(
                                item.rarity || "COMMON"
                              )}`}
                            >
                              Total: x{count}
                            </span>
                          </div>
                        );
                      }
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Associations et don (droite - 1 colonne) */}
          <div className="space-y-6">
            {/* Formulaire de don */}
            {selectedAssociation && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-green-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  Faire un don
                </h3>

                {activeEvent && activeEvent.associationId === selectedAssociation.id && (
                  <div className="mb-4 p-3 bg-orange-50 border-2 border-orange-300 rounded-lg">
                    <div className="flex items-center gap-2 text-orange-800 mb-2">
                      <span className="text-2xl">🔥</span>
                      <div className="flex-1">
                        <p className="font-bold text-sm">Événement actif dans ton village !</p>
                        <p className="text-xs">
                          Tes dons iront automatiquement à l'association de l'événement "{activeEvent.name}"
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-orange-100 rounded px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">💧</span>
                        <span className="text-xs font-medium text-orange-900">
                          Progression : {activeEvent.usedBuckets || 0} / {activeEvent.totalNeeded || 10} seaux
                        </span>
                      </div>
                      <span className="text-xs font-bold text-orange-700">
                        {Math.round(eventProgress)}%
                      </span>
                    </div>
                  </div>
                )}

                <div
                  className={`p-4 rounded-lg bg-gradient-to-r ${getTypeColor(
                    selectedAssociation.type
                  )} mb-4`}
                >
                  <div className="text-white">
                    <div className="text-2xl mb-2">
                      {getTypeIcon(selectedAssociation.type)}
                    </div>
                    <div className="font-bold">{selectedAssociation.name}</div>
                    <div className="text-sm opacity-90">
                      {selectedAssociation.description}
                    </div>
                  </div>
                </div>

                {!selectedAssociation.walletAddress ? (
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-center">
                    <p className="text-yellow-800 font-medium">
                      Cette association n'a pas configuré son adresse wallet
                    </p>
                  </div>
                ) : !isConnected || !walletInfo ? (
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-center">
                    <p className="text-yellow-800 font-medium">
                      Connectez votre wallet pour faire un don
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Montant du don (XRP)
                      </label>
                      <input
                        type="number"
                        min="5"
                        step="5"
                        value={donationAmount}
                        onChange={(e) => setDonationAmount(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-bold"
                        placeholder="5"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Minimum : 5 XRP
                      </p>
                    </div>

                    {donationAmount && parseFloat(donationAmount) >= 5 && (
                      <div className={`p-4 rounded-lg border mb-4 ${
                        activeEvent && activeEvent.associationId === selectedAssociation?.id
                          ? 'bg-orange-50 border-orange-200'
                          : 'bg-green-50 border-green-200'
                      }`}>
                        <div className="flex items-center gap-2 mb-2">
                          {activeEvent && activeEvent.associationId === selectedAssociation?.id ? (
                            <>
                              <span className="text-xl">💧</span>
                              <span className="font-bold text-orange-800">
                                Récompenses Événement
                              </span>
                            </>
                          ) : (
                            <>
                              <Gift className="w-5 h-5 text-green-600" />
                              <span className="font-bold text-green-800">
                                Récompenses
                              </span>
                            </>
                          )}
                        </div>
                        {activeEvent && activeEvent.associationId === selectedAssociation?.id ? (
                          <>
                            <p className="text-sm text-orange-700">
                              Vous recevrez{" "}
                              <strong>
                                {calculateDraws(parseFloat(donationAmount))}{" "}
                                seau(x) d'eau
                              </strong>{" "}
                              pour éteindre l'incendie !
                            </p>
                            <p className="text-xs text-orange-600 mt-1">
                              🔥 1 seau d'eau par tranche de 5 XRP
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="text-sm text-green-700">
                              Vous recevrez{" "}
                              <strong>
                                {calculateDraws(parseFloat(donationAmount))}{" "}
                                tirage(s)
                              </strong>{" "}
                              !
                            </p>
                            <p className="text-xs text-green-600 mt-1">
                              1 tirage = 1 objet pour votre village
                            </p>
                          </>
                        )}
                      </div>
                    )}

                    <button
                      onClick={handleDonate}
                      disabled={
                        donating ||
                        !donationAmount ||
                        parseFloat(donationAmount) < 5
                      }
                      className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-bold hover:from-green-700 hover:to-emerald-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {donating ? (
                        <>
                          <span className="animate-spin">⏳</span>
                          Don en cours...
                        </>
                      ) : (
                        <>
                          <Heart className="w-5 h-5" />
                          Faire le don
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => setSelectedAssociation(null)}
                      className="w-full mt-2 py-2 text-gray-600 hover:text-gray-800 text-sm"
                    >
                      Choisir une autre association
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Liste des associations */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-sky-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Associations ({associations.length})
              </h3>

              {loading ? (
                <p className="text-center text-gray-600 py-4">Chargement...</p>
              ) : associations.length === 0 ? (
                <p className="text-center text-gray-600 py-4">
                  Aucune association disponible
                </p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {associations.map((association) => {
                    const isEventAssociation = activeEvent && activeEvent.associationId === association.id;
                    return (
                      <button
                        key={association.id}
                        onClick={() => setSelectedAssociation(association)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                          selectedAssociation?.id === association.id
                            ? "border-green-500 bg-green-50"
                            : isEventAssociation
                            ? "border-orange-400 bg-orange-50 hover:border-orange-500"
                            : "border-gray-200 hover:border-green-300 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="text-2xl flex-shrink-0">
                              {getTypeIcon(association.type)}
                            </div>
                            <div className="flex-1 min-w-0 overflow-hidden">
                              <div className="flex items-center gap-2 mb-1">
                                <div className="font-bold text-gray-900 truncate">
                                  {association.name}
                                </div>
                                {isEventAssociation && (
                                  <span className="text-xs px-2 py-0.5 bg-orange-500 text-white rounded-full whitespace-nowrap flex-shrink-0">
                                    🔥 Événement
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-gray-600 line-clamp-2">
                                {association.description}
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Ouverture du pack */}
      {showPackOpening && (
        <PackOpening
          packType={activeEvent ? "fire" : "nature"}
          onComplete={() => {
            setShowPackOpening(false);
            setShowCardReveal(true);
          }}
        />
      )}

      {/* Révélation des cartes */}
      {showCardReveal && (
        <CardReveal
          items={drawnItems}
          onComplete={() => {
            setShowCardReveal(false);
            setShowRewards(true);
          }}
        />
      )}

      {/* Modal récapitulatif après les cartes */}
      {showRewards && !showCardReveal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Merci pour votre don !
              </h2>
              <p className="text-gray-600">
                Vous avez gagné {drawnItems.length} objet(s) pour votre village
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {drawnItems.map((item, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 text-center ${
                    item.rarity === "LEGENDARY"
                      ? "bg-yellow-50 border-yellow-400"
                      : item.rarity === "EPIC"
                      ? "bg-purple-50 border-purple-400"
                      : item.rarity === "RARE"
                      ? "bg-blue-50 border-blue-400"
                      : "bg-gray-50 border-gray-300"
                  }`}
                >
                  <div className="text-4xl mb-2">
                    {item.id === "water_bucket" ? "💧" :
                     item.id === "beehive" ? "🐝" :
                     item.id === "world_tree" ? "🔥" :
                     item.id === "tree_small" ? "🌲" :
                     item.id === "rock" ? "🪨" :
                     item.id === "flower" ? "🌸" :
                     item.rarity === "LEGENDARY" ? "⭐" :
                     item.rarity === "EPIC" ? "💎" :
                     item.rarity === "RARE" ? "🌟" : "🌱"}
                  </div>
                  <div className="font-bold text-gray-900 text-sm mb-1">
                    {item.name}
                  </div>
                  <div
                    className={`text-xs px-2 py-1 rounded ${getRarityColor(
                      item.rarity
                    )}`}
                  >
                    {item.rarity}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setShowRewards(false);
                setShowCardReveal(false);
                setDrawnItems([]);
              }}
              className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-bold hover:from-green-700 hover:to-emerald-700 transition"
            >
              Continuer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
