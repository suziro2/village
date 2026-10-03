import React, { useState, useRef, useEffect } from "react";
import { useGame } from "@/game/GameContext";
import { getHero, buildEnemy, getComputedStats, makeDrop, BG_IMG, CHAPTERS, POTION_META } from "@/game/data";
import { rollDamage, escapeChance, potionEffect } from "@/game/combat";
import { Bar } from "@/components/common";
import { Swords, Sparkles, FlaskConical, Shield, DoorOpen, X, Heart, Droplet } from "lucide-react";

export default function BattleScreen() {
  const { profile, currentBattle, applyVictory, applyDefeat, applyEscape } = useGame();
  const hero = getHero(profile.heroId);
  const comp = getComputedStats(profile);
  const { chapter, level } = currentBattle;
  const chCfg = CHAPTERS[chapter - 1];

  const [enemy, setEnemy] = useState(() => buildEnemy(chapter, level));
  const [php, setPhp] = useState(Math.min(profile.hp, comp.maxHp) || comp.maxHp);
  const [pmp, setPmp] = useState(Math.min(profile.mp, comp.maxMp));
  const [ehp, setEhp] = useState(enemy.hp);

  const [busy, setBusy] = useState(false);
  const [defending, setDefending] = useState(false);
  const [buffs, setBuffs] = useState({ atk: 0, def: 0, crit: 0 });
  const [potionsUsed, setPotionsUsed] = useState(0);
  const [log, setLog] = useState([`A wild ${enemy.name} appears!`]);
  const [floats, setFloats] = useState([]);
  const [heroAnim, setHeroAnim] = useState("vl-idle");
  const [enemyAnim, setEnemyAnim] = useState("vl-idle");
  const [shake, setShake] = useState(false);
  const [showPotions, setShowPotions] = useState(false);
  const [ended, setEnded] = useState(false);

  const consRef = useRef({ ...profile.consumables });
  const floatId = useRef(0);
  const phpRef = useRef(php);
  phpRef.current = php;
  const defendRef = useRef(false);
  const setDefend = (v) => { defendRef.current = v; setDefending(v); };

  useEffect(() => () => clearTimers(), []);
  const timers = useRef([]);
  const after = (ms, fn) => { const t = setTimeout(fn, ms); timers.current.push(t); return t; };
  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };

  const pushLog = (msg) => setLog((l) => [msg, ...l].slice(0, 5));

  const addFloat = (target, text, color, big = false) => {
    const id = ++floatId.current;
    const left = 10 + Math.random() * 30;
    setFloats((f) => [...f, { id, target, text, color, big, left }]);
    after(1100, () => setFloats((f) => f.filter((x) => x.id !== id)));
  };

  const triggerShake = () => {
    if (!profile.settings.screenShake) return;
    setShake(true);
    after(420, () => setShake(false));
  };

  // -------- player actions --------
  const playerMove = (kind) => {
    if (busy || ended) return;
    setShowPotions(false);

    if (kind === "attack" || kind === "skill") {
      const isSkill = kind === "skill";
      const move = isSkill ? hero.skill : hero.basic;
      if (isSkill && pmp < hero.skill.mp) { pushLog("Not enough MP!"); return; }
      setBusy(true);
      if (isSkill) setPmp((m) => m - hero.skill.mp);
      setHeroAnim(isSkill ? "vl-skill" : "vl-attack-right");

      after(260, () => {
        const atkStat = move.type === "magic" ? comp.mag : Math.round(comp.atk * (1 + buffs.atk));
        let critChance = comp.crit + buffs.crit + (move.special === "critup" ? 25 : 0);
        const rage = move.special === "rage" && php / comp.maxHp < 0.4;
        const hits = move.special === "double" ? 2 : 1;
        let total = 0, anyCrit = false;
        for (let i = 0; i < hits; i++) {
          const res = rollDamage({ atkStat, mult: move.mult, defStat: enemy.def, isMagic: move.type === "magic", critChance, rage });
          total += res.damage; anyCrit = anyCrit || res.crit;
        }
        // heal skill (Darius)
        if (move.special === "heal") {
          const healAmt = Math.round(comp.maxHp * (hero.skill.heal || 0.3));
          setPhp((h) => Math.min(comp.maxHp, h + healAmt));
          addFloat("player", `+${healAmt}`, "#10b981");
        }
        if (move.special === "shield") setDefend(true);

        setEnemyAnim("vl-hit");
        if (anyCrit || isSkill) triggerShake();
        addFloat("enemy", `${total}${anyCrit ? "!" : ""}`, anyCrit ? "#fca5a5" : "#fde68a", anyCrit);
        pushLog(`${hero.name} used ${move.name}${anyCrit ? " — Critical!" : ""} for ${total} damage.`);
        const newEhp = Math.max(0, ehp - total);
        setEhp(newEhp);
        after(450, () => {
          setEnemyAnim("vl-idle"); setHeroAnim("vl-idle");
          if (newEhp <= 0) return win();
          enemyTurn();
        });
      });
      return;
    }

    if (kind === "defend") {
      setBusy(true);
      setDefend(true);
      pushLog(`${hero.name} raises their guard.`);
      setHeroAnim("vl-skill");
      after(400, () => { setHeroAnim("vl-idle"); enemyTurn(); });
      return;
    }

    if (kind === "escape") {
      if (enemy.isBoss) { pushLog("You cannot flee from a boss!"); return; }
      setBusy(true);
      const chance = escapeChance(comp.spd, enemy.spd);
      if (Math.random() * 100 < chance) {
        pushLog("Escaped safely!");
        after(600, () => { commitConsumables(); applyEscape(php, pmp, potionsUsed); });
      } else {
        pushLog("Escape failed!");
        after(500, () => enemyTurn());
      }
      return;
    }
  };

  const drinkPotion = (id) => {
    if (busy || ended) return;
    if ((consRef.current[id] || 0) <= 0) return;
    consRef.current[id] -= 1;
    setBusy(true);
    setShowPotions(false);
    setPotionsUsed((n) => n + 1);
    const eff = potionEffect(id, comp.maxHp, comp.maxMp);
    if (eff.hp) { setPhp((h) => Math.min(comp.maxHp, h + eff.hp)); addFloat("player", `+${eff.hp}`, "#10b981"); pushLog(`Used ${POTION_META[id].name}. Restored ${eff.hp} HP.`); }
    if (eff.mp) { setPmp((m) => Math.min(comp.maxMp, m + eff.mp)); addFloat("player", `+${eff.mp} MP`, "#38bdf8"); pushLog(`Used ${POTION_META[id].name}. Restored ${eff.mp} MP.`); }
    if (eff.buff) { setBuffs((b) => ({ ...b, ...Object.fromEntries(Object.entries(eff.buff).map(([k, v]) => [k, b[k] + v])) })); pushLog(`Used ${POTION_META[id].name}. Combat buff active!`); addFloat("player", "BUFF", "#f59e0b"); }
    setHeroAnim("vl-skill");
    after(500, () => { setHeroAnim("vl-idle"); enemyTurn(); });
  };

  // -------- enemy turn --------
  const enemyTurn = () => {
    setEnemyAnim("vl-attack-left");
    after(300, () => {
      const defStat = Math.round(comp.def * (1 + buffs.def));
      const res = rollDamage({ atkStat: enemy.atk, mult: enemy.isBoss ? 1.15 : 1.0, defStat, isMagic: false, critChance: enemy.isBoss ? 12 : 6 });
      let dmg = res.damage;
      if (defendRef.current) dmg = Math.round(dmg * 0.5);
      setHeroAnim("vl-hit");
      if (res.crit || enemy.isBoss) triggerShake();
      addFloat("player", `${dmg}${res.crit ? "!" : ""}`, res.crit ? "#ef4444" : "#f87171", res.crit);
      pushLog(`${enemy.name} strikes for ${dmg} damage${defendRef.current ? " (blocked)" : ""}.`);
      const newHp = Math.max(0, phpRef.current - dmg);
      setPhp(newHp);
      setDefend(false);
      after(450, () => {
        setEnemyAnim("vl-idle"); setHeroAnim("vl-idle");
        if (newHp <= 0) return lose();
        setBusy(false);
      });
    });
  };

  // -------- outcomes --------
  const commitConsumables = () => {
    // persist potion usage: write remaining counts back via profile mutation done in context? We pass counts implicitly.
  };

  const win = () => {
    if (ended) return;
    setEnded(true);
    clearTimers();
    pushLog(`${enemy.name} is defeated!`);
    const dropChance = enemy.isBoss ? 1 : 0.4;
    const dropItem = Math.random() < dropChance ? makeDrop(chapter, enemy.isBoss) : null;
    // persist consumed potions
    persistConsumables();
    setTimeout(() => applyVictory({ chapter, level, enemy, dropItem, playerHp: php, playerMp: pmp, potionsUsed }), 900);
  };

  const lose = () => {
    if (ended) return;
    setEnded(true);
    clearTimers();
    setHeroAnim("vl-defeat");
    pushLog(`${hero.name} has fallen...`);
    persistConsumables();
    setTimeout(() => applyDefeat(), 1300);
  };

  // write the consumed potions back to the saved profile before leaving
  const persistConsumables = () => {
    try {
      const raw = JSON.parse(localStorage.getItem("village_legends_save_v1"));
      if (raw) { raw.consumables = { ...consRef.current }; localStorage.setItem("village_legends_save_v1", JSON.stringify(raw)); }
    } catch (e) {}
  };
  // keep context profile.consumables in sync when the result screen reads it
  useEffect(() => {
    profile.consumables = consRef.current;
  });

  const skillDisabled = pmp < hero.skill.mp;
  const availablePotions = Object.entries(consRef.current).filter(([, n]) => n > 0);

  return (
    <div className={`flex-1 relative overflow-hidden ${shake ? "vl-shake" : ""}`}>
      {/* background */}
      <div className="absolute inset-0" style={{ backgroundImage: `url(${BG_IMG[chapter]})`, backgroundSize: "cover", backgroundPosition: "center" }} />
      <div className="absolute inset-0 bg-gradient-to-b from-[#090d16]/70 via-transparent to-[#090d16]/85" />

      {/* top HUD */}
      <div className="relative z-20 px-3 sm:px-6 pt-4">
        <div className="max-w-5xl mx-auto flex items-start justify-between gap-3">
          <div className="w-44 sm:w-64">
            <div className="flex items-center gap-2 mb-1">
              <img src={hero.img} alt={hero.name} className="h-9 w-9 rounded-full object-cover object-top border border-amber-400/60" />
              <div>
                <div className="text-xs font-cinzel text-amber-200 font-bold leading-none">{hero.name}</div>
                <div className="text-[10px] text-slate-400">Lv {profile.level} {defending && <span className="text-sky-300">· Guarding</span>}</div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-rose-300"><Heart size={10} /> {Math.round(php)}/{comp.maxHp}</div>
            <Bar value={php} max={comp.maxHp} color="#ef4444" className="mb-1" />
            <div className="flex items-center gap-1 text-[10px] text-sky-300"><Droplet size={10} /> {pmp}/{comp.maxMp}</div>
            <Bar value={pmp} max={comp.maxMp} color="#38bdf8" />
          </div>

          <div className="text-center">
            <div className="text-[11px] uppercase tracking-widest text-amber-400/80">Chapter {chapter}</div>
            <div className="font-cinzel text-sm text-slate-200">Battle {level}/5</div>
            {enemy.isBoss && <div className="text-[11px] text-rose-400 font-bold animate-pulse">⚔ BOSS ⚔</div>}
          </div>

          <div className="w-44 sm:w-64">
            <div className="flex items-center justify-end gap-2 mb-1">
              <div className="text-right">
                <div className={`text-xs font-cinzel font-bold leading-none ${enemy.isBoss ? "text-rose-300" : "text-slate-200"}`}>{enemy.name}</div>
                <div className="text-[10px] text-slate-400">{enemy.isBoss ? "Boss" : "Enemy"}</div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-1 text-[10px] text-rose-300"><Heart size={10} /> {Math.round(ehp)}/{enemy.maxHp}</div>
            <Bar value={ehp} max={enemy.maxHp} color={enemy.isBoss ? "#dc2626" : "#f97316"} />
          </div>
        </div>
      </div>

      {/* battlefield */}
      <div className="relative z-10 flex-1 flex items-center justify-between px-4 sm:px-16 h-[46vh] sm:h-[52vh]">
        <div className="relative w-40 sm:w-64">
          <img src={hero.img} alt={hero.name} className={`vl-glass-sprite w-full object-contain ${heroAnim}`} style={{ maxHeight: "48vh" }} />
          {floats.filter((f) => f.target === "player").map((f) => (
            <span key={f.id} className="vl-damage" style={{ color: f.color, fontSize: f.big ? "2.4rem" : "1.6rem", left: `${f.left}%` }}>{f.text}</span>
          ))}
        </div>
        <div className="relative w-40 sm:w-64">
          <img src={enemy.img} alt={enemy.name} className={`vl-glass-sprite w-full object-contain ${enemyAnim}`} style={{ maxHeight: "48vh", transform: "scaleX(-1)" }} />
          {floats.filter((f) => f.target === "enemy").map((f) => (
            <span key={f.id} className="vl-damage" style={{ color: f.color, fontSize: f.big ? "2.6rem" : "1.7rem", left: `${f.left}%` }}>{f.text}</span>
          ))}
        </div>
      </div>

      {/* log */}
      <div className="relative z-20 px-3 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center text-xs sm:text-sm text-amber-100/90 bg-black/40 rounded-lg px-3 py-1.5 backdrop-blur-sm border border-amber-500/15 inline-block mx-auto w-full">
            {log[0]}
          </div>
        </div>
      </div>

      {/* controls */}
      <div className="relative z-20 px-3 sm:px-6 py-4">
        <div className="max-w-3xl mx-auto relative">
          {showPotions && (
            <div className="absolute bottom-full mb-2 left-0 right-0 bg-slate-900/95 border border-amber-500/30 rounded-xl p-3 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-amber-300 font-semibold">Use a potion</span>
                <button onClick={() => setShowPotions(false)} className="text-slate-400 hover:text-white"><X size={16} /></button>
              </div>
              {availablePotions.length === 0 ? (
                <p className="text-xs text-slate-500 py-2 text-center">No potions. Buy some at the shop!</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {availablePotions.map(([id, n]) => (
                    <button key={id} data-testid={`battle-use-${id}`} onClick={() => drinkPotion(id)} className="flex items-center justify-between gap-2 bg-slate-800/70 hover:bg-slate-700 border border-slate-600/50 rounded-lg px-3 py-2 text-xs">
                      <span className="truncate" style={{ color: POTION_META[id].accent }}>{POTION_META[id].name}</span>
                      <span className="text-slate-300 font-mono">x{n}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-5 gap-2">
            <CtrlBtn testid="battle-attack-btn" icon={Swords} label="Attack" color="#f59e0b" disabled={busy || ended} onClick={() => playerMove("attack")} />
            <CtrlBtn testid="battle-skill-btn" icon={Sparkles} label={`Skill`} sub={`${hero.skill.mp}MP`} color="#38bdf8" disabled={busy || ended || skillDisabled} onClick={() => playerMove("skill")} />
            <CtrlBtn testid="battle-potion-btn" icon={FlaskConical} label="Potion" color="#10b981" disabled={busy || ended} onClick={() => setShowPotions((s) => !s)} />
            <CtrlBtn testid="battle-defend-btn" icon={Shield} label="Defend" color="#eab308" disabled={busy || ended} onClick={() => playerMove("defend")} />
            <CtrlBtn testid="battle-escape-btn" icon={DoorOpen} label="Escape" color="#94a3b8" disabled={busy || ended || enemy.isBoss} onClick={() => playerMove("escape")} />
          </div>
        </div>
      </div>
    </div>
  );
}

function CtrlBtn({ icon: Icon, label, sub, color, disabled, onClick, testid }) {
  return (
    <button
      data-testid={testid}
      disabled={disabled}
      onClick={onClick}
      className="group flex flex-col items-center justify-center gap-1 py-2.5 rounded-xl border bg-slate-900/80 backdrop-blur-md transition-all duration-200 disabled:opacity-35 disabled:cursor-not-allowed enabled:hover:-translate-y-1 enabled:active:scale-95"
      style={{ borderColor: `${color}55` }}
    >
      <Icon size={20} style={{ color }} className="group-enabled:group-hover:scale-110 transition-transform" />
      <span className="text-[11px] font-semibold text-slate-200 leading-none">{label}</span>
      {sub && <span className="text-[9px] text-slate-400 leading-none">{sub}</span>}
    </button>
  );
}
