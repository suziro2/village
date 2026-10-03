import React, { useState } from "react";
import { useGame } from "@/game/GameContext";
import { SHOP_ITEMS, GEM_GEAR, GEM_UPGRADES, GEM_CONSUMABLES, blessingCost, RARITY } from "@/game/data";
import { playSfx } from "@/game/audio";
import { Panel, GoldButton } from "@/components/common";
import { Coins, FlaskConical, ShoppingBag, Gem, Sword, Shirt, HardHat, Sparkles, Feather, Crown } from "lucide-react";
import { toast, Toaster } from "sonner";

const SLOT_ICON = { weapon: Sword, armor: Shirt, helmet: HardHat, accessory: Gem };

export default function ShopScreen() {
  const { profile, buyItem, buyGemGear, buyGemConsumable, buyBlessing } = useGame();
  const [tab, setTab] = useState("coins");

  const result = (ok, name, sfx = "buy") => {
    if (ok) { toast.success(`Bought ${name}`); playSfx(sfx); }
    else { toast.error(tab === "coins" ? "Not enough coins!" : "Not enough gems!"); playSfx("error"); }
  };

  return (
    <div className="flex-1 max-w-5xl mx-auto w-full px-3 sm:px-6 py-6">
      <Toaster position="top-center" theme="dark" />
      <div className="flex items-end justify-between mb-4 flex-wrap gap-2">
        <div>
          <h1 className="vl-heading text-3xl sm:text-4xl">Merchant's Shop</h1>
          <p className="text-slate-400 text-sm">{tab === "coins" ? '"Finest potions this side of the kingdom, traveler."' : '"Ah... a collector of gems. Step into the back room."'}</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-amber-300 font-bold text-lg" data-testid="shop-coins"><Coins size={20} /> {profile.coins}</span>
          <span className="flex items-center gap-1.5 text-fuchsia-300 font-bold text-lg" data-testid="shop-gems"><Gem size={18} /> {profile.gems}</span>
        </div>
      </div>

      <div className="flex gap-2 mb-5">
        <TabBtn active={tab === "coins"} onClick={() => setTab("coins")} testid="shop-tab-coins" icon={Coins} color="#f59e0b">Potions & Supplies</TabBtn>
        <TabBtn active={tab === "gems"} onClick={() => setTab("gems")} testid="shop-tab-gems" icon={Gem} color="#e879f9">Gem Emporium</TabBtn>
      </div>

      {tab === "coins" ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {SHOP_ITEMS.map((item, i) => (
              <Panel key={item.id} className="p-4 flex flex-col vl-fade-up" style={{ animationDelay: `${i * 50}ms` }}>
                <div className="flex items-start gap-3 mb-3">
                  <div className="h-11 w-11 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${item.accent}22` }}>
                    <FlaskConical size={22} style={{ color: item.accent }} />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-slate-100 text-sm leading-tight">{item.name}</div>
                    <div className="text-[11px] text-slate-400">Owned: {profile.consumables[item.id] || 0}</div>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mb-3 flex-1">{item.desc}</p>
                <GoldButton data-testid={`shop-buy-${item.id}-btn`} disabled={profile.coins < item.price} onClick={() => result(buyItem(item), item.name)} className="w-full !py-2 text-sm">
                  <Coins size={15} /> {item.price}
                </GoldButton>
              </Panel>
            ))}
          </div>
          <Panel className="p-4 mt-5 flex items-center gap-3 vl-fade-up">
            <ShoppingBag className="text-amber-300" size={20} />
            <p className="text-xs text-slate-400">Earn coins by winning battles, defeating bosses and claiming quests. Spend wisely — the road ahead grows dangerous.</p>
          </Panel>
        </>
      ) : (
        <div className="space-y-6">
          <section>
            <h2 className="font-cinzel text-fuchsia-200 font-bold text-base md:text-lg mb-3 flex items-center gap-2"><Sparkles size={16} /> Eternal Blessings <span className="text-[10px] text-slate-500 font-sans font-normal">permanent stat boosts</span></h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {GEM_UPGRADES.map((u, i) => {
                const rank = profile.upgrades[u.id] || 0;
                const maxed = rank >= u.max;
                const cost = blessingCost(u, rank);
                return (
                  <Panel key={u.id} className="p-4 flex flex-col vl-fade-up border-fuchsia-500/25" style={{ animationDelay: `${i * 50}ms` }} data-testid={`blessing-${u.id}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="font-semibold text-slate-100 text-sm" style={{ color: u.color }}>{u.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">Rank {rank}/{u.max}</div>
                    </div>
                    <div className="flex gap-1 mb-2">
                      {Array.from({ length: u.max }).map((_, k) => (
                        <span key={k} className="h-1.5 flex-1 rounded-full" style={{ background: k < rank ? u.color : "#1e293b" }} />
                      ))}
                    </div>
                    <p className="text-xs text-slate-400 mb-3 flex-1">{u.desc}</p>
                    <GoldButton data-testid={`blessing-buy-${u.id}-btn`} variant="blue" disabled={maxed || profile.gems < cost} onClick={() => result(buyBlessing(u.id), `${u.name} Rank ${rank + 1}`, "gem")} className="w-full !py-2 text-sm !bg-gradient-to-br !from-fuchsia-600 !to-purple-900 !border-fuchsia-400/50">
                      {maxed ? "MAX RANK" : <><Gem size={14} /> {cost}</>}
                    </GoldButton>
                  </Panel>
                );
              })}
            </div>
          </section>

          <section>
            <h2 className="font-cinzel text-fuchsia-200 font-bold text-base md:text-lg mb-3 flex items-center gap-2"><Crown size={16} /> Premium Gear</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {GEM_GEAR.map((g, i) => {
                const Icon = SLOT_ICON[g.slot];
                const r = RARITY[g.rarity];
                return (
                  <Panel key={g.id} className="p-4 flex flex-col vl-fade-up" style={{ animationDelay: `${i * 50}ms`, borderColor: `${r.color}55` }} data-testid={`gem-gear-${g.id}`}>
                    <div className="flex items-start gap-3 mb-2">
                      <div className="h-11 w-11 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${r.color}22` }}>
                        <Icon size={22} style={{ color: r.color }} />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-sm leading-tight" style={{ color: r.color }}>{g.name}</div>
                        <div className="text-[10px] uppercase tracking-wider text-slate-500">{r.label} · {g.slot}</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3 flex-1">
                      {Object.entries(g.stats).map(([k, v]) => (
                        <span key={k} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-300">+{v} {k.toUpperCase()}</span>
                      ))}
                    </div>
                    <GoldButton data-testid={`gem-gear-buy-${g.id}-btn`} variant="blue" disabled={profile.gems < g.gems} onClick={() => result(buyGemGear(g), g.name, "gem")} className="w-full !py-2 text-sm !bg-gradient-to-br !from-fuchsia-600 !to-purple-900 !border-fuchsia-400/50">
                      <Gem size={14} /> {g.gems}
                    </GoldButton>
                  </Panel>
                );
              })}
            </div>
          </section>

          <section>
            <h2 className="font-cinzel text-fuchsia-200 font-bold text-base md:text-lg mb-3 flex items-center gap-2"><Feather size={16} /> Relics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {GEM_CONSUMABLES.map((c) => (
                <Panel key={c.id} className="p-4 flex flex-col vl-fade-up border-orange-500/30" data-testid={`gem-relic-${c.id}`}>
                  <div className="flex items-start gap-3 mb-2">
                    <div className="h-11 w-11 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${c.accent}22` }}>
                      <Feather size={22} style={{ color: c.accent }} />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-100 text-sm leading-tight">{c.name}</div>
                      <div className="text-[11px] text-slate-400">Owned: {profile.consumables[c.id] || 0}</div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mb-3 flex-1">{c.desc}</p>
                  <GoldButton data-testid={`gem-relic-buy-${c.id}-btn`} variant="blue" disabled={profile.gems < c.gems} onClick={() => result(buyGemConsumable(c), c.name, "gem")} className="w-full !py-2 text-sm !bg-gradient-to-br !from-fuchsia-600 !to-purple-900 !border-fuchsia-400/50">
                    <Gem size={14} /> {c.gems}
                  </GoldButton>
                </Panel>
              ))}
            </div>
          </section>

          <Panel className="p-4 flex items-center gap-3 vl-fade-up border-fuchsia-500/25">
            <Gem className="text-fuchsia-300" size={20} />
            <p className="text-xs text-slate-400">Gems are rare. Earn them by slaying bosses, clearing a level with 3 stars for the first time, and claiming milestone quests.</p>
          </Panel>
        </div>
      )}
    </div>
  );
}

function TabBtn({ active, onClick, testid, icon: Icon, color, children }) {
  return (
    <button
      data-testid={testid}
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 ${active ? "bg-slate-800/90 text-slate-100" : "bg-slate-900/50 text-slate-400 border-transparent hover:text-slate-200"}`}
      style={active ? { borderColor: `${color}88`, boxShadow: `0 0 18px ${color}33` } : {}}
    >
      <Icon size={15} style={{ color }} /> {children}
    </button>
  );
}
