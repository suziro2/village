import React from "react";
import { useGame } from "@/game/GameContext";
import { SHOP_ITEMS } from "@/game/data";
import { Panel, GoldButton } from "@/components/common";
import { Coins, FlaskConical, ShoppingBag } from "lucide-react";
import { toast, Toaster } from "sonner";

export default function ShopScreen() {
  const { profile, buyItem } = useGame();

  const handleBuy = (item) => {
    const ok = buyItem(item);
    if (ok) toast.success(`Bought ${item.name}`);
    else toast.error("Not enough coins!");
  };

  return (
    <div className="flex-1 max-w-5xl mx-auto w-full px-3 sm:px-6 py-6">
      <Toaster position="top-center" theme="dark" />
      <div className="flex items-end justify-between mb-5 flex-wrap gap-2">
        <div>
          <h1 className="vl-heading text-3xl sm:text-4xl">Merchant's Shop</h1>
          <p className="text-slate-400 text-sm">"Finest potions this side of the kingdom, traveler."</p>
        </div>
        <div className="flex items-center gap-1.5 text-amber-300 font-bold text-lg"><Coins size={20} /> {profile.coins}</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {SHOP_ITEMS.map((item, i) => {
          const owned = profile.consumables[item.id] || 0;
          const afford = profile.coins >= item.price;
          return (
            <Panel key={item.id} className="p-4 flex flex-col vl-fade-up" style={{ animationDelay: `${i * 50}ms` }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="h-11 w-11 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${item.accent}22` }}>
                  <FlaskConical size={22} style={{ color: item.accent }} />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-slate-100 text-sm leading-tight">{item.name}</div>
                  <div className="text-[11px] text-slate-400">Owned: {owned}</div>
                </div>
              </div>
              <p className="text-xs text-slate-400 mb-3 flex-1">{item.desc}</p>
              <GoldButton
                data-testid={`shop-buy-${item.id}-btn`}
                disabled={!afford}
                onClick={() => handleBuy(item)}
                className="w-full !py-2 text-sm"
              >
                <Coins size={15} /> {item.price}
              </GoldButton>
            </Panel>
          );
        })}
      </div>

      <Panel className="p-4 mt-5 flex items-center gap-3 vl-fade-up">
        <ShoppingBag className="text-amber-300" size={20} />
        <p className="text-xs text-slate-400">Earn coins by winning battles, defeating bosses and claiming quests. Spend wisely — the road ahead grows dangerous.</p>
      </Panel>
    </div>
  );
}
