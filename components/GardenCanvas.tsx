import React, { useEffect, useRef, useState } from "react";

type Placed = { id: string; imageUrl?: string | null; x: number; y: number };

type DragPayload = { id: string; name?: string; imageUrl?: string | null; quantity?: number };

const ITEM_SIZE = 64;

type Props = {
  onItemPlaced?: (itemId: string, quantity: number) => void;
  hasItems?: boolean;
  backgroundImage?: string;
  eventProgress?: number;
  usedBuckets?: number;
  totalNeeded?: number;
};

export default function GardenCanvas({ 
  onItemPlaced, 
  hasItems = true,
  backgroundImage = "/village.png",
  eventProgress,
  usedBuckets = 0,
  totalNeeded = 20
}: Props = {}) {
  const [placed, setPlaced] = useState<Placed[]>([]);
  const ref = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef<{
    index: number;
    offsetX: number;
    offsetY: number;
  } | null>(null);

  useEffect(() => {
    function onPointerMove(e: PointerEvent) {
      const drag = draggingRef.current;
      if (!drag || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = e.clientX - rect.left - drag.offsetX;
      const y = e.clientY - rect.top - drag.offsetY;
      setPlaced((prev) => {
        const copy = [...prev];
        copy[drag.index] = {
          ...copy[drag.index],
          x: Math.max(0, Math.min(rect.width - ITEM_SIZE, x)),
          y: Math.max(0, Math.min(rect.height - ITEM_SIZE, y)),
        };
        return copy;
      });
    }

    function onPointerUp() {
      draggingRef.current = null;
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    }

    // cleanup on unmount
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, []);

  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
  }

  function onDrop(e: React.DragEvent) {
    console.log("Drop event triggered!");
    e.preventDefault();
    const data = e.dataTransfer.getData("application/json");
    console.log("Drop data:", data);
    if (!data) return;
    let parsed: DragPayload;
    try {
      parsed = JSON.parse(data) as DragPayload;
      console.log("Parsed data:", parsed);
    } catch {
      console.error("Failed to parse drop data");
      return;
    }

    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = e.clientX - rect.left;
    const centerY = e.clientY - rect.top;
    
    const quantity = parsed.quantity || 1;
    console.log("Placing", quantity, "items at:", centerX, centerY);
    
    // Si c'est un seau d'eau, ne pas le placer (il disparaît)
    if (parsed.id === "water_bucket") {
      // Ne rien placer, juste notifier
    } else {
      // Placement en grille ultra-serrée pour créer une forêt dense
      const newItems: Placed[] = [];
      const gap = -25; // Chevauchement modéré pour forêt dense
      const itemsPerRow = Math.ceil(Math.sqrt(quantity));
      const totalWidth = (ITEM_SIZE * itemsPerRow) + (gap * (itemsPerRow - 1));
      const totalHeight = (ITEM_SIZE * Math.ceil(quantity / itemsPerRow)) + (gap * (Math.ceil(quantity / itemsPerRow) - 1));
      
      // Point de départ centré
      const startX = Math.max(0, Math.min(rect.width - totalWidth, centerX - totalWidth / 2));
      const startY = Math.max(0, Math.min(rect.height - totalHeight, centerY - totalHeight / 2));
      
      for (let i = 0; i < quantity; i++) {
        const row = Math.floor(i / itemsPerRow);
        const col = i % itemsPerRow;
        const x = Math.max(0, Math.min(rect.width - ITEM_SIZE, startX + col * (ITEM_SIZE + gap)));
        const y = Math.max(0, Math.min(rect.height - ITEM_SIZE, startY + row * (ITEM_SIZE + gap)));
        newItems.push({ id: parsed.id, imageUrl: parsed.imageUrl || null, x, y });
      }
      
      setPlaced((prev) => [...prev, ...newItems]);
    }
    
    // Notifier la page parente de la quantité placée
    if (onItemPlaced) {
      onItemPlaced(parsed.id, quantity);
    }
  }

  function startPointerDrag(e: React.PointerEvent, index: number) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const p = placed[index];
    const offsetX = e.clientX - rect.left - p.x;
    const offsetY = e.clientY - rect.top - p.y;
    draggingRef.current = { index, offsetX, offsetY };

    function onPointerMove(e: PointerEvent) {
      const drag = draggingRef.current;
      if (!drag || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = e.clientX - rect.left - drag.offsetX;
      const y = e.clientY - rect.top - drag.offsetY;
      setPlaced((prev) => {
        const copy = [...prev];
        copy[drag.index] = {
          ...copy[drag.index],
          x: Math.max(0, Math.min(rect.width - ITEM_SIZE, x)),
          y: Math.max(0, Math.min(rect.height - ITEM_SIZE, y)),
        };
        return copy;
      });
    }

    function onPointerUp() {
      draggingRef.current = null;
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    }

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  }

  return (
    <div
      ref={ref}
      onDragOver={onDragOver}
      onDrop={onDrop}
      style={{
        width: "100%",
        height: 600,
        position: "relative",
        overflow: "hidden",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Jauge de progression de l'événement */}
      {eventProgress !== undefined && (
        <div style={{
          position: "absolute",
          top: 20,
          left: "50%",
          transform: "translateX(-50%)",
          width: "80%",
          maxWidth: 400,
          zIndex: 10,
        }}>
          <div style={{
            background: "rgba(255,255,255,0.95)",
            borderRadius: "1rem",
            padding: "1rem",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "0.5rem",
              fontSize: "0.875rem",
              fontWeight: "bold",
            }}>
              <span style={{ color: "#ef4444" }}>🔥 Incendie</span>
              <span style={{ color: "#3b82f6" }}>
                {usedBuckets}/{totalNeeded} 💧 ({Math.round(eventProgress)}%)
              </span>
            </div>
            <div style={{
              width: "100%",
              height: 20,
              background: "#fee2e2",
              borderRadius: "0.5rem",
              overflow: "hidden",
              border: "2px solid #ef4444",
            }}>
              <div style={{
                width: `${eventProgress}%`,
                height: "100%",
                background: "linear-gradient(90deg, #3b82f6, #60a5fa)",
                transition: "width 0.5s ease",
              }} />
            </div>
            <div style={{
              fontSize: "0.75rem",
              color: "#6b7280",
              marginTop: "0.5rem",
              textAlign: "center",
            }}>
              {eventProgress >= 100 ? "🎉 Incendie maîtrisé !" : "💧 Utilise des sceaux d'eau pour éteindre l'incendie"}
            </div>
          </div>
        </div>
      )}
      {/* Overlay léger */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "rgba(0,0,0,0.1)",
        pointerEvents: "none",
      }} />
      
      {/* Message si vide */}
      {placed.length === 0 && (
        <div style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}>
          <div style={{
            background: "rgba(255,255,255,0.95)",
            padding: "2rem",
            borderRadius: "1rem",
            textAlign: "center",
            border: "2px solid rgba(34,197,94,0.3)",
            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
            pointerEvents: "none",
          }}>
            {hasItems ? (
              <>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✨</div>
                <div style={{ fontWeight: "bold", fontSize: "1.125rem", color: "#1f2937", marginBottom: "0.5rem" }}>
                  Glissez vos objets ici
                </div>
                <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                  Depuis l&apos;inventaire ci-dessous
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎁</div>
                <div style={{ fontWeight: "bold", fontSize: "1.125rem", color: "#1f2937", marginBottom: "0.5rem" }}>
                  Tu n&apos;as encore aucun objet.
                </div>
                <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                  Fais ton premier don pour débloquer ton tout premier élément du village !
                </div>
              </>
            )}
          </div>
        </div>
      )}
      
      {/* Objets placés */}
      {placed.map((p, i) => {
        const getItemEmoji = (id: string) => {
          const emojiMap: Record<string, string> = {
            tree_small: "🌱",
            bush: "🌿",
            rock: "🪨",
            flower: "🌸",
            tree_large: "🌳",
            beehive: "🐝",
            fountain: "⛲",
            wind_turbine: "💨",
            eco_sanctuary: "🏛️",
            world_tree: "🌲",
            water_bucket: "💧",
          };
          return emojiMap[id] || "📦";
        };

        return (
          <div
            key={`${p.id}-${i}`}
            onPointerDown={(e) => startPointerDrag(e, i)}
            style={{
              position: "absolute",
              left: p.x,
              top: p.y,
              width: ITEM_SIZE,
              height: ITEM_SIZE,
              touchAction: "none",
              cursor: "grab",
            }}
          >
            {p.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={p.imageUrl} 
                alt={p.id} 
                style={{
                  width: ITEM_SIZE, 
                  height: ITEM_SIZE, 
                  objectFit: "contain",
                  pointerEvents: "none",
                }} 
              />
            ) : (
              <div style={{
                width: ITEM_SIZE,
                height: ITEM_SIZE,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: "0.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: ITEM_SIZE * 0.5,
                border: "2px solid rgba(255,255,255,0.3)",
              }}>
                {getItemEmoji(p.id)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
