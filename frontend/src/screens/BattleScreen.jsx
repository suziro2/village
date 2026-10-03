import React, { useState, useRef, useEffect } from "react";
import { useGame } from "@/game/GameContext";
import { getHero, buildEnemy, getComputedStats, makeDrop, BG_IMG, POTION_META } from "@/game/data";
import { rollDamage, escapeChance, potionEffect, elementMult, ELEMENTS, STATUS, EMPTY_STATUS, statusAtkPenalty, tickStatus, rollInflict } from "@/game/combat";
import { playSfx } from "@/game/audio";
import { Bar } from "@/components/common";
import { Swords, Sparkles, FlaskConical, Shield, DoorOpen, X, Heart, Droplet, Flame, Skull, Zap, TrendingDown, Eye } from "lucide-react";

const STATUS_ICON = { poison: Skull, burn: Flame, stun: Zap, weaken: TrendingDown };

export default function BattleScreen() {
  const { profile, currentBattle, applyVictory, applyDefeat, applyEscape } = useGame();
  const hero = getHero(profile.heroId);
  const comp = getComputedStats(profile);
  const { chapter, level } = currentBattle;

  const [enemy] = useState(() => buildEnemy(chapter, level));
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
  const [pStatus, setPStatusState] = useState({ ...EMPTY_STATUS });
  const [eStatus, setEStatusState] = useState({ ...EMPTY_STATUS });
  const [raged, setRagedState] = useState(false);
  const [banner, setBanner] = useState(null);
  const [moveIdx, setMoveIdx] = useState(0);

  const consRef = useRef({ ...profile.consumables });
  const floatId = useRef(0);
  const phpRef = useRef(php); phpRef.current = php;
  const pmpRef = useRef(pmp); pmpRef.current = pmp;
  const ehpRef = useRef(ehp); ehpRef.current = ehp;
  const defendRef = useRef(false);
  const pStatusRef = useRef(pStatus);
  const eStatusRef = useRef(eStatus);
  const ragedRef = useRef(false);
  const moveIdxRef = useRef(0);
  const enemyAtkMult = useRef(1);
  const enemyGuard = useRef(false);
  const revived = useRef(false);
  const endedRef = useRef(false);

  const setDefend = (v) => { defendRef.current = v; setDefending(v); };
  const setPStatus = (v) => { pStatusRef.current = v; setPStatusState(v); };
  const setEStatus = (v) => { eStatusRef.current = v; setEStatusState(v); };

  const timers = useRef([]);
  const after = (ms, fn) => { const t = setTimeout(fn, ms); timers.current.push(t); return t; };
  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  useEffect(() => () => clearTimers(), []);

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

  const heroElem = elementMult(hero.element, enemy.element);
  const enemyElem = elementMult(enemy.element, hero.element);
  const currentMoves = raged && enemy.rage ? enemy.rage.moves : enemy.moves;
  const nextMove = enemy.isBoss ? currentMoves[moveIdx % currentMoves.length] : null;

  const inflictOn = (target, inflict) => {
    const isBossTarget = target === "enemy" && enemy.isBoss;
    if (!rollInflict(inflict, isBossTarget, ragedRef.current)) return;
    const cur = target === "enemy" ? eStatusRef.current : pStatusRef.current;
    const next = { ...cur, [inflict.type]: Math.max(cur[inflict.type], inflict.turns) };
    if (target === "enemy") setEStatus(next); else setPStatus(next);
    addFloat(target, STATUS[inflict.type].label.toUpperCase(), STATUS[inflict.type].color);
    playSfx(inflict.type);
    pushLog(`${target === "enemy" ? enemy.name : hero.name} is ${STATUS[inflict.type].label.toLowerCase()}!`);
  };

  // -------- player actions --------
  const playerMove = (kind) => {
    if (busy || ended) return;
    setShowPotions(false);

    if (kind === "attack" || kind === "skill") {
      const isSkill = kind === "skill";
      const move = isSkill ? hero.skill : hero.basic;
      if (isSkill && pmp < hero.skill.mp) { pushLog("Not enough MP!"); playSfx("error"); return; }
      setBusy(true);
      if (isSkill) setPmp((m) => m - hero.skill.mp);
      setHeroAnim(isSkill ? "vl-skill" : "vl-attack-right");
      playSfx(isSkill ? "skill" : "attack");

      after(260, () => {
        const penalty = 1 - statusAtkPenalty(pStatusRef.current);
        const atkStat = Math.round((move.type === "magic" ? comp.mag : comp.atk * (1 + buffs.atk)) * penalty);
        const critChance = comp.crit + buffs.crit + (move.special === "critup" ? 25 : 0);
        const rage = move.special === "rage" && php / comp.maxHp < 0.4;
        const hits = move.special === "double" ? 2 : 1;
        let total = 0, anyCrit = false;
        for (let i = 0; i < hits; i++) {
          const res = rollDamage({ atkStat, mult: move.mult, defStat: enemy.def, isMagic: move.type === "magic", critChance, rage, elem: heroElem });
          total += res.damage; anyCrit = anyCrit || res.crit;
        }
        if (enemyGuard.current) { total = Math.round(total * 0.5); enemyGuard.current = false; pushLog(`${enemy.name}'s guard absorbs the blow!`); }
        if (move.special === "heal") {
          const healAmt = Math.round(comp.maxHp * (hero.skill.heal || 0.3));
          setPhp((h) => Math.min(comp.maxHp, h + healAmt));
          addFloat("player", `+${healAmt}`, "#10b981");
          playSfx("heal");
        }
        if (move.special === "shield") setDefend(true);

        setEnemyAnim("vl-hit");
        playSfx(anyCrit ? "crit" : "hit");
        if (anyCrit || isSkill) triggerShake();
        if (heroElem > 1) addFloat("enemy", "WEAK!", "#4ade80");
        if (heroElem < 1) addFloat("enemy", "RESIST", "#94a3b8");
        addFloat("enemy", `${total}${anyCrit ? "!" : ""}`, anyCrit ? "#fca5a5" : "#fde68a", anyCrit);
        pushLog(`${hero.name} used ${move.name}${anyCrit ? " — Critical!" : ""}${heroElem > 1 ? " — Super effective!" : ""} for ${total} damage.`);
        const newEhp = Math.max(0, ehpRef.current - total);
        setEhp(newEhp); ehpRef.current = newEhp;
        if (isSkill && move.inflict && newEhp > 0) inflictOn("enemy", move.inflict);
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
      playSfx("defend");
      pushLog(`${hero.name} raises their guard.`);
      setHeroAnim("vl-skill");
      after(400, () => { setHeroAnim("vl-idle"); enemyTurn(); });
      return;
    }

    if (kind === "escape") {
      if (enemy.isBoss) { pushLog("You cannot flee from a boss!"); playSfx("error"); return; }
      setBusy(true);
      const chance = escapeChance(comp.spd, enemy.spd);
      if (Math.random() * 100 < chance) {
        pushLog("Escaped safely!");
        playSfx("escape");
        after(600, () => { persistConsumables(); applyEscape(phpRef.current, pmpRef.current, potionsUsed); });
      } else {
        pushLog("Escape failed!");
        playSfx("error");
        after(500, () => enemyTurn());
      }
    }
  };

  const drinkPotion = (id) => {
    if (busy || ended) return;
    if ((consRef.current[id] || 0) <= 0) return;
    consRef.current[id] -= 1;
    setBusy(true);
    setShowPotions(false);
    setPotionsUsed((n) => n + 1);
    playSfx("potion");
    const eff = potionEffect(id, comp.maxHp, comp.maxMp);
    if (eff.hp) { setPhp((h) => Math.min(comp.maxHp, h + eff.hp)); addFloat("player", `+${eff.hp}`, "#10b981"); pushLog(`Used ${POTION_META[id].name}. Restored ${eff.hp} HP.`); }
    if (eff.mp) { setPmp((m) => Math.min(comp.maxMp, m + eff.mp)); addFloat("player", `+${eff.mp} MP`, "#38bdf8"); pushLog(`Used ${POTION_META[id].name}. Restored ${eff.mp} MP.`); }
    if (eff.buff) { setBuffs((b) => ({ ...b, ...Object.fromEntries(Object.entries(eff.buff).map(([k, v]) => [k, b[k] + v])) })); pushLog(`Used ${POTION_META[id].name}. Combat buff active!`); addFloat("player", "BUFF", "#f59e0b"); }
    if (eff.cure) { setPStatus({ ...EMPTY_STATUS }); addFloat("player", "CURED", "#a3e635"); pushLog(`Used ${POTION_META[id].name}. All ailments cured.`); }
    setHeroAnim("vl-skill");
    after(500, () => { setHeroAnim("vl-idle"); enemyTurn(); });
  };

  // -------- turn flow --------
  const startPlayerTurn = () => {
    const { ticks, next } = tickStatus(pStatusRef.current, comp.maxHp);
    let hp = phpRef.current;
    for (const t of ticks) {
      hp = Math.max(0, hp - t.dmg);
      addFloat("player", `-${t.dmg}`, STATUS[t.type].color);
      pushLog(`${hero.name} takes ${t.dmg} ${STATUS[t.type].label.toLowerCase()} damage.`);
      playSfx(t.type);
    }
    setPhp(hp); phpRef.current = hp;
    if (hp <= 0) { setPStatus(next); return lose(); }
    if (next.stun > 0) {
      next.stun -= 1;
      setPStatus(next);
      addFloat("player", "STUNNED", STATUS.stun.color);
      pushLog(`${hero.name} is stunned and cannot act!`);
      after(900, () => enemyTurn());
      return;
    }
    setPStatus(next);
    setBusy(false);
  };

  const enemyTurn = () => {
    if (endedRef.current) return;
    const { ticks, next } = tickStatus(eStatusRef.current, enemy.maxHp);
    let hp = ehpRef.current;
    for (const t of ticks) {
      hp = Math.max(0, hp - t.dmg);
      addFloat("enemy", `-${t.dmg}`, STATUS[t.type].color);
      pushLog(`${enemy.name} takes ${t.dmg} ${STATUS[t.type].label.toLowerCase()} damage.`);
      playSfx(t.type);
    }
    setEhp(hp); ehpRef.current = hp;
    if (hp <= 0) { setEStatus(next); return win(); }
    if (next.stun > 0) {
      next.stun -= 1;
      setEStatus(next);
      addFloat("enemy", "STUNNED", STATUS.stun.color);
      pushLog(`${enemy.name} is stunned and loses its turn!`);
      after(900, () => startPlayerTurn());
      return;
    }
    setEStatus(next);

    if (enemy.rage && !ragedRef.current && hp / enemy.maxHp <= enemy.rage.at) return rageTurn();

    const moves = ragedRef.current ? enemy.rage.moves : enemy.moves;
    let mv;
    if (enemy.isBoss) { mv = moves[moveIdxRef.current % moves.length]; moveIdxRef.current += 1; setMoveIdx(moveIdxRef.current); }
    else mv = moves[Math.floor(Math.random() * moves.length)];
    after(350, () => execEnemyMove(mv));
  };

  const rageTurn = () => {
    ragedRef.current = true; setRagedState(true);
    moveIdxRef.current = 0; setMoveIdx(0);
    setEStatus({ ...EMPTY_STATUS });
    setBanner(enemy.rage.name);
    setEnemyAnim("vl-skill");
    playSfx("rage");
    triggerShake();
    pushLog(`${enemy.name} enters a RAGE PHASE — ${enemy.rage.name}!`);
    after(1700, () => { setBanner(null); setEnemyAnim("vl-idle"); startPlayerTurn(); });
  };

  const execEnemyMove = (mv) => {
    const attacking = mv.mult > 0;
    setEnemyAnim(attacking ? "vl-attack-left" : "vl-skill");
    if (!attacking) playSfx(mv.heal ? "heal" : "defend");
    else playSfx("attack");
    after(300, () => {
      if (mv.heal) {
        const amt = Math.round(enemy.maxHp * mv.heal);
        const nh = Math.min(enemy.maxHp, ehpRef.current + amt);
        setEhp(nh); ehpRef.current = nh;
        addFloat("enemy", `+${amt}`, "#10b981");
      }
      if (mv.buff) { enemyAtkMult.current += mv.buff; addFloat("enemy", "ATK UP", "#f59e0b"); }
      if (mv.guard) { enemyGuard.current = true; addFloat("enemy", "GUARD", "#38bdf8"); }

      let newHp = phpRef.current;
      if (attacking) {
        const defStat = Math.round(comp.def * (1 + buffs.def));
        const penalty = 1 - statusAtkPenalty(eStatusRef.current);
        const atkStat = Math.round(enemy.atk * enemyAtkMult.current * (ragedRef.current ? enemy.rage.atkMult : 1) * penalty);
        const hits = mv.hits || 1;
        let total = 0, anyCrit = false;
        for (let i = 0; i < hits; i++) {
          const res = rollDamage({ atkStat, mult: mv.mult, defStat, isMagic: false, critChance: enemy.isBoss ? 12 : 6, elem: enemyElem });
          total += res.damage; anyCrit = anyCrit || res.crit;
        }
        if (defendRef.current) total = Math.round(total * 0.5);
        setHeroAnim("vl-hit");
        playSfx(anyCrit ? "crit" : "hit");
        if (anyCrit || enemy.isBoss) triggerShake();
        if (enemyElem > 1) addFloat("player", "WEAK!", "#f87171");
        addFloat("player", `${total}${anyCrit ? "!" : ""}`, anyCrit ? "#ef4444" : "#f87171", anyCrit);
        pushLog(`${enemy.name} uses ${mv.name}${hits > 1 ? ` (${hits} hits)` : ""} for ${total} damage${defendRef.current ? " (blocked)" : ""}.`);
        newHp = Math.max(0, phpRef.current - total);
        setPhp(newHp); phpRef.current = newHp;
        if (mv.inflict && newHp > 0) inflictOn("player", mv.inflict);
      } else {
        pushLog(`${enemy.name} uses ${mv.name}.`);
      }
      setDefend(false);
      after(450, () => {
        setEnemyAnim("vl-idle"); setHeroAnim("vl-idle");
        if (newHp <= 0) return lose();
        startPlayerTurn();
      });
    });
  };

  // -------- outcomes --------
  const win = () => {
    if (endedRef.current) return;
    endedRef.current = true; setEnded(true);
    clearTimers();
    pushLog(`${enemy.name} is defeated!`);
    const dropChance = enemy.isBoss ? 1 : 0.4;
    const dropItem = Math.random() < dropChance ? makeDrop(chapter, enemy.isBoss) : null;
    persistConsumables();
    setTimeout(() => applyVictory({ chapter, level, enemy, dropItem, playerHp: phpRef.current, playerMp: pmpRef.current, potionsUsed }), 900);
  };

  const lose = () => {
    if (endedRef.current) return;
    if (!revived.current && (consRef.current.phoenix_feather || 0) > 0) {
      revived.current = true;
      consRef.current.phoenix_feather -= 1;
      const hp = Math.round(comp.maxHp * 0.5);
      setPhp(hp); phpRef.current = hp;
      setPStatus({ ...EMPTY_STATUS });
      setHeroAnim("vl-skill");
      playSfx("revive");
      addFloat("player", "REVIVED", "#fb923c", true);
      pushLog("A Phoenix Feather burns bright — you rise again!");
      after(800, () => { setHeroAnim("vl-idle"); setBusy(false); });
      return;
    }
    endedRef.current = true; setEnded(true);
    clearTimers();
    setHeroAnim("vl-defeat");
    pushLog(`${hero.name} has fallen...`);
    persistConsumables();
    setTimeout(() => applyDefeat(), 1300);
  };

  const persistConsumables = () => {
    try {
      const raw = JSON.parse(localStorage.getItem("village_legends_save_v1"));
      if (raw) { raw.consumables = { ...consRef.current }; localStorage.setItem("village_legends_save_v1", JSON.stringify(raw)); }
    } catch (e) {}
  };
  useEffect(() => {
    profile.consumables = consRef.current;
  });

  const skillDisabled = pmp < hero.skill.mp;
  const availablePotions = Object.entries(consRef.current).filter(([id, n]) => n > 0 && id !== "phoenix_feather");
  const hasFeather = (consRef.current.phoenix_feather || 0) > 0 && !revived.current;

  return (
    <div className={`flex-1 relative overflow-hidden ${shake ? "vl-shake" : ""}`} data-testid="battle-screen">
      <div className="absolute inset-0" style={{ backgroundImage: `url(${BG_IMG[chapter]})`, backgroundSize: "cover", backgroundPosition: "center" }} />
      <div className={`absolute inset-0 bg-gradient-to-b from-[#090d16]/70 via-transparent to-[#090d16]/85 ${raged ? "vl-rage-tint" : ""}`} />

      {banner && (
        <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none" data-testid="rage-banner">
          <div className="vl-rage-banner text-center px-8 py-5">
            <div className="text-xs uppercase tracking-[0.4em] text-rose-200">Rage Phase</div>
            <div className="font-cinzel text-3xl sm:text-5xl font-black text-rose-400 drop-shadow-[0_0_30px_rgba(239,68,68,0.8)]">{banner}</div>
          </div>
        </div>
      )}

      {/* top HUD */}
      <div className="relative z-20 px-3 sm:px-6 pt-4">
        <div className="max-w-5xl mx-auto flex items-start justify-between gap-3">
          <div className="w-44 sm:w-64">
            <div className="flex items-center gap-2 mb-1">
              <img src={hero.img} alt={hero.name} className="h-9 w-9 rounded-full object-cover object-top border border-amber-400/60" />
              <div>
                <div className="text-xs font-cinzel text-amber-200 font-bold leading-none flex items-center gap-1.5">{hero.name} <ElemBadge el={hero.element} /></div>
                <div className="text-[10px] text-slate-400">Lv {profile.level} {defending && <span className="text-sky-300">· Guarding</span>} {hasFeather && <span className="text-orange-300">· Feather</span>}</div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-rose-300"><Heart size={10} /> {Math.round(php)}/{comp.maxHp}</div>
            <Bar value={php} max={comp.maxHp} color="#ef4444" className="mb-1" />
            <div className="flex items-center gap-1 text-[10px] text-sky-300"><Droplet size={10} /> {pmp}/{comp.maxMp}</div>
            <Bar value={pmp} max={comp.maxMp} color="#38bdf8" />
            <StatusRow st={pStatus} testid="player-status" />
          </div>

          <div className="text-center">
            <div className="text-[11px] uppercase tracking-widest text-amber-400/80">Chapter {chapter}</div>
            <div className="font-cinzel text-sm text-slate-200">Battle {level}/5</div>
            {enemy.isBoss && <div className={`text-[11px] font-bold animate-pulse ${raged ? "text-rose-500" : "text-rose-400"}`}>{raged ? "☠ ENRAGED ☠" : "⚔ BOSS ⚔"}</div>}
            {heroElem !== 1 && (
              <div className={`text-[10px] mt-0.5 ${heroElem > 1 ? "text-emerald-300" : "text-slate-400"}`} data-testid="element-hint">
                {heroElem > 1 ? "Foe is weak to your element" : "Foe resists your element"}
              </div>
            )}
          </div>

          <div className="w-44 sm:w-64">
            <div className="flex items-center justify-end gap-2 mb-1">
              <div className="text-right">
                <div className={`text-xs font-cinzel font-bold leading-none flex items-center justify-end gap-1.5 ${enemy.isBoss ? "text-rose-300" : "text-slate-200"}`} data-testid="enemy-name"><ElemBadge el={enemy.element} /> {enemy.name}</div>
                <div className="text-[10px] text-slate-400">{enemy.isBoss ? "Boss" : "Enemy"}</div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-1 text-[10px] text-rose-300"><Heart size={10} /> {Math.round(ehp)}/{enemy.maxHp}</div>
            <Bar value={ehp} max={enemy.maxHp} color={raged ? "#b91c1c" : enemy.isBoss ? "#dc2626" : "#f97316"} />
            {nextMove && (
              <div className="flex items-center justify-end gap-1 text-[10px] text-amber-200/90 mt-1" data-testid="boss-next-move">
                <Eye size={10} /> Next: <span className="font-semibold">{nextMove.name}</span>
              </div>
            )}
            <StatusRow st={eStatus} align="end" testid="enemy-status" />
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
        <div className={`relative w-40 sm:w-64 ${raged ? "vl-rage-glow" : ""}`}>
          <img src={enemy.img} alt={enemy.name} className={`vl-glass-sprite w-full object-contain ${enemyAnim}`} style={{ maxHeight: "48vh", transform: "scaleX(-1)" }} />
          {floats.filter((f) => f.target === "enemy").map((f) => (
            <span key={f.id} className="vl-damage" style={{ color: f.color, fontSize: f.big ? "2.6rem" : "1.7rem", left: `${f.left}%` }}>{f.text}</span>
          ))}
        </div>
      </div>

      {/* log */}
      <div className="relative z-20 px-3 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center text-xs sm:text-sm text-amber-100/90 bg-black/40 rounded-lg px-3 py-1.5 backdrop-blur-sm border border-amber-500/15 inline-block mx-auto w-full" data-testid="battle-log">
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
            <CtrlBtn testid="battle-skill-btn" icon={Sparkles} label="Skill" sub={`${hero.skill.mp}MP`} color="#38bdf8" disabled={busy || ended || skillDisabled} onClick={() => playerMove("skill")} />
            <CtrlBtn testid="battle-potion-btn" icon={FlaskConical} label="Potion" color="#10b981" disabled={busy || ended} onClick={() => setShowPotions((s) => !s)} />
            <CtrlBtn testid="battle-defend-btn" icon={Shield} label="Defend" color="#eab308" disabled={busy || ended} onClick={() => playerMove("defend")} />
            <CtrlBtn testid="battle-escape-btn" icon={DoorOpen} label="Escape" color="#94a3b8" disabled={busy || ended || enemy.isBoss} onClick={() => playerMove("escape")} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ElemBadge({ el }) {
  const e = ELEMENTS[el];
  return <span className="text-[9px] px-1.5 py-px rounded-full border font-semibold tracking-wide" style={{ color: e.color, borderColor: `${e.color}66`, background: `${e.color}1a` }}>{e.label}</span>;
}

function StatusRow({ st, align = "start", testid }) {
  const active = Object.entries(st).filter(([, n]) => n > 0);
  if (!active.length) return null;
  return (
    <div className={`flex gap-1 mt-1 ${align === "end" ? "justify-end" : ""}`} data-testid={testid}>
      {active.map(([k, n]) => {
        const Icon = STATUS_ICON[k];
        return (
          <span key={k} className="vl-status-pill flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-px rounded-full border" style={{ color: STATUS[k].color, borderColor: `${STATUS[k].color}77`, background: `${STATUS[k].color}22` }}>
            <Icon size={9} /> {STATUS[k].label} {n}
          </span>
        );
      })}
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
