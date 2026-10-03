import React, { useState } from "react";
import { useGame } from "@/game/GameContext";
import { Panel, GoldButton } from "@/components/common";
import { Swords, Sparkles } from "lucide-react";
import { BG_IMG } from "@/game/data";

export default function LoginScreen() {
  const { draftName, setDraftName, go } = useGame();
  const [error, setError] = useState("");

  const submit = () => {
    const name = draftName.trim();
    if (name.length < 2) {
      setError("Enter a name of at least 2 characters.");
      return;
    }
    go("heroSelect");
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 relative" style={{ backgroundImage: `url(${BG_IMG[10]})`, backgroundSize: "cover", backgroundPosition: "center" }}>
      <div className="absolute inset-0 bg-[#090d16]/80" />
      <Panel className="relative w-full max-w-md p-8 vl-fade-up">
        <div className="flex flex-col items-center text-center">
          <div className="h-16 w-16 rounded-2xl bg-amber-500/15 border border-amber-400/40 flex items-center justify-center mb-4 vl-float">
            <Swords className="text-amber-300" size={32} />
          </div>
          <h1 className="vl-heading text-4xl sm:text-5xl mb-1">Village Legends</h1>
          <p className="text-slate-400 text-sm mb-7">A browser fantasy RPG · your legend begins in a small village.</p>

          <label className="w-full text-left text-xs uppercase tracking-[0.2em] text-amber-400/80 mb-2 font-semibold">Hero Name</label>
          <input
            data-testid="login-username-input"
            value={draftName}
            onChange={(e) => { setDraftName(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Enter your username..."
            maxLength={16}
            className="w-full bg-slate-950/70 border border-amber-500/30 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 outline-none focus:border-amber-400/80 focus:ring-2 focus:ring-amber-500/20 transition mb-2"
          />
          {error && <p data-testid="login-error" className="text-rose-400 text-xs mb-2 w-full text-left">{error}</p>}

          <GoldButton data-testid="start-adventure-button" onClick={submit} className="w-full mt-4 text-lg py-3.5">
            <Sparkles size={18} /> Begin Adventure
          </GoldButton>
          <p className="text-[11px] text-slate-500 mt-4">Progress saves automatically in your browser. No account needed.</p>
        </div>
      </Panel>
    </div>
  );
}
