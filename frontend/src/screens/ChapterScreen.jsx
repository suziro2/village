import React from "react";
import { useGame } from "@/game/GameContext";
import { CHAPTERS, BG_IMG, buildEnemy } from "@/game/data";
import { Panel, GoldButton, Stars } from "@/components/common";
import { ArrowLeft, Lock, Crown, Swords, Skull } from "lucide-react";

export default function ChapterScreen() {
  const { profile, currentChapter, startLevel, go } = useGame();
  const ch = CHAPTERS[currentChapter - 1];
  const completed = profile.progress.completed;

  const isLevelUnlocked = (lvl) => {
    if (lvl === 1) return true;
    return !!completed[`${currentChapter}-${lvl - 1}`];
  };

  return (
    <div className="flex-1 relative">
      <div className="absolute inset-0" style={{ backgroundImage: `url(${BG_IMG[currentChapter]})`, backgroundSize: "cover", backgroundPosition: "center" }} />
      <div className="absolute inset-0 bg-[#090d16]/85" />
      <div className="relative max-w-5xl mx-auto w-full px-3 sm:px-6 py-6">
        <div className="flex items-center gap-3 mb-6">
          <GoldButton variant="ghost" data-testid="chapter-back-btn" onClick={() => go("map")} className="!px-3 !py-2"><ArrowLeft size={18} /></GoldButton>
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-amber-400/80">Chapter {ch.id} · Recommended Lv {ch.rec}</div>
            <h1 className="vl-heading text-3xl sm:text-4xl">{ch.name}</h1>
          </div>
        </div>

        <div className="space-y-3">
          {ch.levels.map((name, idx) => {
            const lvl = idx + 1;
            const isBoss = lvl === 5;
            const unlocked = isLevelUnlocked(lvl);
            const stars = completed[`${currentChapter}-${lvl}`] || 0;
            const enemy = buildEnemy(currentChapter, lvl);
            return (
              <Panel
                key={lvl}
                className={`p-4 flex items-center gap-4 transition-all duration-300 vl-fade-up ${isBoss ? "border-rose-500/40 bg-rose-950/30" : ""} ${unlocked ? "hover:border-amber-400/60" : "opacity-60"}`}
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                <div className={`h-14 w-14 shrink-0 rounded-xl overflow-hidden border ${isBoss ? "border-rose-500/60" : "border-amber-500/40"} relative`}>
                  {unlocked ? (
                    <img src={enemy.img} alt={enemy.name} className="h-full w-full object-cover object-top" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-slate-800"><Lock size={20} className="text-slate-500" /></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`font-cinzel font-bold ${isBoss ? "text-rose-300" : "text-amber-200"}`}>{currentChapter}-{lvl}</span>
                    {isBoss ? <Crown size={15} className="text-rose-400" /> : <Swords size={13} className="text-slate-500" />}
                    <span className="text-slate-100 font-medium truncate">{name}</span>
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                    {isBoss ? <span className="text-rose-400 font-semibold">BOSS</span> : <span>Normal</span>}
                    {unlocked && <span className="flex items-center gap-1"><Skull size={11} /> {enemy.name}</span>}
                    {stars > 0 && <Stars count={stars} size={11} />}
                  </div>
                </div>
                <GoldButton
                  data-testid={`level-start-${currentChapter}-${lvl}-btn`}
                  variant={isBoss ? "danger" : "gold"}
                  disabled={!unlocked}
                  onClick={() => startLevel(currentChapter, lvl)}
                  className="!py-2 !px-4 text-sm shrink-0"
                >
                  {!unlocked ? <Lock size={15} /> : stars > 0 ? "Replay" : "Battle"}
                </GoldButton>
              </Panel>
            );
          })}
        </div>
      </div>
    </div>
  );
}
