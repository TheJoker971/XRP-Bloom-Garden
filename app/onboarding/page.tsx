"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Heart, Target, Sparkles, CheckCircle } from "lucide-react";

type DonationMode = "manual" | "auto" | null;

export default function OnboardingPage() {
  const router = useRouter();
  const [selectedMode, setSelectedMode] = useState<DonationMode>(null);

  const handleConfirm = () => {
    if (!selectedMode) return;
    
    // Sauvegarder le choix de l'utilisateur
    localStorage.setItem("donationMode", selectedMode);
    
    // Rediriger vers la page de donation
    router.push("/donate");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-sky-50">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* En-tête */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <div className="text-6xl mb-2">🌱</div>
          </div>
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-800 to-sky-800 mb-4">
            Comment souhaites-tu allouer tes dons ?
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Tu es à une étape de lancer ton village écologique et ton impact réel.
          </p>
        </div>

        {/* Options de donation */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* OPTION 1 - Choix manuel */}
          <button
            onClick={() => setSelectedMode("manual")}
            className={`relative group p-8 rounded-3xl border-4 transition-all duration-300 text-left ${
              selectedMode === "manual"
                ? "border-blue-500 bg-blue-50 shadow-2xl scale-105"
                : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-xl hover:scale-102"
            }`}
          >
            {/* Badge de sélection */}
            {selectedMode === "manual" && (
              <div className="absolute -top-4 -right-4 bg-blue-500 text-white rounded-full p-3 shadow-lg">
                <CheckCircle className="w-8 h-8" />
              </div>
            )}

            {/* Icône */}
            <div className="mb-6 flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-all ${
                selectedMode === "manual" 
                  ? "bg-blue-500 text-white shadow-lg" 
                  : "bg-blue-100 text-blue-600 group-hover:bg-blue-200"
              }`}>
                <Target className="w-8 h-8" />
              </div>
              <div className="text-sm font-bold text-blue-600 uppercase tracking-wider">
                Option 1
              </div>
            </div>

            {/* Titre */}
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Je choisis les ONG moi-même
            </h2>

            {/* Description */}
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              Découvre toutes les causes, explore nos partenaires et sélectionne exactement où va ton argent.
            </p>
            <p className="text-gray-600 text-base">
              <strong>Tu décides, projet par projet.</strong>
            </p>

            {/* Badge décoratif */}
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              Contrôle total
            </div>
          </button>

          {/* OPTION 2 - Allocation automatique */}
          <button
            onClick={() => setSelectedMode("auto")}
            className={`relative group p-8 rounded-3xl border-4 transition-all duration-300 text-left ${
              selectedMode === "auto"
                ? "border-green-500 bg-green-50 shadow-2xl scale-105"
                : "border-gray-200 bg-white hover:border-green-300 hover:shadow-xl hover:scale-102"
            }`}
          >
            {/* Badge de sélection */}
            {selectedMode === "auto" && (
              <div className="absolute -top-4 -right-4 bg-green-500 text-white rounded-full p-3 shadow-lg">
                <CheckCircle className="w-8 h-8" />
              </div>
            )}

            {/* Icône */}
            <div className="mb-6 flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-all ${
                selectedMode === "auto" 
                  ? "bg-green-500 text-white shadow-lg" 
                  : "bg-green-100 text-green-600 group-hover:bg-green-200"
              }`}>
                <Heart className="w-8 h-8" />
              </div>
              <div className="text-sm font-bold text-green-600 uppercase tracking-wider">
                Option 2
              </div>
            </div>

            {/* Titre */}
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Envoyer mes dons automatiquement à vos ONG de confiance
            </h2>

            {/* Description */}
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              Nous travaillons avec des ONG rigoureusement vérifiées et hautement efficaces.
            </p>
            <p className="text-gray-600 text-base">
              <strong>Laisse-nous envoyer tes dons directement vers les acteurs les plus impactants.</strong>
            </p>

            {/* Badge décoratif */}
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              Impact maximisé
            </div>
          </button>
        </div>

        {/* Bouton de confirmation */}
        <div className="text-center">
          <button
            onClick={handleConfirm}
            disabled={!selectedMode}
            className={`px-12 py-5 rounded-2xl font-bold text-xl transition-all duration-300 ${
              selectedMode
                ? selectedMode === "manual"
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-xl hover:shadow-2xl hover:scale-105"
                  : "bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 shadow-xl hover:shadow-2xl hover:scale-105"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {selectedMode ? "Confirmer mon choix" : "Sélectionne une option"}
          </button>

          {selectedMode && (
            <p className="mt-4 text-gray-600 animate-fade-in">
              {selectedMode === "manual" 
                ? "Tu pourras choisir chaque association lors de tes dons" 
                : "Tes dons seront automatiquement répartis vers nos ONG partenaires"}
            </p>
          )}
        </div>

        {/* Note informative */}
        <div className="mt-12 max-w-2xl mx-auto bg-sky-50 border-2 border-sky-200 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 text-3xl">💡</div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">
                Tu peux changer d&apos;avis à tout moment
              </h3>
              <p className="text-gray-700 text-sm">
                Ton choix n&apos;est pas définitif. Tu pourras le modifier plus tard dans tes paramètres de compte.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
