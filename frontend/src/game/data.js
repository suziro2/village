// Village Legends — static game data

const IMG = "https://static.prod-images.emergentagent.com/jobs/221426be-a75e-45d1-ae5f-35654c3463c8/images/";

export const HERO_IMG = {
  aiden: IMG + "4487d03b1f8851dbe32660cf21a756612201382f18d2837662cd82801e33f43f.jpeg",
  luna: IMG + "bdabf58b25f2d9359e0acb23ffc0e0fe0b9326853b81f0f6ec45c449e3e5d0b5.jpeg",
  ronan: IMG + "d82327914fd4e0beb9e0bf03cbbfa4ad01a1ca4b19fd393d25175af35ed36e8b.jpeg",
  mira: IMG + "b45557e303b0099fb43107565a503de8524b344de0e8bf3c5ed2b16eab01951c.jpeg",
  kael: IMG + "e79c1d3997d7a8f1bed118ca81ce2b54fd8fc2827ce637a5ea4cb0161ecb57a3.jpeg",
  bruno: IMG + "6646c9205b59adb79683b503814dd6270a879e9bfd3961d9c3d8916099de1f9d.jpeg",
  sylvie: IMG + "03da4d00a6ea66dbda41dd83ce8c18fd834f03633291dc2b2a97d7c070678529.jpeg",
  darius: IMG + "58f32e0bb2a39a810ed6f27e00c1778eecb248f6663afd4f5484d0357b7314eb.jpeg",
  elian: IMG + "a5a0dbb0f8dd18215010ceb65241fcc489aa029d86d398d7c614d3ec1fc022fb.jpeg",
  riven: IMG + "d18837078e5240463e640e9f4d7ccbc5448c30dc3cdcb6a7b2145abe71be1a7c.jpeg",
};

export const BOSS_IMG = {
  goblin_king: IMG + "179d4cc17bd0483eeac7aa28398048cbdf2d38a8e085c7feaf5427efb551390c.jpeg",
  forest_guardian: IMG + "b29b2d2af7e2af37fbd6506f0c4fd8ea4724091db63eb338a5011f0e210e4a5a.jpeg",
  frost_wyrm: IMG + "de680bd69e4174581964f2bcdb54d120f3aca751a203c3096ff4d5b90bce4555.jpeg",
  crimson_warlord: IMG + "b42626cca25bb02660922f44bd5e548b81509a6114226f305aabac18a260f396.jpeg",
  swamp_witch: IMG + "9b31e4623a56633da3b9da4cb6b2ac2eb631d9e6939a0631c40b8ae58f30d6ae.jpeg",
  kraken_lord: IMG + "055fa9f8bcc97b844d5c54187ae252dcf1e26cd1ad5faa679f2f20c3b0f320a2.jpeg",
  ancient_treant: IMG + "93afb508e86fa4e200eec05fd60a34e8cbeb3f6655c83300b5fa6d6640927398.jpeg",
  elder_dragon: IMG + "e3b6cfb8cbfb572f660ea43365897a8c344d1cbd657e4dfdd697060e7aea9597.jpeg",
  shadow_lord: IMG + "627cceea8ed8c0f0c29694ff6f69944dc57f6aa7e1fbc0bf93c9a568c9a41c00.jpeg",
  celestial_overlord: IMG + "95f32ea0de7f474b31199e97065c397e90905d67189e039c05e0b5f466d84188.jpeg",
};

export const ENEMY_IMG = {
  goblin: IMG + "bbbfbc4fae94bae0a6a07c8b1be94ad1efba83035b1981983a95481b65100676.jpeg",
  wolf: IMG + "a4610958b2f8b3697dd9c0c6daaa80cfd30de1f1741e689c3132f45f636f92a7.jpeg",
  ice_golem: IMG + "38932c2f94beaaa504fae2043165bf9145012d157e2ca5fd5660a84915f6020f.jpeg",
  bandit: IMG + "fd56d042668ad372d67beebc8de1c871b2cc2d090272c4ef81ef22b231b69dbb.jpeg",
  skeleton: IMG + "f0742be20a3dc121e6c579a501f1ffd8b11495742800fa2a7a21cb80571bf87d.jpeg",
  dark_mage: IMG + "76ebb601f666ea8f920574f8bcb7a8f793cab4777c49b7aabe41ba30bee9f78c.jpeg",
};

export const BG_IMG = {
  1: IMG + "5b44466dfb5507c9c13a7e845e8debe2a50c573f1ec2623ef2e0fc0cd73e065f.jpeg",
  2: IMG + "2fdb3917d7e078e89095e3f0f2ec1c8c727f16152f3081b9224a134de5e0719f.jpeg",
  3: IMG + "12ba868825d333387c6d9cd3fb95c42b7b853aacecb0dcb3f198712dc9b33c5b.jpeg",
  4: IMG + "1b79dcc49704bb9b09b0a10c1067068fab280ead8a226b9599da93ca74da7ec0.jpeg",
  5: IMG + "3c53d7b4bc9ca4d76ac6acbdbe1fd5623474d00bef936ea10d4c5bb2b14809e1.jpeg",
  6: IMG + "30ea694e6023b5bebdbd334089f973e62959c5dd373e8630cf62595f62d18a7f.jpeg",
  7: IMG + "3329dbf6242cee52b40b5f6912f57b201a678e7e2346a5cd5edaa3cbadbbb301.jpeg",
  8: IMG + "fd67cd16e96ccc6e657ca719403ce68c04f82bcd47a623fb43aee93c72504e35.jpeg",
  9: IMG + "835645347b08f3a4e371446cfe3c91b1eb3626aa2fe37f19a021feb0a85e973c.jpeg",
  10: IMG + "33e19c48c0441303be3959d979090c842a1f9509f7c65f63853706d7ebf0fb6c.jpeg",
};

export const HEROES = [
  {
    id: "aiden", name: "Aiden", class: "Swordsman", color: "#60a5fa", img: HERO_IMG.aiden,
    base: { hp: 100, mp: 30, atk: 15, def: 10, mag: 5, spd: 10, crit: 5 },
    growth: { hp: 16, mp: 6, atk: 4, def: 2, mag: 1, spd: 2, crit: 0.3 },
    basic: { name: "Sword Slash", type: "physical", mult: 1.0 },
    skill: { name: "Spinning Slash", type: "physical", mult: 1.8, mp: 15, special: null, desc: "A whirling area strike, devastating against groups." },
    passive: { name: "Balanced Warrior", desc: "Well-rounded stats with no glaring weaknesses." },
    quote: "A new journey always begins, in a small village.",
  },
  {
    id: "luna", name: "Luna", class: "Mage", color: "#a855f7", img: HERO_IMG.luna,
    base: { hp: 70, mp: 80, atk: 5, def: 5, mag: 18, spd: 12, crit: 10 },
    growth: { hp: 10, mp: 14, atk: 1, def: 1, mag: 5, spd: 2, crit: 0.4 },
    basic: { name: "Arcane Bolt", type: "magic", mult: 1.0 },
    skill: { name: "Arcane Burst", type: "magic", mult: 2.0, mp: 25, special: null, desc: "High arcane damage that erupts across the field." },
    passive: { name: "Arcane Knowledge", desc: "Mastery of magic greatly amplifies spell power." },
    quote: "Knowledge lights the darkest paths.",
  },
  {
    id: "ronan", name: "Ronan", class: "Knight", color: "#eab308", img: HERO_IMG.ronan,
    base: { hp: 120, mp: 40, atk: 10, def: 18, mag: 5, spd: 8, crit: 2 },
    growth: { hp: 20, mp: 7, atk: 3, def: 3, mag: 1, spd: 1, crit: 0.2 },
    basic: { name: "Shield Strike", type: "physical", mult: 1.0 },
    skill: { name: "Shield Bash", type: "physical", mult: 1.5, mp: 20, special: "shield", desc: "Bashes the foe and raises guard, halving the next hit." },
    passive: { name: "Guardian", desc: "Immense endurance; absorbs heavy punishment." },
    quote: "I stand so others may live.",
  },
  {
    id: "mira", name: "Mira", class: "Archer", color: "#34d399", img: HERO_IMG.mira,
    base: { hp: 85, mp: 35, atk: 13, def: 7, mag: 6, spd: 15, crit: 15 },
    growth: { hp: 13, mp: 6, atk: 3.5, def: 1.5, mag: 1, spd: 3, crit: 0.6 },
    basic: { name: "Arrow Shot", type: "physical", mult: 1.0 },
    skill: { name: "Wind Arrow", type: "physical", mult: 1.7, mp: 18, special: "critup", desc: "A piercing shot with a greatly boosted critical chance." },
    passive: { name: "Eagle Eye", desc: "Keen sight raises accuracy and critical rate." },
    quote: "The farther I see, the more I protect.",
  },
  {
    id: "kael", name: "Kael", class: "Assassin", color: "#c084fc", img: HERO_IMG.kael,
    base: { hp: 80, mp: 50, atk: 14, def: 6, mag: 6, spd: 18, crit: 20 },
    growth: { hp: 12, mp: 8, atk: 4, def: 1.2, mag: 1, spd: 3.5, crit: 0.8 },
    basic: { name: "Dual Slash", type: "physical", mult: 1.0 },
    skill: { name: "Shadow Strike", type: "physical", mult: 2.2, mp: 22, special: "critup", desc: "A lethal strike from the shadows with huge crit chance." },
    passive: { name: "Shadow Step", desc: "Unmatched speed and deadly critical strikes." },
    quote: "Silence is my weapon. Speed is my answer.",
  },
  {
    id: "bruno", name: "Bruno", class: "Berserker", color: "#ef4444", img: HERO_IMG.bruno,
    base: { hp: 130, mp: 25, atk: 17, def: 8, mag: 4, spd: 10, crit: 8 },
    growth: { hp: 20, mp: 5, atk: 5, def: 2, mag: 1, spd: 2, crit: 0.4 },
    basic: { name: "Axe Smash", type: "physical", mult: 1.0 },
    skill: { name: "Rage Slam", type: "physical", mult: 2.0, mp: 25, special: "rage", desc: "A brutal slam that grows stronger the lower his HP." },
    passive: { name: "Berserker Rage", desc: "The closer to death, the harder Bruno hits." },
    quote: "The stronger the battle, the more alive I feel.",
  },
  {
    id: "sylvie", name: "Sylvie", class: "Ranger", color: "#22c55e", img: HERO_IMG.sylvie,
    base: { hp: 90, mp: 40, atk: 12, def: 7, mag: 8, spd: 16, crit: 12 },
    growth: { hp: 14, mp: 7, atk: 3.5, def: 1.5, mag: 2, spd: 3, crit: 0.5 },
    basic: { name: "Nature Arrow", type: "physical", mult: 1.0 },
    skill: { name: "Nature's Barrage", type: "physical", mult: 1.8, mp: 20, special: "critup", desc: "A flurry of nature-infused arrows that pierce defense." },
    passive: { name: "Forest's Blessing", desc: "Nature guides her aim and quickens her step." },
    quote: "Nature guides my aim.",
  },
  {
    id: "darius", name: "Darius", class: "Paladin", color: "#fcd34d", img: HERO_IMG.darius,
    base: { hp: 110, mp: 60, atk: 11, def: 15, mag: 12, spd: 9, crit: 5 },
    growth: { hp: 17, mp: 9, atk: 3, def: 2.5, mag: 3, spd: 1.5, crit: 0.3 },
    basic: { name: "Holy Strike", type: "physical", mult: 1.0 },
    skill: { name: "Holy Guardian", type: "magic", mult: 1.2, mp: 28, special: "heal", heal: 0.35, desc: "Smites the foe with holy light while healing wounds." },
    passive: { name: "Divine Protection", desc: "Holy grace fortifies defense and sustains life." },
    quote: "Justice beyond borders.",
  },
  {
    id: "elian", name: "Elian", class: "Mage", color: "#38bdf8", img: HERO_IMG.elian,
    base: { hp: 75, mp: 90, atk: 6, def: 6, mag: 20, spd: 13, crit: 12 },
    growth: { hp: 11, mp: 15, atk: 1, def: 1, mag: 5.5, spd: 2, crit: 0.5 },
    basic: { name: "Celestial Bolt", type: "magic", mult: 1.0 },
    skill: { name: "Celestial Arcana", type: "magic", mult: 2.1, mp: 25, special: null, desc: "Calls down a brilliant starfall of celestial magic." },
    passive: { name: "Astral Insight", desc: "Cosmic wisdom pushes magic power to its peak." },
    quote: "Knowledge today, a brighter tomorrow.",
  },
  {
    id: "riven", name: "Riven", class: "Beastmaster", color: "#f97316", img: HERO_IMG.riven,
    base: { hp: 105, mp: 45, atk: 13, def: 9, mag: 7, spd: 14, crit: 10 },
    growth: { hp: 16, mp: 7, atk: 4, def: 2, mag: 1.5, spd: 3, crit: 0.5 },
    basic: { name: "Twin Slash", type: "physical", mult: 1.0 },
    skill: { name: "Primal Hunt", type: "physical", mult: 1.3, mp: 20, special: "double", desc: "Riven strikes as his wolf companion lunges in to assist." },
    passive: { name: "Primal Bond", desc: "His wolf fights at his side, adding extra strikes." },
    quote: "A stronger bond, a wilder tomorrow.",
  },
];

export const CHAPTERS = [
  {
    id: 1, name: "The Beginning", rec: "1-5", theme: "Verdant village outskirts", enemyName: "Goblin Scout", enemyImg: "goblin",
    bossName: "Goblin King", bossImg: "goblin_king",
    levels: ["Village Outskirts", "Whispering Path", "Forest Edge", "Goblin Camp", "Goblin King"],
  },
  {
    id: 2, name: "Into the Wild", rec: "5-9", theme: "Deep untamed forest", enemyName: "Dire Wolf", enemyImg: "wolf",
    bossName: "Forest Guardian", bossImg: "forest_guardian",
    levels: ["Deep Forest", "Wolf Den", "Hunter's Trail", "Ancient Grove", "Forest Guardian"],
  },
  {
    id: 3, name: "The Frozen Road", rec: "8-13", theme: "Frostbound mountain pass", enemyName: "Ice Golem", enemyImg: "ice_golem",
    bossName: "Frost Wyrm", bossImg: "frost_wyrm",
    levels: ["Frost Road", "Ice Cavern", "Frozen Ruins", "Frostfang Camp", "Frost Wyrm"],
  },
  {
    id: 4, name: "Crimson Canyon", rec: "12-17", theme: "Burning volcanic canyon", enemyName: "Canyon Bandit", enemyImg: "bandit",
    bossName: "Crimson Warlord", bossImg: "crimson_warlord",
    levels: ["Canyon Entrance", "Bandit Pass", "Burning Valley", "Lava Fortress", "Crimson Warlord"],
  },
  {
    id: 5, name: "Misty Swamp", rec: "16-21", theme: "Poisonous fog-laden marsh", enemyName: "Swamp Lurker", enemyImg: "dark_mage",
    bossName: "Swamp Witch", bossImg: "swamp_witch",
    levels: ["Swamp Entrance", "Poison Marsh", "Witch Hollow", "Bog Temple", "Swamp Witch"],
  },
  {
    id: 6, name: "Sunshade Island", rec: "20-25", theme: "Tropical coast & ruins", enemyName: "Pirate Raider", enemyImg: "bandit",
    bossName: "Kraken Lord", bossImg: "kraken_lord",
    levels: ["Coastal Ruins", "Pirate Cove", "Coral Temple", "Sunken Fortress", "Kraken Lord"],
  },
  {
    id: 7, name: "Eldria Forest", rec: "24-30", theme: "Enchanted spirit woods", enemyName: "Grove Beast", enemyImg: "wolf",
    bossName: "Ancient Treant", bossImg: "ancient_treant",
    levels: ["Ancient Forest", "Spirit Grove", "Moonlit Path", "Guardian Sanctuary", "Ancient Treant"],
  },
  {
    id: 8, name: "Dragon's Pass", rec: "29-35", theme: "Volcanic dragon graveyard", enemyName: "Bone Revenant", enemyImg: "skeleton",
    bossName: "Elder Dragon", bossImg: "elder_dragon",
    levels: ["Dragon Trail", "Scaled Cavern", "Dragon Graveyard", "Flame Fortress", "Elder Dragon"],
  },
  {
    id: 9, name: "Shadow Citadel", rec: "34-42", theme: "Cursed demon fortress", enemyName: "Cursed Knight", enemyImg: "skeleton",
    bossName: "Shadow Lord", bossImg: "shadow_lord",
    levels: ["Dark Gate", "Shadow Prison", "Cursed Hall", "Demon Tower", "Shadow Lord"],
  },
  {
    id: 10, name: "Celestial Ruins", rec: "40-50", theme: "Floating astral ruins", enemyName: "Astral Sentinel", enemyImg: "dark_mage",
    bossName: "Celestial Overlord", bossImg: "celestial_overlord",
    levels: ["Ruined Gate", "Astral Temple", "Celestial Library", "Fallen Sanctuary", "Celestial Overlord"],
  },
];

export const SHOP_ITEMS = [
  { id: "hp_potion", name: "HP Potion", price: 50, desc: "Restores 40% of Max HP", accent: "#10b981" },
  { id: "mp_potion", name: "MP Potion", price: 60, desc: "Restores 35% of Max MP", accent: "#38bdf8" },
  { id: "greater_hp", name: "Greater HP Potion", price: 120, desc: "Restores 70% of Max HP", accent: "#10b981" },
  { id: "greater_mp", name: "Greater MP Potion", price: 150, desc: "Restores 65% of Max MP", accent: "#38bdf8" },
  { id: "atk_potion", name: "Attack Elixir", price: 200, desc: "+30% Attack this battle", accent: "#ef4444" },
  { id: "def_potion", name: "Defense Elixir", price: 200, desc: "+40% Defense this battle", accent: "#eab308" },
  { id: "crit_potion", name: "Critical Elixir", price: 250, desc: "+20% Crit this battle", accent: "#f59e0b" },
];

export const POTION_META = {
  hp_potion: { name: "HP Potion", accent: "#10b981" },
  mp_potion: { name: "MP Potion", accent: "#38bdf8" },
  greater_hp: { name: "Greater HP Potion", accent: "#10b981" },
  greater_mp: { name: "Greater MP Potion", accent: "#38bdf8" },
  atk_potion: { name: "Attack Elixir", accent: "#ef4444" },
  def_potion: { name: "Defense Elixir", accent: "#eab308" },
  crit_potion: { name: "Critical Elixir", accent: "#f59e0b" },
};

export const RARITY = {
  common: { label: "Common", color: "#94a3b8" },
  rare: { label: "Rare", color: "#38bdf8" },
  epic: { label: "Epic", color: "#a855f7" },
  legendary: { label: "Legendary", color: "#f59e0b" },
};

export const EQUIP_TEMPLATES = [
  // weapons
  { id: "iron_sword", name: "Iron Sword", slot: "weapon", rarity: "common", stats: { atk: 4 } },
  { id: "steel_blade", name: "Steel Blade", slot: "weapon", rarity: "rare", stats: { atk: 8, crit: 3 } },
  { id: "mythril_edge", name: "Mythril Edge", slot: "weapon", rarity: "epic", stats: { atk: 15, crit: 5, spd: 2 } },
  { id: "dragonfang", name: "Dragonfang", slot: "weapon", rarity: "legendary", stats: { atk: 24, crit: 8, mag: 5 } },
  // armor
  { id: "leather_armor", name: "Leather Armor", slot: "armor", rarity: "common", stats: { def: 4, hp: 10 } },
  { id: "chainmail", name: "Chainmail", slot: "armor", rarity: "rare", stats: { def: 8, hp: 25 } },
  { id: "plate_armor", name: "Plate Armor", slot: "armor", rarity: "epic", stats: { def: 14, hp: 50 } },
  { id: "aegis_plate", name: "Aegis Plate", slot: "armor", rarity: "legendary", stats: { def: 22, hp: 90, mp: 20 } },
  // helmet
  { id: "leather_cap", name: "Leather Cap", slot: "helmet", rarity: "common", stats: { def: 2, hp: 6 } },
  { id: "iron_helm", name: "Iron Helm", slot: "helmet", rarity: "rare", stats: { def: 5, hp: 15 } },
  { id: "knight_helm", name: "Knight Helm", slot: "helmet", rarity: "epic", stats: { def: 9, hp: 30, mp: 10 } },
  { id: "crown_kings", name: "Crown of Kings", slot: "helmet", rarity: "legendary", stats: { def: 14, hp: 45, mag: 8 } },
  // accessory
  { id: "wooden_ring", name: "Wooden Ring", slot: "accessory", rarity: "common", stats: { mp: 8, mag: 3 } },
  { id: "mana_band", name: "Mana Band", slot: "accessory", rarity: "rare", stats: { mp: 20, mag: 6, spd: 2 } },
  { id: "arcane_amulet", name: "Arcane Amulet", slot: "accessory", rarity: "epic", stats: { mp: 40, mag: 12, crit: 4 } },
  { id: "celestial_relic", name: "Celestial Relic", slot: "accessory", rarity: "legendary", stats: { mp: 70, mag: 20, crit: 8, spd: 4 } },
];

export const QUESTS = [
  { id: "q_kill10", title: "Monster Hunter", desc: "Defeat 10 enemies", statKey: "kills", target: 10, repeatable: true, reward: { xp: 120, coins: 200, consumables: { hp_potion: 2 } } },
  { id: "q_levels3", title: "Pathfinder", desc: "Complete 3 levels", statKey: "levels", target: 3, repeatable: true, reward: { xp: 150, coins: 250 } },
  { id: "q_coins500", title: "Treasure Seeker", desc: "Earn 500 coins", statKey: "coinsEarned", target: 500, repeatable: true, reward: { xp: 100, consumables: { greater_hp: 1 } } },
  { id: "q_potions3", title: "Alchemist's Aid", desc: "Use 3 potions", statKey: "potionsUsed", target: 3, repeatable: true, reward: { coins: 150, xp: 80 } },
  { id: "q_boss1", title: "Boss Slayer", desc: "Defeat a boss", statKey: "bosses", target: 1, repeatable: true, reward: { xp: 300, coins: 500, drop: true } },
  { id: "q_reach5", title: "Rising Hero", desc: "Reach Level 5", statKey: "level", target: 5, repeatable: false, reward: { coins: 300, consumables: { greater_hp: 2 } } },
  { id: "q_reach15", title: "Seasoned Adventurer", desc: "Reach Level 15", statKey: "level", target: 15, repeatable: false, reward: { coins: 800, drop: true } },
  { id: "q_reach30", title: "Living Legend", desc: "Reach Level 30", statKey: "level", target: 30, repeatable: false, reward: { coins: 2000, drop: true } },
];

export function xpToNext(level) {
  return 100 + (level - 1) * 75;
}

export function getHero(id) {
  return HEROES.find((h) => h.id === id);
}

export function getComputedStats(profile) {
  const b = profile.baseStats;
  const s = { maxHp: Math.round(b.hp), maxMp: Math.round(b.mp), atk: Math.round(b.atk), def: Math.round(b.def), mag: Math.round(b.mag), spd: Math.round(b.spd), crit: Math.round(b.crit) };
  const map = { hp: "maxHp", mp: "maxMp", atk: "atk", def: "def", mag: "mag", spd: "spd", crit: "crit" };
  for (const slot of ["weapon", "armor", "helmet", "accessory"]) {
    const it = profile.equipment[slot];
    if (it) for (const k in it.stats) s[map[k]] += it.stats[k];
  }
  return s;
}

export function buildEnemy(chapter, level) {
  const gl = (chapter - 1) * 5 + level;
  const isBoss = level === 5;
  const isFinal = chapter === 10 && level === 5;
  const cfg = CHAPTERS[chapter - 1];
  let hp = Math.round((38 + gl * 13) * (isBoss ? 2.5 : 1));
  let atk = Math.round((7 + gl * 2.1) * (isBoss ? 1.45 : 1));
  let def = Math.round((2 + gl * 1.0) * (isBoss ? 1.4 : 1));
  const spd = Math.round(5 + gl * 0.6);
  let xp = Math.round((28 + gl * 16) * (isBoss ? 3 : 1));
  let coins = Math.round((18 + gl * 11) * (isBoss ? 4 : 1));
  if (isFinal) { hp = Math.round(hp * 1.5); atk = Math.round(atk * 1.3); def = Math.round(def * 1.2); xp = Math.round(xp * 1.4); coins = Math.round(coins * 1.5); }
  return {
    name: isBoss ? cfg.bossName : cfg.enemyName,
    img: isBoss ? BOSS_IMG[cfg.bossImg] : ENEMY_IMG[cfg.enemyImg],
    maxHp: hp, hp, atk, def, spd, xp, coins, isBoss, isFinal,
    chapter, level,
  };
}

function pickRarity(chapter, isBoss) {
  const r = Math.random() * 100;
  if (chapter <= 2) {
    if (isBoss) return r < 55 ? "rare" : "epic";
    return r < 68 ? "common" : "rare";
  }
  if (chapter <= 5) {
    if (isBoss) return r < 25 ? "rare" : r < 85 ? "epic" : "legendary";
    return r < 32 ? "common" : r < 80 ? "rare" : "epic";
  }
  if (chapter <= 8) {
    if (isBoss) return r < 45 ? "epic" : "legendary";
    return r < 38 ? "rare" : r < 85 ? "epic" : "legendary";
  }
  if (isBoss) return r < 30 ? "epic" : "legendary";
  return r < 50 ? "epic" : "legendary";
}

export function makeDrop(chapter, isBoss) {
  const slots = ["weapon", "armor", "helmet", "accessory"];
  const slot = slots[Math.floor(Math.random() * slots.length)];
  const rarity = pickRarity(chapter, isBoss);
  let t = EQUIP_TEMPLATES.find((e) => e.slot === slot && e.rarity === rarity);
  if (!t) t = EQUIP_TEMPLATES.find((e) => e.slot === slot);
  return {
    uid: "it_" + Date.now().toString(36) + Math.floor(Math.random() * 1e6).toString(36),
    templateId: t.id, name: t.name, slot: t.slot, rarity: t.rarity, stats: { ...t.stats },
  };
}

export function createProfile(username, heroId) {
  const h = getHero(heroId);
  return {
    username,
    heroId,
    level: 1,
    xp: 0,
    baseStats: { ...h.base },
    hp: h.base.hp,
    mp: h.base.mp,
    coins: 500,
    gems: 0,
    consumables: { hp_potion: 3, mp_potion: 2, greater_hp: 0, greater_mp: 0, atk_potion: 0, def_potion: 0, crit_potion: 0 },
    equipment: { weapon: null, armor: null, helmet: null, accessory: null },
    inventory: [],
    progress: { unlockedChapter: 1, completed: {} },
    stats: { kills: 0, levels: 0, bosses: 0, coinsEarned: 0, potionsUsed: 0 },
    questState: {},
    settings: { music: true, sound: true, animations: true, screenShake: true },
    createdAt: new Date().toISOString(),
  };
}
