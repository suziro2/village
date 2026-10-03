import React from "react";
import { useGame } from "@/game/GameContext";
import { QUESTS, POTION_META } from "@/game/data";
import { Panel, GoldButton, Bar } from "@/components/common";
import { ScrollText, Coins, Sparkles, Gift, Check, RefreshCw } from "lucide-react";
import { toast, Toaster } from "sonner";

export default function QuestScreen() {
  const { profile, claimQuest } = useGame();

  const questInfo = (q) => {
    const qs = profile.questState[q.id] || { baseline: 0, claimed: 0, done: false };
    const val = q.statKey === "level" ? profile.level : profile.stats[q.statKey] || 0;
    const progress = Math.max(0, val - qs.baseline);
    const complete = progress >= q.target;
    return { qs, progress: Math.min(progress, q.target), complete, done: qs.done };
  };

  const handleClaim = (q) => {
    claimQuest(q.id);
    toast.success(`Reward claimed: ${q.title}`);
  };

  const rewardText = (r) => {
    const parts = [];
    if (r.xp) parts.push(`${r.xp} XP`);
    if (r.coins) parts.push(`${r.coins} coins`);
    if (r.consumables) for (const k in r.consumables) parts.push(`${r.consumables[k]}x ${POTION_META[k].name}`);
    if (r.drop) parts.push("Gear Crate");
    return parts.join(" · ");
  };

  return (
    <div className="flex-1 max-w-5xl mx-auto w-full px-3 sm:px-6 py-6">
      <Toaster position="top-center" theme="dark" />
      <h1 className="vl-heading text-3xl sm:text-4xl mb-1 flex items-center gap-3"><ScrollText className="text-amber-300" size={30} /> Quest Board</h1>
      <p className="text-slate-400 text-sm mb-5">Complete objectives and claim your rewards. Repeatable bounties refresh each time you claim them.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {QUESTS.map((q, i) => {
          const { progress, complete, done } = questInfo(q);
          return (
            <Panel key={q.id} data-testid={`quest-${q.id}`} className={`p-4 vl-fade-up ${complete && !done ? "border-amber-400/60 vl-pulse" : ""}`} style={{ animationDelay: `${i * 50}ms` }}>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-cinzel text-amber-200 font-bold">{q.title}</h3>
                    {q.repeatable ? (
                      <span className="flex items-center gap-0.5 text-[9px] text-sky-300 bg-sky-500/15 px-1.5 py-0.5 rounded-full"><RefreshCw size={9} /> Repeatable</span>
                    ) : (
                      <span className="text-[9px] text-fuchsia-300 bg-fuchsia-500/15 px-1.5 py-0.5 rounded-full">Milestone</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">{q.desc}</p>
                </div>
              </div>

              <Bar value={progress} max={q.target} color={complete ? "#f59e0b" : "#64748b"} showText label={`${progress}/${q.target}`} className="!h-4 mb-2" />

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <Gift size={13} className="text-amber-400" /> {rewardText(q.reward)}
                </div>
                {done ? (
                  <span className="flex items-center gap-1 text-[11px] text-emerald-400"><Check size={13} /> Done</span>
                ) : (
                  <GoldButton
                    data-testid={`quest-claim-${q.id}-btn`}
                    disabled={!complete}
                    onClick={() => handleClaim(q)}
                    className="!py-1.5 !px-3 text-xs shrink-0"
                  >
                    {complete ? "Claim" : "Locked"}
                  </GoldButton>
                )}
              </div>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}
