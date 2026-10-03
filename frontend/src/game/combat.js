// Combat math for Village Legends

export function rollDamage({ atkStat, mult, defStat, isMagic, critChance, rage = false }) {
  const reduction = isMagic ? 0.2 : 0.35;
  let base = atkStat * mult - defStat * reduction;
  base = Math.max(base, 5);
  base = base * (0.9 + Math.random() * 0.2);
  if (rage) base *= 1.5;
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
    default: return {};
  }
}
