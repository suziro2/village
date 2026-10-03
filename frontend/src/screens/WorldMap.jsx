import React from "react";
import { useGame } from "@/game/GameContext";
import { CHAPTERS, BG_IMG } from "@/game/data";
import { Panel, Stars } from "@/components/common";
import { Lock, ChevronRight, MapPin } from "lucide-react";

export default function WorldMap() {
  const { profile, openChapter } = useGame();
  const unlocked = profile.progress.unlockedChapter;
  const completed = profile.progress.completed;

  const chapterStars = (ch) => {
    let s = 0;
    for (let l = 1; l <= 5; l++) s += completed[`${ch}-${l}`] || 0;
    return s;
  };
  const chapterCleared = (ch) => {
    let c = 0;
    for (let l = 1; l <= 5; l++) if (completed[`${ch}-${l}`]) c++;
    return c;
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 py-6">
      <h1 className="vl-heading text-3xl sm:text-4xl mb-1">World Map</h1>
      <p className="text-slate-400 text-sm mb-6">Ten regions stand between your village and the Celestial Overlord.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CHAPTERS.map((ch, i) => {
          const isLocked = ch.id > unlocked;
          const cleared = chapterCleared(ch.id);
          const stars = chapterStars(ch.id);
          return (
            <button
              key={ch.id}
              data-testid={`world-map-chapter-${ch.id}-node`}
              disabled={isLocked}
              onClick={() => !isLocked && openChapter(ch.id)}
              className={`group relative text-left rounded-2xl overflow-hidden border transition-all duration-300 vl-fade-up ${
                isLocked ? "border-slate-700/50 cursor-not-allowed" : "border-amber-500/30 hover:border-amber-400 hover:-translate-y-1"
              }`}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="relative h-40 overflow-hidden">
                <img src={BG_IMG[ch.id]} alt={ch.name} className={`h-full w-full object-cover transition-transform duration-500 ${isLocked ? "grayscale brightness-50" : "group-hover:scale-110"}`} />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/60 rounded-full px-2.5 py-1 text-[11px] text-amber-200 font-semibold">
                  <MapPin size={12} /> Chapter {ch.id}
                </div>
                <div className="absolute top-2 right-2 bg-black/60 rounded-full px-2.5 py-1 text-[11px] text-slate-200">Lv {ch.rec}</div>
                {isLocked && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-12 w-12 rounded-full bg-black/70 border border-slate-500/50 flex items-center justify-center">
                      <Lock className="text-slate-300" size={22} />
                    </div>
                  </div>
                )}
              </div>
              <div className="p-3.5 bg-slate-900/80">
                <div className="flex items-center justify-between">
                  <h3 className="font-cinzel text-amber-200 font-bold">{ch.name}</h3>
                  {!isLocked && <ChevronRight className="text-amber-400 group-hover:translate-x-1 transition-transform" size={18} />}
                </div>
                <p className="text-xs text-slate-400 mb-2">{ch.theme}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">{isLocked ? "Locked" : `${cleared}/5 cleared`}</span>
                  <span className="flex items-center gap-1 text-[11px] text-amber-300"><Stars count={Math.min(3, Math.round(stars / 5))} size={11} /> {stars}/15</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
