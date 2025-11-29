import React, { useEffect, useRef, useState } from "react";

type Placed = { id: string; imageUrl?: string | null; x: number; y: number };

type DragPayload = { id: string; name?: string; imageUrl?: string | null };

const ITEM_SIZE = 64;

type Props = {
  onItemPlaced?: (itemId: string) => void;
};

export default function GardenCanvas({ onItemPlaced }: Props = {}) {
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
    e.preventDefault();
    const data = e.dataTransfer.getData("application/json");
    if (!data) return;
    let parsed: DragPayload;
    try {
      parsed = JSON.parse(data) as DragPayload;
    } catch {
      return;
    }

    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width - ITEM_SIZE, e.clientX - rect.left - ITEM_SIZE / 2));
    const y = Math.max(0, Math.min(rect.height - ITEM_SIZE, e.clientY - rect.top - ITEM_SIZE / 2));

    setPlaced((prev) => [...prev, { id: parsed.id, imageUrl: parsed.imageUrl || null, x, y }]);
    
    // Notifier la page parente qu'un item a été placé
    if (onItemPlaced) {
      onItemPlaced(parsed.id);
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
        backgroundImage: "url(/village.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
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
        }}>
          <div style={{
            background: "rgba(255,255,255,0.95)",
            padding: "2rem",
            borderRadius: "1rem",
            textAlign: "center",
            border: "2px solid rgba(34,197,94,0.3)",
            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
          }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✨</div>
            <div style={{ fontWeight: "bold", fontSize: "1.125rem", color: "#1f2937", marginBottom: "0.5rem" }}>
              Glissez vos objets ici
            </div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
              Depuis l&apos;inventaire ci-dessous
            </div>
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
