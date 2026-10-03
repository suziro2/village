import React from "react";
import { useGame } from "@/game/GameContext";
import { RARITY, POTION_META, getComputedStats } from "@/game/data";
import { Panel, GoldButton } from "@/components/common";
import { Sword, Shirt, HardHat, Gem, FlaskConical } from "lucide-react";
import { toast, Toaster } from "sonner";

const SLOT_ICON = { weapon: Sword, armor: Shirt, helmet: HardHat, accessory: Gem };
const STAT_LABEL = { atk: "ATK", def: "DEF", hp: "HP", mp: "MP", mag: "MAG", spd: "SPD", crit: "CRIT" };

function statLine(stats) {
  return Object.entries(stats).map(([k, v]) => `+${v} ${STAT_LABEL[k]}`).join(" · ");
}

export default function InventoryScreen() {
  const { profile, equipItem, unequipItem, sellItem } = useGame();
  const items = profile.inventory.filter((i) => i.slot);
  const consumables = Object.entries(profile.consumables).filter(([, n]) => n > 0);

  return (
    <div className="flex-1 max-w-6xl mx-auto w-full px-3 sm:px-6 py-6">
      <Toaster position="top-center" theme="dark" />
      <h1 className="vl-heading text-3xl sm:text-4xl mb-5">Inventory</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
        <div className="space-y-5">
          <Panel className="p-5 vl-fade-up">
            <h3 className="font-cinzel text-amber-200 font-bold mb-3">Equipped</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {["weapon", "armor", "helmet", "accessory"].map((slot) => {
                const Icon = SLOT_ICON[slot];
                const item = profile.equipment[slot];
                const r = item ? RARITY[item.rarity] : null;
                return (
                  <div key={slot} data-testid={`inventory-slot-${slot}`} className="rounded-xl border p-3 bg-slate-950/50 flex flex-col items-center text-center" style={{ borderColor: item ? `${r.color}66` : "#33415555" }}>
                    <Icon size={20} className="mb-1" style={{ color: item ? r.color : "#475569" }} />
                    <div className="text-[10px] uppercase tracking-wider text-slate-500">{slot}</div>
                    {item ? (
                      <>
                        <div className="text-[11px] font-semibold my-1 leading-tight" style={{ color: r.color }}>{item.name}</div>
                        <div className="text-[9px] text-slate-400 mb-1.5">{statLine(item.stats)}</div>
                        <button data-testid={`unequip-${slot}-btn`} onClick={() => unequipItem(slot)} className="text-[10px] text-rose-400 hover:text-rose-300">Unequip</button>
                      </>
                    ) : (
                      <div className="text-[11px] text-slate-600 my-2">Empty</div>
                    )}
                  </div>
                );
              })}
            </div>
          </Panel>

          <Panel className="p-5 vl-fade-up">
            <h3 className="font-cinzel text-amber-200 font-bold mb-3">Gear ({items.length})</h3>
            {items.length === 0 ? (
              <p className="text-sm text-slate-500 py-6 text-center">No loot yet. Defeat enemies and bosses to find equipment!</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {items.map((item) => {
                  const r = RARITY[item.rarity];
                  const Icon = SLOT_ICON[item.slot];
                  return (
                    <div key={item.uid} data-testid={`inventory-item-${item.uid}`} className="flex items-center gap-3 rounded-xl border p-3 bg-slate-950/40" style={{ borderColor: `${r.color}55` }}>
                      <div className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${r.color}22` }}>
                        <Icon size={18} style={{ color: r.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold leading-tight" style={{ color: r.color }}>{item.name}</div>
                        <div className="text-[10px] text-slate-400">{r.label} · {statLine(item.stats)}</div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <button data-testid={`equip-${item.uid}-btn`} onClick={() => { equipItem(item.uid); toast.success(`Equipped ${item.name}`); }} className="text-[11px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-200 border border-amber-400/40 hover:bg-amber-500/30">Equip</button>
                        <button data-testid={`sell-${item.uid}-btn`} onClick={() => { sellItem(item.uid); toast(`Sold ${item.name}`); }} className="text-[11px] px-2 py-0.5 rounded bg-slate-700/50 text-slate-300 border border-slate-600/50 hover:bg-slate-600/50">Sell</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Panel>
        </div>

        <Panel className="p-5 h-fit vl-fade-up">
          <h3 className="font-cinzel text-amber-200 font-bold mb-3 flex items-center gap-2"><FlaskConical size={18} /> Consumables</h3>
          {consumables.length === 0 ? (
            <p className="text-sm text-slate-500 py-4 text-center">No potions. Visit the shop!</p>
          ) : (
            <div className="space-y-2">
              {consumables.map(([id, n]) => (
                <div key={id} data-testid={`consumable-${id}`} className="flex items-center justify-between rounded-lg bg-slate-950/50 border border-slate-700/50 px-3 py-2">
                  <span className="text-sm" style={{ color: POTION_META[id].accent }}>{POTION_META[id].name}</span>
                  <span className="text-sm font-mono text-slate-300">x{n}</span>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}
