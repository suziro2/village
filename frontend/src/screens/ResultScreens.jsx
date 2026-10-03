import React, { useEffect } from "react";
import { useGame } from "@/game/GameContext";
import { getHero, CHAPTERS, BG_IMG, RARITY } from "@/game/data";
import { playSfx } from "@/game/audio";
import { Panel, GoldButton, Stars } from "@/components/common";
import { Coins, Sparkles, TrendingUp, Gift, Skull, Crown, Trophy, Home, RefreshCw, Map, Gem } from "lucide-react";

function RewardRow({ rewards }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 my-5">
      <div className="flex items-center gap-1.5 text-fuchsia-300"><Sparkles size={18} /> <span className="font-bold">+{rewards.xp}</span> XP</div>
      <div className="flex items-center gap-1.5 text-amber-300"><Coins size={18} /> <span className="font-bold">+{rewards.coins}</span></div>
      {rewards.gems > 0 && <div className="flex items-center gap-1.5 text-fuchsia-200" data-testid="reward-gems"><Gem size={16} /> <span className="font-bold">+{rewards.gems}</span></div>}
      {rewards.leveled && <div className="flex items-center gap-1.5 text-emerald-300"><TrendingUp size={18} /> Level {rewards.newLevel}!</div>}
    </div>
  );
}

function useResultSfx(name, leveled) {
  useEffect(() => {
    playSfx(name);
    if (leveled) setTimeout(() => playSfx("levelup"), 900);
  }, [name, leveled]);
}

function DropRow({ item }) {
  if (!item) return null;
  const r = RARITY[item.rarity];
  return (
    <div className="flex items-center justify-center gap-2 mb-4">
      <Gift size={16} className="text-amber-300" />
      <span className="text-sm text-slate-300">Loot:</span>
      <span className="text-sm font-semibold" style={{ color: r.color }}>{item.name}</span>
      <span className="text-[11px] px-1.5 py-0.5 rounded" style={{ background: `${r.color}22`, color: r.color }}>{r.label}</span>
    </div>
  );
}

function Shell({ children, bg }) {
  return (
    <div className="flex-1 flex items-center justify-center p-4 relative">
      <div className="absolute inset-0" style={{ backgroundImage: `url(${bg})`, backgroundSize: "cover", backgroundPosition: "center" }} />
      <div className="absolute inset-0 bg-[#090d16]/85" />
      {children}
    </div>
  );
}

export function VictoryScreen() {
  const { lastRewards, currentBattle, startLevel, openChapter, go } = useGame();
  const { chapter, level } = currentBattle;
  const hasNext = level < 5;
  const r = lastRewards || { xp: 0, coins: 0 };
  useResultSfx("victory", r.leveled);
  return (
    <Shell bg={BG_IMG[chapter]}>
      <Panel className="relative w-full max-w-md p-8 text-center vl-victory-pop">
        <div className="mx-auto h-16 w-16 rounded-full bg-amber-500/20 border border-amber-400/50 flex items-center justify-center mb-3 vl-float">
          <Trophy className="text-amber-300" size={32} />
        </div>
        <h1 className="vl-heading text-4xl mb-1">Victory!</h1>
        <div className="flex justify-center mb-2"><Stars count={r.stars || 1} size={22} /></div>
        <RewardRow rewards={r} />
        <DropRow item={r.item} />
        <div className="flex flex-col gap-2 mt-4">
          {hasNext && <GoldButton data-testid="next-battle-btn" onClick={() => startLevel(chapter, level + 1)}>Next Battle →</GoldButton>}
          <GoldButton variant="ghost" data-testid="victory-chapter-btn" onClick={() => openChapter(chapter)}>Chapter Levels</GoldButton>
          <GoldButton variant="ghost" data-testid="victory-map-btn" onClick={() => go("map")}><Map size={16} /> World Map</GoldButton>
        </div>
      </Panel>
    </Shell>
  );
}

export function DefeatScreen() {
  const { currentBattle, startLevel, go } = useGame();
  const { chapter, level } = currentBattle;
  useResultSfx("defeat", false);
  return (
    <Shell bg={BG_IMG[chapter]}>
      <Panel className="relative w-full max-w-md p-8 text-center vl-fade-up border-rose-500/40">
        <div className="mx-auto h-16 w-16 rounded-full bg-rose-500/20 border border-rose-400/50 flex items-center justify-center mb-3">
          <Skull className="text-rose-300" size={32} />
        </div>
        <h1 className="font-cinzel text-4xl font-bold text-rose-300 mb-1 uppercase tracking-wide">Defeated</h1>
        <p className="text-slate-400 text-sm mb-6">Your journey isn't over. Regroup and try again — your progress is safe.</p>
        <div className="flex flex-col gap-2">
          <GoldButton variant="danger" data-testid="retry-btn" onClick={() => startLevel(chapter, level)}><RefreshCw size={16} /> Retry Battle</GoldButton>
          <GoldButton variant="ghost" data-testid="defeat-map-btn" onClick={() => go("map")}><Map size={16} /> Flee to Map</GoldButton>
        </div>
      </Panel>
    </Shell>
  );
}

export function ChapterCompleteScreen() {
  const { lastRewards, currentBattle, openChapter, go } = useGame();
  const { chapter } = currentBattle;
  const nextCh = Math.min(10, chapter + 1);
  const nextName = CHAPTERS[nextCh - 1].name;
  const r = lastRewards || { xp: 0, coins: 0 };
  useResultSfx("victory", r.leveled);
  return (
    <Shell bg={BG_IMG[chapter]}>
      <Panel className="relative w-full max-w-md p-8 text-center vl-victory-pop">
        <div className="mx-auto h-16 w-16 rounded-full bg-amber-500/20 border border-amber-400/50 flex items-center justify-center mb-3 vl-float">
          <Crown className="text-amber-300" size={32} />
        </div>
        <div className="text-xs uppercase tracking-[0.2em] text-amber-400/80">Chapter {chapter} Cleared</div>
        <h1 className="vl-heading text-3xl mb-1">{CHAPTERS[chapter - 1].name}</h1>
        <p className="text-emerald-300 text-sm mb-1">Boss defeated!</p>
        <RewardRow rewards={r} />
        <DropRow item={r.item} />
        <p className="text-slate-400 text-sm mb-4">✦ New region unlocked: <span className="text-amber-300 font-semibold">{nextName}</span></p>
        <div className="flex flex-col gap-2">
          <GoldButton data-testid="next-chapter-btn" onClick={() => openChapter(nextCh)}>Enter {nextName} →</GoldButton>
          <GoldButton variant="ghost" data-testid="chaptercomplete-map-btn" onClick={() => go("map")}><Map size={16} /> World Map</GoldButton>
        </div>
      </Panel>
    </Shell>
  );
}

export function GameCompleteScreen() {
  const { profile, go } = useGame();
  const hero = getHero(profile.heroId);
  useResultSfx("victory", true);
  return (
    <Shell bg={BG_IMG[10]}>
      <Panel className="relative w-full max-w-lg p-8 text-center vl-victory-pop">
        <div className="mx-auto h-20 w-20 rounded-full bg-amber-500/20 border border-amber-400/60 flex items-center justify-center mb-4 vl-pulse">
          <Trophy className="text-amber-300" size={40} />
        </div>
        <h1 className="vl-heading text-4xl sm:text-5xl mb-2">A Legend is Born</h1>
        <p className="text-slate-300 text-sm mb-1">The Celestial Overlord has fallen.</p>
        <p className="text-slate-400 text-sm mb-6">{profile.username} the {hero.class} has saved the realm and become a true Village Legend. The world sings of your name.</p>
        <div className="flex flex-wrap justify-center gap-4 mb-6 text-sm">
          <span className="text-fuchsia-300">Final Level {profile.level}</span>
          <span className="text-amber-300">{profile.coins} coins</span>
          <span className="text-emerald-300">50/50 cleared</span>
        </div>
        <GoldButton data-testid="game-complete-home-btn" onClick={() => go("menu")}><Home size={16} /> Return Home</GoldButton>
        <p className="text-[11px] text-slate-500 mt-4">You can keep replaying any level to hunt for better loot.</p>
      </Panel>
    </Shell>
  );
}
