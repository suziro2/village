import React from "react";
import { useGame } from "@/game/GameContext";
import { getHero, xpToNext } from "@/game/data";
import { Bar } from "@/components/common";
import { Map, User, Backpack, ScrollText, Store, Settings as SettingsIcon, Home, Coins, Gem, Heart, Droplet } from "lucide-react";

const TABS = [
  { id: "map", label: "Map", icon: Map },
  { id: "character", label: "Hero", icon: User },
  { id: "inventory", label: "Bag", icon: Backpack },
  { id: "quests", label: "Quests", icon: ScrollText },
  { id: "shop", label: "Shop", icon: Store },
  { id: "settings", label: "Settings", icon: SettingsIcon },
];

export default function NavBar() {
  const { profile, computed, screen, go } = useGame();
  if (!profile) return null;
  const hero = getHero(profile.heroId);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[#090d16]/85 border-b border-amber-500/25 shadow-lg shadow-black/40">
      <div className="max-w-7xl mx-auto w-full px-3 sm:px-6 py-2.5 flex items-center gap-3">
        <button data-testid="nav-home-btn" onClick={() => go("menu")} className="flex items-center gap-2.5 shrink-0 group">
          <div className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-amber-400/70 vl-pulse">
            <img src={hero.img} alt={hero.name} className="h-full w-full object-cover object-top" />
          </div>
          <div className="hidden sm:block leading-tight">
            <div className="font-cinzel text-amber-300 text-sm font-bold">{profile.username}</div>
            <div className="text-[11px] text-slate-400">Lv {profile.level} · {hero.class}</div>
          </div>
        </button>

        <div className="hidden md:flex items-center gap-3 flex-1 max-w-md">
          <div className="flex-1">
            <div className="flex items-center gap-1 text-[10px] text-rose-300 mb-0.5"><Heart size={11} /> {profile.hp}/{computed.maxHp}</div>
            <Bar value={profile.hp} max={computed.maxHp} color="#ef4444" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1 text-[10px] text-sky-300 mb-0.5"><Droplet size={11} /> {profile.mp}/{computed.maxMp}</div>
            <Bar value={profile.mp} max={computed.maxMp} color="#38bdf8" />
          </div>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <span className="flex items-center gap-1 text-amber-300 text-sm font-semibold" data-testid="nav-coins"><Coins size={16} /> {profile.coins}</span>
          <span className="hidden sm:flex items-center gap-1 text-fuchsia-300 text-sm font-semibold"><Gem size={15} /> {profile.gems}</span>
        </div>
      </div>

      <nav className="max-w-7xl mx-auto w-full px-2 sm:px-6 pb-2 flex items-center gap-1 overflow-x-auto">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = screen === t.id;
          return (
            <button
              key={t.id}
              data-testid={`nav-${t.id}-btn`}
              onClick={() => go(t.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                active ? "bg-amber-500/20 text-amber-200 border border-amber-400/50" : "text-slate-400 hover:text-amber-200 border border-transparent hover:bg-slate-800/60"
              }`}
            >
              <Icon size={15} /> {t.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
