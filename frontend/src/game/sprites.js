// Sprite-sheet manifest. Use dedicated attack sheets when available; keep static fallbacks for the rest.
// Every sheet is a single row of frames with the same frame dimensions.
const base = "/sprites";

export const HERO_SPRITES = Object.fromEntries(
  ["aiden","luna","ronan","mira","kael","bruno","sylvie","darius","elian","riven"]
    .map((id) => [id, `${base}/heroes/${id}.svg`])
);

export const HERO_ATTACK_SPRITES = { aiden: `${base}/heroes/aiden-attack.png` };

export const ENEMY_SPRITES = Object.fromEntries(
  ["goblin","wolf","ice_golem","bandit","skeleton","dark_mage"]
    .map((id) => [id, `${base}/enemies/${id}.svg`])
);

export const BOSS_SPRITES = Object.fromEntries(
  ["goblin_king","forest_guardian","frost_wyrm","crimson_warlord","swamp_witch","kraken_lord","ancient_treant","elder_dragon","shadow_lord","celestial_overlord"]
    .map((id) => [id, `${base}/bosses/${id}.svg`])
);

export function getHeroSprite(id) { return HERO_SPRITES[id] || null; }
export function getHeroAttackSprite(id) { return HERO_ATTACK_SPRITES[id] || null; }
export function getEnemySprite(id, isBoss) {
  return (isBoss ? BOSS_SPRITES[id] : ENEMY_SPRITES[id]) || null;
}
