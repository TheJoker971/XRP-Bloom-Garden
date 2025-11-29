import React from "react";
import NextImage from "next/image";
import { PackItem } from "../utils/gameModels";

type Props = { item: PackItem; width?: number };

export default function DraggableItem({ item, width = 64 }: Props) {
  function onDragStart(e: React.DragEvent) {
    const payload = {
      id: item.id,
      name: item.name,
      imageUrl: item.imageUrl || null,
    };
    e.dataTransfer.setData("application/json", JSON.stringify(payload));

    // If we have an image, use it as drag image to improve UX
    if (item.imageUrl) {
      const img = new Image();
      img.src = item.imageUrl;
      // if image is remote it may not be loaded immediately; still set it
      try {
        e.dataTransfer.setDragImage(img, width / 2, width / 2);
      } catch (err) {
        // ignore if browser blocks setDragImage for remote images
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
    <div style={{ display: "inline-block", textAlign: "center" }}>
      {item.imageUrl ? (
        <NextImage
          src={item.imageUrl}
          alt={item.name}
          width={width}
          height={width}
          draggable
          onDragStart={onDragStart}
          style={{ cursor: "grab", display: "block" }}
        />
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
          }}
        >
          {getItemEmoji(item.id)}
        </div>
      )}
      <div style={{ fontSize: 12 }}>{item.name}</div>
    </div>
  );
}
