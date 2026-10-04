import React, { useEffect, useState } from "react";
import { Sparkles, Swords } from "lucide-react";

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let value = 0;
    const timer = setInterval(() => {
      value = Math.min(100, value + Math.floor(Math.random() * 13) + 5);
      setProgress(value);
      if (value >= 100) value = 12;
    }, 110);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="vl-loading-screen">
      <div className="vl-loading-orb vl-float">
        <Swords size={42} />
      </div>
      <div className="vl-heading text-4xl sm:text-6xl">Village Legends</div>
      <p className="text-slate-400 mt-2">Awakening the legends...</p>
      <div className="w-72 max-w-[80vw] mt-8">
        <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden border border-white/10">
          <div className="h-full bg-amber-400 transition-all duration-150" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex justify-between mt-2 text-[10px] uppercase tracking-[0.3em] text-amber-300/70">
          <span><Sparkles size={11} className="inline mr-1" />Loading</span>
          <span>{progress}%</span>
        </div>
      </div>
    </div>
  );
}
