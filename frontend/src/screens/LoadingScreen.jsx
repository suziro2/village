import React, { useEffect, useState } from "react";
import { Sparkles, Swords, Shield, Star } from "lucide-react";
import { BG_IMG } from "@/game/data";

const MESSAGES = [
  "Awakening the legends...",
  "Preparing the realm...",
  "Summoning the heroes...",
  "Sharpening your blades...",
  "Entering the village...",
];

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState(MESSAGES[0]);

  useEffect(() => {
    let value = 0;
    const timer = setInterval(() => {
      value = Math.min(100, value + Math.floor(Math.random() * 8) + 3);
      setProgress(value);
      setMessage(MESSAGES[Math.min(MESSAGES.length - 1, Math.floor(value / 22))]);
      if (value >= 100) clearInterval(timer);
    }, 90);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="vl-loading-screen relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(5,8,18,.68),rgba(5,8,18,.9)), url(${BG_IMG[10]})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="vl-loading-star vl-loading-star-1"><Star size={14} /></div>
        <div className="vl-loading-star vl-loading-star-2"><Sparkles size={18} /></div>
        <div className="vl-loading-star vl-loading-star-3"><Star size={11} /></div>
        <div className="vl-loading-ring vl-loading-ring-1" />
        <div className="vl-loading-ring vl-loading-ring-2" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-5">
        <div className="vl-loading-orb vl-float mb-7">
          <div className="absolute h-20 w-20 rounded-full border border-amber-300/20 animate-ping" />
          <Swords size={42} />
        </div>

        <div className="flex items-center gap-2 text-amber-300/70 text-[10px] uppercase tracking-[0.5em] mb-3">
          <Shield size={12} />
          <span>Fantasy RPG</span>
          <Shield size={12} />
        </div>

        <h1 className="vl-heading text-5xl sm:text-7xl leading-none">
          Village
          <span className="block text-amber-400">Legends</span>
        </h1>

        <p className="text-slate-300/80 text-sm mt-4 min-h-5 transition-opacity duration-300">
          {message}
        </p>

        <div className="w-80 max-w-[82vw] mt-8">
          <div className="h-2 rounded-full bg-black/50 overflow-hidden border border-amber-400/20 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-amber-600 via-amber-300 to-yellow-500 transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-[10px] uppercase tracking-[0.3em] text-amber-300/70">
            <span><Sparkles size={11} className="inline mr-1" />Loading realm</span>
            <span>{progress}%</span>
          </div>
        </div>

        <div className="flex gap-2 mt-7">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-1.5 w-1.5 rounded-full bg-amber-300 animate-pulse" style={{ animationDelay: `${i * 180}ms` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
