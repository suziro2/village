import React, { useState } from "react";
import { useGame } from "@/game/GameContext";
import { Panel, GoldButton } from "@/components/common";
import { Swords, Sparkles, LockKeyhole, UserRound, ArrowRight } from "lucide-react";
import { BG_IMG } from "@/game/data";

export default function LoginScreen() {
  const { draftName, setDraftName, login, register } = useGame();
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    const username = draftName.trim();
    if (!/^[A-Za-z0-9_.-]{3,32}$/.test(username)) {
      setError("Username must be 3–32 letters, numbers, dots, dashes, or underscores.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      if (mode === "login") await login(username, password);
      else await register(username, password);
    } catch (e) {
      setError(e.message || "Unable to authenticate.");
    } finally {
      setBusy(false);
    }
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
          <p className="text-slate-400 text-sm mb-7">Enter the realm. Build your legend.</p>

          <div className="w-full grid grid-cols-2 gap-1 p-1 bg-slate-950/70 rounded-xl border border-white/10 mb-5">
            <button onClick={() => { setMode("login"); setError(""); }} className={`py-2 rounded-lg text-xs font-semibold transition ${mode === "login" ? "bg-amber-500/20 text-amber-200" : "text-slate-500"}`}>Sign In</button>
            <button onClick={() => { setMode("register"); setError(""); }} className={`py-2 rounded-lg text-xs font-semibold transition ${mode === "register" ? "bg-amber-500/20 text-amber-200" : "text-slate-500"}`}>Create Account</button>
          </div>

          <label className="w-full text-left text-xs uppercase tracking-[0.2em] text-amber-400/80 mb-2 font-semibold"><UserRound size={12} className="inline mr-1" /> Username</label>
          <input
            data-testid="login-username-input"
            value={draftName}
            onChange={(e) => { setDraftName(e.target.value); setError(""); }}
            autoComplete="username"
            maxLength={32}
            placeholder="Enter username..."
            className="w-full bg-slate-950/70 border border-amber-500/30 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 outline-none focus:border-amber-400/80 focus:ring-2 focus:ring-amber-500/20 transition mb-3"
          />

          <label className="w-full text-left text-xs uppercase tracking-[0.2em] text-amber-400/80 mb-2 font-semibold"><LockKeyhole size={12} className="inline mr-1" /> Password</label>
          <input
            data-testid="login-password-input"
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            maxLength={128}
            placeholder="Enter password..."
            className="w-full bg-slate-950/70 border border-amber-500/30 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 outline-none focus:border-amber-400/80 focus:ring-2 focus:ring-amber-500/20 transition"
          />

          {error && <p data-testid="login-error" className="text-rose-400 text-xs mt-3 w-full text-left">{error}</p>}

          <GoldButton data-testid="start-adventure-button" disabled={busy} onClick={submit} className="w-full mt-5 text-lg py-3.5">
            {busy ? "Entering..." : mode === "login" ? <><ArrowRight size={18} /> Enter Village</> : <><Sparkles size={18} /> Create Legend</>}
          </GoldButton>

          <p className="text-[11px] text-slate-500 mt-4">Your password is verified by the game server. Game progress remains tied to your account on this browser.</p>
        </div>
      </Panel>
    </div>
  );
}
