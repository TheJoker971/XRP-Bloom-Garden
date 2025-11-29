"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { useXRPLWallet } from "@/components/providers/XRPLWalletProvider";
import { Heart, Gift, Sparkles, ChevronRight } from "lucide-react";
import { drawFromPack, simulate1000Draws } from "@/utils/packSystem";
import { PACKS } from "@/utils/packsData";
import GardenCanvas from "@/components/GardenCanvas";
import DraggableItem from "@/components/DraggableItem";

interface Association {
  id: string;
  name: string;
  type: string;
  description: string;
  walletAddress: string;
}

export default function DonatePage() {
  const { isConnected, walletInfo } = useXRPLWallet();
  const [associations, setAssociations] = useState<Association[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssociation, setSelectedAssociation] =
    useState<Association | null>(null);
  const [donationAmount, setDonationAmount] = useState("");
  const [donating, setDonating] = useState(false);
  const [drawnItems, setDrawnItems] = useState<any[]>([]);
  const [showRewards, setShowRewards] = useState(false);
  const [villageItems, setVillageItems] = useState<any[]>([]);

  useEffect(() => {
    fetchAssociations();
    loadVillageItems();
  }, []);

  const fetchAssociations = async () => {
    try {
      const response = await fetch("/api/associations/approved");
      const data = await response.json();
      setAssociations(data.associations || []);
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
    // 1 tirage pour chaque tranche de 5 XRP
    return Math.floor(amount / 5);
  };

  const handleDonate = async () => {
    if (
      !isConnected ||
      !walletInfo ||
      !selectedAssociation ||
      !donationAmount
    ) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    const amount = parseFloat(donationAmount);
    if (amount < 5) {
      alert("Le don minimum est de 5 XRP");
      return;
    }

    setDonating(true);

    try {
      // Simuler la transaction (en production, utiliser le vrai wallet)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Calculer le nombre de tirages
      const numDraws = calculateDraws(amount);

      // Effectuer les tirages
      const pack = PACKS.pack_nature_basic; // Pack par défaut
      const items = [];
      for (let i = 0; i < numDraws; i++) {
        const item = drawFromPack(pack);
        items.push(item);
      }

      setDrawnItems(items);

      // Ajouter les items au village
      const newVillageItems = [...villageItems, ...items];
      saveVillageItems(newVillageItems);

      setShowRewards(true);
      setDonationAmount("");
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
                  onItemPlaced={(itemId) => {
                    // Retirer un exemplaire de cet item de l'inventaire
                    const itemIndex = villageItems.findIndex(item => item.id === itemId);
                    if (itemIndex !== -1) {
                      const newItems = [...villageItems];
                      newItems.splice(itemIndex, 1);
                      saveVillageItems(newItems);
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
                  <p className="text-sm text-gray-500 text-center py-4">
                    Faites un don pour gagner des objets !
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-4">
                    {Array.from(new Set(villageItems.map((i) => i.id))).map(
                      (id, idx) => {
                        const item = villageItems.find((i) => i.id === id);
                        if (!item) return null;
                        const count = villageItems.filter(
                          (i) => i.id === id
                        ).length;
                        return (
                          <div key={idx} className="flex flex-col items-center">
                            <DraggableItem item={item} width={64} />
                            <span
                              className={`mt-1 px-2 py-0.5 rounded text-xs font-medium ${getRarityColor(
                                item.rarity || "COMMON"
                              )}`}
                            >
                              x{count}
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

                {!isConnected ? (
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
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Gift className="w-5 h-5 text-green-600" />
                          <span className="font-bold text-green-800">
                            Récompenses
                          </span>
                        </div>
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
                  {associations.map((association) => (
                    <button
                      key={association.id}
                      onClick={() => setSelectedAssociation(association)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        selectedAssociation?.id === association.id
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:border-green-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="text-2xl">
                            {getTypeIcon(association.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-gray-900 truncate">
                              {association.name}
                            </div>
                            <div className="text-xs text-gray-600 truncate">
                              {association.description}
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de récompenses */}
      {showRewards && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full">
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
                    {item.rarity === "LEGENDARY"
                      ? "⭐"
                      : item.rarity === "EPIC"
                      ? "💎"
                      : item.rarity === "RARE"
                      ? "🌟"
                      : "🌱"}
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
