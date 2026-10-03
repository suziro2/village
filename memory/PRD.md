# Village Legends — PRD

## Original problem statement
Build "Village Legends": a single-player anime-fantasy RPG that runs entirely in the browser. Pick a hero, battle across a world map through 10 chapters of turn-based combat (50 levels = 40 normal fights + 10 bosses), grow stronger with XP, loot and gear. All progress saves locally in the browser — no account, no server, no database. Art is modern high-resolution anime fantasy, never pixel art.

## Architecture
- **Frontend-only** React app (CRA + craco, Tailwind, shadcn/ui, lucide-react). No backend/DB used.
- State machine driven by a `screen` value in `GameContext` (single `/` route).
- Persistence: browser `localStorage` key `village_legends_save_v1`.
- Key files:
  - `src/game/data.js` — heroes, chapters/levels, enemy/boss builder, shop, quests, equipment, image URLs, xp/stat helpers.
  - `src/game/combat.js` — damage formula, crit, escape, potion effects.
  - `src/game/GameContext.jsx` — profile state + all actions (battle resolution, xp/level, shop, inventory, quests, settings, reset).
  - `src/game/storage.js` — localStorage load/save/clear.
  - `src/components/` — NavBar, common UI helpers.
  - `src/screens/` — Login, HeroSelect, MainMenu, WorldMap, Chapter, Battle, Character, Inventory, Shop, Quest, Settings, ResultScreens.
- All artwork AI-generated (anime fantasy, non-pixel): 10 hero full-body illustrations, 10 chapter backgrounds, 10 bosses, 6 common enemies.

## User personas
- Casual fantasy-RPG players who want a complete, polished adventure instantly in the browser with zero setup/signup.

## Core requirements (static)
- Local username profile; 10 playable heroes with unique class/stats/skill/passive/quote.
- Interactive world map; 10 chapters × 5 levels (4 normal + 1 boss) with chapter-by-chapter scaling; final boss hardest.
- Turn-based combat: Attack, Skill (MP), Potion, Defend, Escape (not vs bosses); crits, defense, floating damage, VFX, screen shake.
- Progression to level 50 w/ stat growth + full heal on level-up; coins; HP/MP; potions.
- Shop (potions/elixirs), inventory & equipment (weapon/armor/helmet/accessory w/ rarities & drops), quest board (repeatable + milestone), character screen.
- Victory/defeat/chapter-complete/game-complete flows; chapter unlocking.
- Settings toggles (music/sound/animations/screen shake); auto-save/continue/reset.

## Implemented (2026-06-03) — MVP complete & tested (frontend E2E 100%)
- Full playable loop end-to-end: login → hero select → menu → map → chapter → battle → results → progression.
- All 10 heroes, 10 chapters, 50 levels with scaling enemies/bosses; turn-based combat with all 5 actions, crits, VFX, floating numbers, screen shake.
- XP/leveling, coins, potions, shop, inventory/equipment w/ drops & rarities, quests (claim + repeatable), character screen, settings, localStorage save/continue/reset.
- Riven fights with a wolf companion (Primal Hunt = double strike).

## Backlog / future (not yet built)
- **P1**: Unique boss attack patterns/phases & status effects (poison/stun/elemental); richer enemy variety.
- **P1**: More equipment sets/rarities, gem sink (gems currently tracked but unspendable), manual stat-point allocation.
- **P2**: Audio (music + SFX wired to existing toggles).
- **P2**: Bestiary / achievements, star-rating refinement, expanded daily quests, deeper balance tuning.

## Next tasks
- Add combat SFX/music hooked to settings toggles.
- Add boss phases / status effects for more combat depth.
- Give gems a purpose (premium shop or gear upgrades).
