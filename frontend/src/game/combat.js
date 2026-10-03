// Combat math for Village Legends

export const ELEMENTS = {
  neutral: { label: "Neutral", color: "#94a3b8", beats: null },
  fire: { label: "Fire", color: "#f97316", beats: "nature" },
  nature: { label: "Nature", color: "#22c55e", beats: "water" },
  water: { label: "Water", color: "#38bdf8", beats: "fire" },
  holy: { label: "Holy", color: "#fcd34d", beats: "shadow" },
  shadow: { label: "Shadow", color: "#a855f7", beats: "holy" },
};

export function elementMult(attacker, defender) {
  if (ELEMENTS[attacker]?.beats === defender) return 1.4;
  if (ELEMENTS[defender]?.beats === attacker) return 0.7;
  return 1;
}

export const STATUS = {
  poison: { label: "Poison", color: "#22c55e", dot: 0.06 },
  burn: { label: "Burn", color: "#f97316", dot: 0.08, atkDown: 0.15 },
  stun: { label: "Stunned", color: "#fcd34d" },
  weaken: { label: "Weakened", color: "#a855f7", atkDown: 0.3 },
};

export const EMPTY_STATUS = { poison: 0, burn: 0, stun: 0, weaken: 0 };

export function statusAtkPenalty(st) {
  let p = 0;
  for (const k in st) if (st[k] > 0 && STATUS[k].atkDown) p += STATUS[k].atkDown;
  return Math.min(0.5, p);
}

// returns [{type, dmg}] of damage-over-time ticks and the decremented status map
export function tickStatus(st, maxHp) {
  const ticks = [];
  const next = { ...st };
  for (const k in next) {
    if (next[k] <= 0 || k === "stun") continue;
    if (STATUS[k].dot) ticks.push({ type: k, dmg: Math.max(1, Math.round(maxHp * STATUS[k].dot)) });
    next[k] -= 1;
  }
  return { ticks, next };
}

export function rollInflict(inflict, isBossTarget, raged) {
  if (!inflict) return false;
  let chance = inflict.chance;
  if (isBossTarget && inflict.type === "stun") chance = raged ? 0 : chance * 0.5;
  return Math.random() < chance;
}

export function rollDamage({ atkStat, mult, defStat, isMagic, critChance, rage = false, elem = 1 }) {
  const reduction = isMagic ? 0.2 : 0.35;
  let base = atkStat * mult - defStat * reduction;
  base = Math.max(base, 5);
  base = base * (0.9 + Math.random() * 0.2);
  if (rage) base *= 1.5;
  base *= elem;
  const crit = Math.random() * 100 < critChance;
  if (crit) base *= 1.5;
  return { damage: Math.max(1, Math.round(base)), crit };
}

export function escapeChance(playerSpd, enemySpd) {
  const c = 50 + (playerSpd - enemySpd) * 4;
  return Math.max(15, Math.min(90, c));
}

export function potionEffect(id, maxHp, maxMp) {
  switch (id) {
    case "hp_potion": return { hp: Math.round(maxHp * 0.4) };
    case "greater_hp": return { hp: Math.round(maxHp * 0.7) };
    case "mp_potion": return { mp: Math.round(maxMp * 0.35) };
    case "greater_mp": return { mp: Math.round(maxMp * 0.65) };
    case "atk_potion": return { buff: { atk: 0.3 } };
    case "def_potion": return { buff: { def: 0.4 } };
    case "crit_potion": return { buff: { crit: 20 } };
    case "antidote": return { cure: true };
    default: return {};
  }
}
