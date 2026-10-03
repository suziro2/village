import React from "react";
import { useGame } from "@/game/GameContext";
import { getHero, xpToNext, RARITY } from "@/game/data";
import { Panel, Bar } from "@/components/common";
import { Heart, Droplet, Swords, Shield, Zap, Wind, Target, Sword, HardHat, Shirt, Gem } from "lucide-react";

const STATS = [
  { key: "maxHp", label: "Max HP", icon: Heart, color: "#ef4444" },
  { key: "maxMp", label: "Max MP", icon: Droplet, color: "#38bdf8" },
  { key: "atk", label: "Attack", icon: Swords, color: "#f59e0b" },
  { key: "def", label: "Defense", icon: Shield, color: "#eab308" },
  { key: "mag", label: "Magic", icon: Zap, color: "#a855f7" },
  { key: "spd", label: "Speed", icon: Wind, color: "#34d399" },
  { key: "crit", label: "Crit %", icon: Target, color: "#fb7185" },
];

const SLOT_ICON = { weapon: Sword, armor: Shirt, helmet: HardHat, accessory: Gem };

export default function CharacterScreen() {
  const { profile, computed } = useGame();
  const hero = getHero(profile.heroId);

  return (
    <div className="flex-1 max-w-6xl mx-auto w-full px-3 sm:px-6 py-6">
      <h1 className="vl-heading text-3xl sm:text-4xl mb-5">Character</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-5">
        <Panel className="overflow-hidden vl-fade-up">
          <div className="relative h-80">
            <img src={hero.img} alt={hero.name} className="h-full w-full object-cover object-top" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-4">
              <h2 className="font-cinzel text-2xl font-bold" style={{ color: hero.color }}>{profile.username}</h2>
              <div className="text-sm text-slate-300">Lv {profile.level} · {hero.class}</div>
            </div>
          </div>
          <div className="p-4">
            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
              <span>Experience</span>
              <span>{profile.level >= 50 ? "MAX LEVEL" : `${profile.xp} / ${xpToNext(profile.level)}`}</span>
            </div>
            <Bar value={profile.level >= 50 ? 1 : profile.xp} max={profile.level >= 50 ? 1 : xpToNext(profile.level)} color="#a855f7" className="mb-3" />
            <p className="text-slate-400 text-xs italic">"{hero.quote}"</p>
          </div>
        </Panel>

        <div className="space-y-5">
          <Panel className="p-5 vl-fade-up">
            <h3 className="font-cinzel text-amber-200 font-bold mb-3">Stats</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
              {STATS.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.key} className="flex items-center gap-2" data-testid={`char-stat-${s.key}`}>
                    <Icon size={15} style={{ color: s.color }} className="shrink-0" />
                    <span className="text-xs text-slate-400 flex-1">{s.label}</span>
                    <span className="font-mono font-bold text-sm" style={{ color: s.color }}>{computed[s.key]}</span>
                  </div>
                );
              })}
            </div>
          </Panel>

          <Panel className="p-5 vl-fade-up">
            <h3 className="font-cinzel text-amber-200 font-bold mb-3">Equipment</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {["weapon", "armor", "helmet", "accessory"].map((slot) => {
                const Icon = SLOT_ICON[slot];
                const item = profile.equipment[slot];
                const r = item ? RARITY[item.rarity] : null;
                return (
                  <div key={slot} data-testid={`char-equip-${slot}`} className="rounded-xl border p-3 text-center bg-slate-950/50" style={{ borderColor: item ? `${r.color}66` : "#33415555" }}>
                    <Icon size={22} className="mx-auto mb-1.5" style={{ color: item ? r.color : "#475569" }} />
                    <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-0.5">{slot}</div>
                    {item ? (
                      <div className="text-[11px] font-semibold leading-tight" style={{ color: r.color }}>{item.name}</div>
                    ) : (
                      <div className="text-[11px] text-slate-600">Empty</div>
                    )}
                  </div>
                );
              })}
            </div>
          </Panel>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Panel className="p-4 vl-fade-up border-sky-500/30">
              <h3 className="font-cinzel text-sky-300 font-bold text-sm mb-1">Skill · {hero.skill.name}</h3>
              <div className="text-[11px] text-sky-400/80 mb-1">Cost: {hero.skill.mp} MP</div>
              <p className="text-xs text-slate-400">{hero.skill.desc}</p>
            </Panel>
            <Panel className="p-4 vl-fade-up border-amber-500/30">
              <h3 className="font-cinzel text-amber-300 font-bold text-sm mb-1">Passive · {hero.passive.name}</h3>
              <p className="text-xs text-slate-400">{hero.passive.desc}</p>
            </Panel>
          </div>
        </div>
      </div>
    </div>
  );
}
