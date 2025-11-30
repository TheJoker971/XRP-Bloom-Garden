import React from "react";
import { PackItem } from "../utils/gameModels";

type Props = {
  item: PackItem;
  width?: number;
  quantity?: number;
  onQuantityChange?: (delta: number) => void;
};

export default function DraggableItem({
  item,
  width = 64,
  quantity = 1,
  onQuantityChange,
}: Props) {
  const imgRef = React.useRef<HTMLImageElement>(null);

  function onDragStart(e: React.DragEvent) {
    console.log("Drag started for item:", item.id, "quantity:", quantity);
    const payload = {
      id: item.id,
      name: item.name,
      imageUrl: item.imageUrl || null,
      quantity,
    };
    e.dataTransfer.setData("application/json", JSON.stringify(payload));
    console.log("Payload set:", payload);

    // Use the actual image element as drag image
    if (imgRef.current) {
      try {
        e.dataTransfer.setDragImage(imgRef.current, width / 2, width / 2);
      } catch (err) {
        console.log("Could not set drag image:", err);
      }
    }
  }

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
      style={{
        display: "inline-block",
        textAlign: "center",
        position: "relative",
      }}
    >
      {item.imageUrl ? (
        <div
          draggable
          onDragStart={onDragStart}
          style={{ cursor: "grab", display: "block", position: "relative" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            src={item.imageUrl}
            alt={item.name}
            width={width}
            height={width}
            style={{ display: "block", pointerEvents: "none" }}
            draggable={false}
          />
          {/* Badge de quantité */}
          {quantity > 1 && (
            <div
              style={{
                position: "absolute",
                top: -8,
                right: -8,
                background: "#ef4444",
                color: "white",
                borderRadius: "50%",
                width: 24,
                height: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.75rem",
                fontWeight: "bold",
                border: "2px solid white",
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                pointerEvents: "none",
              }}
            >
              {quantity}
            </div>
          )}
        </div>
      ) : (
        <div
          draggable
          onDragStart={onDragStart}
          style={{
            width,
            height: width,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: "0.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: width * 0.5,
            cursor: "grab",
            border: "2px solid rgba(255,255,255,0.3)",
            position: "relative",
          }}
        >
          {getItemEmoji(item.id)}
          {/* Badge de quantité */}
          {quantity > 1 && (
            <div
              style={{
                position: "absolute",
                top: -8,
                right: -8,
                background: "#ef4444",
                color: "white",
                borderRadius: "50%",
                width: 24,
                height: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.75rem",
                fontWeight: "bold",
                border: "2px solid white",
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
              }}
            >
              {quantity}
            </div>
          )}
        </div>
      )}
      <div style={{ fontSize: 12, marginTop: 4 }}>{item.name}</div>

      {/* Contrôles de quantité */}
      {onQuantityChange && (
        <div
          style={{
            display: "flex",
            gap: 4,
            marginTop: 4,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <button
            onClick={() => onQuantityChange(-1)}
            disabled={quantity <= 1}
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              border: "2px solid #3b82f6",
              background: quantity <= 1 ? "#e5e7eb" : "#3b82f6",
              color: quantity <= 1 ? "#9ca3af" : "white",
              cursor: quantity <= 1 ? "not-allowed" : "pointer",
              fontSize: "0.875rem",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
            }}
          >
            −
          </button>
          <span
            style={{
              fontSize: "0.875rem",
              fontWeight: "bold",
              minWidth: 20,
              textAlign: "center",
            }}
          >
            {quantity}
          </span>
          <button
            onClick={() => onQuantityChange(1)}
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              border: "2px solid #3b82f6",
              background: "#3b82f6",
              color: "white",
              cursor: "pointer",
              fontSize: "0.875rem",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
            }}
          >
            +
          </button>
        </div>
      )}
    </div>
  );
}
