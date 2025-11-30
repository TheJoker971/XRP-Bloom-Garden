"use client";

import React, { useState } from "react";
import { DrawnItem } from "../utils/gameModels";
import { ChevronRight, SkipForward } from "lucide-react";

type Props = {
  items: DrawnItem[];
  onComplete: () => void;
};

export default function CardReveal({ items, onComplete }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragStart, setDragStart] = useState<number | null>(null);

  console.log("CardReveal rendered with", items.length, "items");
  console.log("Current item:", items[currentIndex]);

  const currentItem = items[currentIndex];
  const hasNext = currentIndex < items.length - 1;

  const getItemEmoji = (id: string) => {
    const emojiMap: Record<string, string> = {
      tree_small: "🌲",
      bush: "🌿",
      rock: "🪨",
      flower: "🌸",
      tree_large: "🌳",
      beehive: "🐝",
      fountain: "⛲",
      wind_turbine: "💨",
      eco_sanctuary: "🏛️",
      world_tree: "🔥",
      water_bucket: "💧",
    };
    return emojiMap[id] || "🎁";
  };

  const handleNext = () => {
    if (hasNext) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setDragStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!dragStart) return;
    const dragEnd = e.changedTouches[0].clientX;
    const diff = dragStart - dragEnd;
    
    // Swipe left (>50px) = next card
    if (diff > 50) {
      handleNext();
    }
    setDragStart(null);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragStart(e.clientX);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!dragStart) return;
    const diff = dragStart - e.clientX;
    
    if (diff > 50) {
      handleNext();
    }
    setDragStart(null);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
      style={{ zIndex: 9999 }}
    >
      {/* Bouton Skip */}
      <button
        onClick={handleSkip}
        className="absolute top-4 right-4 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-bold transition flex items-center gap-2 z-10"
      >
        <SkipForward className="w-5 h-5" />
        Tout voir
      </button>

      {/* Compteur */}
      <div className="absolute top-4 left-4 text-white text-lg font-bold z-10">
        {currentIndex + 1} / {items.length}
      </div>

      {/* Carte */}
      <div
        className="relative max-w-md w-full"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        style={{ cursor: hasNext ? "pointer" : "default" }}
      >
        {/* Animation de révélation */}
        <div className="transition-all duration-300 scale-100 opacity-100">
          {/* Carte avec image */}
          {currentItem.cardImageUrl ? (
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentItem.cardImageUrl}
                alt={currentItem.name}
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
              
              {/* Overlay avec infos */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-2xl">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {currentItem.name}
                </h3>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded text-sm font-bold ${
                    currentItem.rarity === "LEGENDARY" ? "bg-yellow-500 text-black" :
                    currentItem.rarity === "EPIC" ? "bg-purple-500 text-white" :
                    currentItem.rarity === "RARE" ? "bg-blue-500 text-white" :
                    "bg-gray-500 text-white"
                  }`}>
                    {currentItem.rarity}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            // Fallback avec emoji pour objets sans carte
            <div className={`rounded-2xl shadow-2xl p-12 text-center ${
              currentItem.rarity === "LEGENDARY" ? "bg-gradient-to-br from-yellow-400 to-orange-500" :
              currentItem.rarity === "EPIC" ? "bg-gradient-to-br from-purple-500 to-pink-500" :
              currentItem.rarity === "RARE" ? "bg-gradient-to-br from-blue-500 to-cyan-500" :
              "bg-gradient-to-br from-green-500 to-emerald-600"
            }`}>
              <div className="text-9xl mb-6">
                {getItemEmoji(currentItem.id)}
              </div>
              <h3 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
                {currentItem.name}
              </h3>
              <span className="inline-block px-6 py-2 rounded-lg text-lg font-bold bg-white/30 backdrop-blur-sm text-white border-2 border-white/50">
                {currentItem.rarity}
              </span>
            </div>
          )}
        </div>

        {/* Instructions de swipe */}
        {hasNext && (
          <div className="absolute -bottom-16 left-0 right-0 text-center">
            <div className="text-white/70 text-sm flex items-center justify-center gap-2 animate-pulse">
              <span>Glissez ou cliquez pour continuer</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        )}

        {/* Bouton Suivant (mobile friendly) */}
        {hasNext && (
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
}
