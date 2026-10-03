import React from "react";
import { useGame } from "@/game/GameContext";
import { getHero, xpToNext, CHAPTERS } from "@/game/data";
import { Panel, GoldButton, Bar } from "@/components/common";
import { Play, Map, User, Store, ScrollText, Trash2 } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function MainMenu() {
  const { profile, computed, go, resetSave } = useGame();
  const hero = getHero(profile.heroId);
  const completedCount = Object.keys(profile.progress.completed).length;
  const curChapter = CHAPTERS[profile.progress.unlockedChapter - 1];

  const quick = [
    { id: "map", label: "World Map", icon: Map, desc: "Travel & battle" },
    { id: "character", label: "Character", icon: User, desc: "Stats & gear" },
    { id: "shop", label: "Shop", icon: Store, desc: "Buy potions" },
    { id: "quests", label: "Quests", icon: ScrollText, desc: "Claim rewards" },
  ];

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 py-6 flex flex-col gap-6">
      <Panel className="overflow-hidden vl-fade-up">
        <div className="grid grid-cols-1 md:grid-cols-[320px_1fr]">
          <div className="relative h-72 md:h-auto">
            <img src={hero.img} alt={hero.name} className="h-full w-full object-cover object-top" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-900/90 md:bg-gradient-to-r" />
          </div>
          <div className="p-6 flex flex-col justify-center">
            <div className="text-xs uppercase tracking-[0.2em] text-amber-400/80">Welcome back</div>
            <h1 className="vl-heading text-4xl sm:text-5xl mb-1">{profile.username}</h1>
            <p className="text-slate-300 text-sm mb-4">Level {profile.level} {hero.class} · "{hero.quote}"</p>

            <div className="max-w-md mb-5">
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>XP</span>
                <span>{profile.level >= 50 ? "MAX" : `${profile.xp} / ${xpToNext(profile.level)}`}</span>
              </div>
              <Bar value={profile.level >= 50 ? 1 : profile.xp} max={profile.level >= 50 ? 1 : xpToNext(profile.level)} color="#a855f7" />
            </div>

            <div className="flex flex-wrap gap-3">
              <GoldButton data-testid="continue-btn" onClick={() => go("map")} className="text-lg py-3 px-7"><Play size={20} /> Continue Adventure</GoldButton>
            </div>
            <p className="text-slate-400 text-xs mt-3">Current region: <span className="text-amber-300 font-semibold">{curChapter.name}</span> · {completedCount} / 50 levels cleared</p>
          </div>
        </div>
      </Panel>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {quick.map((q, i) => {
          const Icon = q.icon;
          return (
            <button
              key={q.id}
              data-testid={`menu-${q.id}-btn`}
              onClick={() => go(q.id)}
              className="group text-left rounded-xl border border-amber-500/20 bg-slate-900/60 hover:bg-slate-800/70 hover:border-amber-400/50 p-4 transition-all duration-300 hover:-translate-y-1 vl-fade-up"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <div className="h-11 w-11 rounded-lg bg-amber-500/15 border border-amber-400/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Icon className="text-amber-300" size={22} />
              </div>
              <div className="font-cinzel text-amber-200 font-bold">{q.label}</div>
              <div className="text-xs text-slate-400">{q.desc}</div>
            </button>
          );
        })}
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button data-testid="reset-save-btn" className="self-start flex items-center gap-2 text-xs text-rose-400/80 hover:text-rose-300 transition mt-2"><Trash2 size={14} /> Reset save & start over</button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-slate-900 border border-rose-500/40 text-slate-100">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-cinzel text-rose-300">Erase your legend?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">This permanently deletes {profile.username}'s progress, level, gear and coins. This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-800 border-slate-600 text-slate-200 hover:bg-slate-700">Keep playing</AlertDialogCancel>
            <AlertDialogAction data-testid="confirm-reset-btn" onClick={resetSave} className="bg-rose-600 hover:bg-rose-700 text-white">Erase forever</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
