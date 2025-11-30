"use client";

import { useState, useRef, useEffect } from "react";

type Props = {
  onComplete: () => void;
  packType?: "nature" | "fire";
};

export default function PackOpening({ onComplete, packType = "nature" }: Props) {
  const [stage, setStage] = useState<"booster" | "slider" | "video" | "flash">("booster");
  const [sliderPosition, setSliderPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [videoZoom, setVideoZoom] = useState(1);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleSliderStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
  };

  const handleSliderMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging || !sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const position = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    setSliderPosition(position);

    // Si on atteint 90%, on lance la vidéo
    if (position >= 90) {
      setIsDragging(false);
      setStage("video");
      setTimeout(() => {
        videoRef.current?.play();
      }, 100);
    }
  };

  const handleSliderEnd = () => {
    if (sliderPosition < 90) {
      // Retour à 0 si pas assez loin
      setSliderPosition(0);
    }
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleSliderMove);
      window.addEventListener("mouseup", handleSliderEnd);
      window.addEventListener("touchmove", handleSliderMove);
      window.addEventListener("touchend", handleSliderEnd);

      return () => {
        window.removeEventListener("mousemove", handleSliderMove);
        window.removeEventListener("mouseup", handleSliderEnd);
        window.removeEventListener("touchmove", handleSliderMove);
        window.removeEventListener("touchend", handleSliderEnd);
      };
    }
  }, [isDragging, sliderPosition]);

  useEffect(() => {
    // Après 1 seconde sur le booster, montrer le slider
    const timer = setTimeout(() => {
      setStage("slider");
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (stage === "video" && videoRef.current) {
      videoRef.current.play();
      
      // Gérer le zoom progressif dans les dernières secondes
      const handleTimeUpdate = () => {
        if (videoRef.current) {
          const duration = videoRef.current.duration;
          const currentTime = videoRef.current.currentTime;
          const timeRemaining = duration - currentTime;
          
          // Commencer le zoom 3 secondes avant la fin
          if (timeRemaining <= 3 && timeRemaining > 0) {
            // Zoom de 1x à 8x sur les 3 dernières secondes
            const progress = 1 - (timeRemaining / 3);
            const zoom = 1 + (progress * 7); // De 1 à 8
            setVideoZoom(zoom);
          }
        }
      };
      
      videoRef.current.addEventListener('timeupdate', handleTimeUpdate);
      
      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        }
      };
    }
  }, [stage]);

  const handleVideoEnd = () => {
    // Directement vers les cartes
    onComplete();
  };

  const getPackImage = () => {
    return packType === "fire" 
      ? "/images/pack_fire.png" 
      : "/images/pack_nature.png";
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...(stage === "flash" 
          ? { background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)" }
          : {
              backgroundImage: "url('/images/arriere-plan.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
        ),
        transition: "background 0.5s ease",
      }}
    >
      {/* Stage 1 & 2: Booster + Slider */}
      {(stage === "booster" || stage === "slider") && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "3rem",
            animation: stage === "booster" ? "scaleIn 0.5s ease" : "none",
          }}
        >
          {/* Image du booster */}
          <div
            style={{
              width: "400px",
              height: "550px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "1.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
              border: "4px solid rgba(255,255,255,0.3)",
              animation: stage === "slider" ? "pulse 2s infinite" : "none",
              overflow: "hidden",
            }}
          >
            <img 
              src="/images/booster.jpeg"
              alt="Booster pack"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </div>

          {/* Slider */}
          {stage === "slider" && (
            <div
              style={{
                width: "400px",
                maxWidth: "90vw",
                animation: "fadeIn 0.5s ease",
              }}
            >
              <div
                ref={sliderRef}
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100px",
                  background: "linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))",
                  borderRadius: "3rem",
                  border: "4px solid rgba(255,255,255,0.4)",
                  overflow: "hidden",
                  cursor: "pointer",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.3), inset 0 2px 10px rgba(255,255,255,0.1)",
                }}
              >
                {/* Barre de progression */}
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: `${sliderPosition}%`,
                    background: "linear-gradient(90deg, #10b981 0%, #059669 100%)",
                    transition: isDragging ? "none" : "width 0.3s ease",
                  }}
                />

                {/* Bouton draggable */}
                <div
                  onMouseDown={handleSliderStart}
                  onTouchStart={handleSliderStart}
                  style={{
                    position: "absolute",
                    left: `${sliderPosition}%`,
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "90px",
                    height: "90px",
                    background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #dc2626 100%)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "2.5rem",
                    cursor: isDragging ? "grabbing" : "grab",
                    boxShadow: "0 8px 24px rgba(251, 191, 36, 0.5), 0 0 0 6px rgba(255,255,255,0.3), inset 0 2px 8px rgba(255,255,255,0.3)",
                    transition: isDragging ? "none" : "left 0.3s ease",
                    filter: isDragging ? "brightness(1.2)" : "brightness(1)",
                  }}
                >
                  ➤
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stage 3: Vidéo */}
      {stage === "video" && (
        <video
          ref={videoRef}
          onEnded={handleVideoEnd}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            transform: `scale(${videoZoom})`,
            transition: "none",
            willChange: "transform",
          }}
          playsInline
          muted={false}
        >
          <source src="/images/open_booster.mp4" type="video/mp4" />
        </video>
      )}

      {/* Stage 4: Flash doré */}
      {stage === "flash" && (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "flash 0.5s ease",
          }}
        >
          <div
            style={{
              fontSize: "10rem",
              animation: "rotate 0.5s ease",
            }}
          >
            ✨
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes scaleIn {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes flash {
          0% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 1; }
        }
        @keyframes rotate {
          from { transform: rotate(0deg) scale(0.5); }
          to { transform: rotate(360deg) scale(1); }
        }
      `}</style>
    </div>
  );
}
