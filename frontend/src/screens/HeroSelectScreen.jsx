import React, { useState } from "react";
import { useGame } from "@/game/GameContext";
import { HEROES } from "@/game/data";
import { Panel, GoldButton, Bar } from "@/components/common";
import { Check, Heart, Droplet, Swords, Shield, Zap, Wind, Target } from "lucide-react";

const STAT_ROWS = [
  { key: "hp", label: "HP", icon: Heart, color: "#ef4444", max: 140 },
  { key: "mp", label: "MP", icon: Droplet, color: "#38bdf8", max: 100 },
  { key: "atk", label: "ATK", icon: Swords, color: "#f59e0b", max: 20 },
  { key: "def", label: "DEF", icon: Shield, color: "#eab308", max: 20 },
  { key: "mag", label: "MAG", icon: Zap, color: "#a855f7", max: 22 },
  { key: "spd", label: "SPD", icon: Wind, color: "#34d399", max: 20 },
  { key: "crit", label: "CRIT", icon: Target, color: "#fb7185", max: 22 },
];

export default function HeroSelectScreen() {
  const { draftName, startNewGame } = useGame();
  const [selected, setSelected] = useState(HEROES[0]);

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 py-6">
      <div className="mb-5">
        <h1 className="vl-heading text-3xl sm:text-4xl">Choose Your Hero</h1>
        <p className="text-slate-400 text-sm">Welcome, {draftName || "Player"}. Pick the legend you will become.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
        {/* grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {HEROES.map((h) => {
            const active = selected.id === h.id;
            return (
              <button
                key={h.id}
                data-testid={`hero-card-${h.id}`}
                onClick={() => setSelected(h)}
                className={`group relative rounded-xl overflow-hidden border text-left transition-all duration-300 ${
                  active ? "border-amber-400 ring-2 ring-amber-400/40 scale-[1.02]" : "border-slate-700/60 hover:border-amber-400/60"
                }`}
              >
                <div className="aspect-[3/4] overflow-hidden bg-slate-900">
                  <img src={h.img} alt={h.name} className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-2.5">
                  <div className="font-cinzel text-amber-300 text-sm font-bold leading-tight">{h.name}</div>
                  <div className="text-[11px] text-slate-300">{h.class}</div>
                </div>
                {active && <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-amber-400 flex items-center justify-center"><Check size={14} className="text-black" /></div>}
              </button>
            );
          })}
        </div>

        {/* detail */}
        <Panel className="p-5 h-fit lg:sticky lg:top-24 vl-fade-up" key={selected.id}>
          <div className="flex gap-4">
            <div className="h-28 w-24 rounded-lg overflow-hidden border border-amber-500/40 shrink-0">
              <img src={selected.img} alt={selected.name} className="h-full w-full object-cover object-top" />
            </div>
            <div>
              <h2 className="font-cinzel text-2xl font-bold" style={{ color: selected.color }}>{selected.name}</h2>
              <div className="text-xs uppercase tracking-widest text-amber-400/80 mb-2">{selected.class}</div>
              <p className="text-slate-400 text-xs italic">"{selected.quote}"</p>
            </div>
          </div>

          <div className="mt-5 space-y-2">
            {STAT_ROWS.map((r) => {
              const Icon = r.icon;
              return (
                <div key={r.key} className="flex items-center gap-2">
                  <Icon size={13} style={{ color: r.color }} className="shrink-0" />
                  <span className="text-[11px] text-slate-400 w-9">{r.label}</span>
                  <Bar value={selected.base[r.key]} max={r.max} color={r.color} />
                  <span className="text-[11px] font-mono text-slate-300 w-7 text-right">{selected.base[r.key]}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 space-y-2 text-xs">
            <div className="rounded-lg bg-sky-500/10 border border-sky-500/30 p-2.5">
              <span className="text-sky-300 font-semibold">Skill · {selected.skill.name}</span>
              <span className="text-slate-400"> ({selected.skill.mp} MP)</span>
              <p className="text-slate-400 mt-0.5">{selected.skill.desc}</p>
            </div>
            <div className="rounded-lg bg-amber-500/10 border border-amber-500/30 p-2.5">
              <span className="text-amber-300 font-semibold">Passive · {selected.passive.name}</span>
              <p className="text-slate-400 mt-0.5">{selected.passive.desc}</p>
            </div>
          </div>

          <GoldButton data-testid="confirm-hero-btn" onClick={() => startNewGame(draftName.trim(), selected.id)} className="w-full mt-5 py-3 text-base">
            Confirm {selected.name}
          </GoldButton>
        </Panel>
      </div>
    </div>
  );
}
