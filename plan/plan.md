# Village Legends — Browser Fantasy RPG

A single-player anime-fantasy RPG that runs entirely in the browser: pick a hero, battle across a world map through 10 chapters of turn-based combat, and grow stronger with XP, loot, and gear.
All progress saves locally in the browser — no account, no server, no database. The art is modern high-resolution anime fantasy, never pixel art.

## Who it's for
Players who enjoy mobile/PC-style fantasy RPGs and want a complete, polished adventure they can play instantly in a browser without signing up or installing anything.

## Core features and experience
- **Local profile login**: enter a username to start; everything is saved in the browser and resumes on return.
- **10 playable heroes**: Aiden (Swordsman), Luna (Mage), Ronan (Knight), Mira (Archer), Kael (Assassin), Bruno (Berserker), Sylvie (Ranger), Darius (Paladin), Elian (Mage), Riven (Beastmaster). Each has its own class, stats, basic attack, special skill, passive, and quote. The hero chosen at character selection becomes the active hero everywhere.
- **Interactive world map**: clickable regions showing recommended level, chapter, progress, and locked/unlocked status.
- **10 chapters, 50 levels**: each chapter has 4 normal fights plus a boss (chapter level 5). Named levels and bosses per the spec, with difficulty scaling chapter by chapter. The final boss is notably harder.
- **Turn-based combat**: Attack, Skill (costs MP), Potion (heals), Defend (reduces next hit), Escape (normal levels only). Enemies take their turn after the player. Includes critical hits, defense, a balanced damage formula, floating damage numbers, and combat VFX.
- **Progression**: XP and leveling up to level 50, with stat growth and full heal on level-up; coins as currency; HP/MP and potions.
- **Shop**: buy HP/MP potions, greater potions, and stat-boost potions with coins.
- **Inventory & equipment**: consumables, equipment (weapon/armor/helmet/accessory), and quest items; use, equip, and unequip. Gear boosts stats. Equipment drops from levels and bosses.
- **Quests**: a quest board with objectives (kill enemies, complete levels, defeat bosses, collect coins, use potions, reach a level) plus repeatable side quests; claim rewards.
- **Character screen**: portrait, name, class, level, XP bar, full stats, equipped gear, skill and passive descriptions.
- **Victory / defeat screens**: rewards and next-level/continue options on victory; chapter-complete and next-chapter unlock after a boss; retry or return on defeat without wiping progress.
- **Save system**: auto-saves after key actions; supports New Game, Continue, and Reset Save (with confirmation).
- **Settings**: toggle music, sound, animations, and screen shake; stored locally.
- **Riven's wolf**: Riven fights alongside a wolf companion that assists attacks and his Primal Hunt skill.

## User flow
Login (enter username) → Create/confirm character → Select hero → Main menu → Play → World map → Chapter select → Level select → Battle → Enemy turn → Victory (XP / coins / items) → Next level → Boss → Chapter complete → Next chapter → Final boss → Game complete.
From the main game, a navigation bar reaches Map, Character, Inventory, Quests, Shop, Settings, and Home.

## UI/UX feel
Modern anime fantasy RPG — not a generic dashboard and never pixelated. Dark navy backgrounds, gold borders, glass/translucent panels, and magical blue/green accents with red used for bosses. Cinematic lighting, soft glows, particles, and smooth CSS/JS animations (idle breathing, attack motion, hit shake, skill glow, defeat fade, victory bounce, damage numbers, screen shake). Fantasy-style headings (Cinzel/Trajan feel) with clean, readable body text. Battle scenes place the player hero large on the left and the enemy on the right over a full-screen chapter-themed background with a top HUD and bottom combat controls. Desktop-first but responsive down to tablet and mobile.

## Artwork
All imagery is generated fresh as high-resolution anime-fantasy illustrations: a portrait and a full-body standing image for each of the 10 heroes, enemy and boss art, the world map, and per-chapter battle backgrounds. Portraits are used for cards, HUD, selection, victory, and defeat; standing art is used in battle and the character screen.

## Implementation phases

### Phase 1 — MVP (built now)
The complete, playable game end to end: local-profile login, character creation and hero selection, main menu, interactive world map, all 10 chapters / 50 levels (40 normal fights + 10 bosses) with scaling difficulty, full turn-based combat with VFX, XP/leveling, coins, HP/MP, potions, shop, inventory, equipment, quests and side quests, character screen, victory/defeat flow, chapter unlocking, settings, and auto-save/continue/reset. Generated artwork for all 10 heroes, enemies, bosses, map, and chapter backgrounds.

### Phase 2 — Depth and polish (later)
Richer enemy variety and unique boss attack patterns/phases, more equipment sets and rarities, additional status effects and elemental interactions, star-rating refinement per level, and expanded daily/repeatable quests.

### Phase 3 — Extras (later)
Audio (combat sound effects and music with the already-built toggles), optional animated sprite-sheet support if assets are supplied, additional game-balance tuning, and quality-of-life additions such as a bestiary or achievements.

## Assumptions
- Built fresh in this environment as a React single-player app; no existing vanilla HTML/JS project or assets are carried over (none were present).
- No backend, no database, no real accounts — all state lives in browser localStorage.
- Login is a simple local username profile with no password.
- All hero, enemy, boss, map, and background art is AI-generated in a modern anime-fantasy (non-pixel) style; the "preserve existing assets" instruction does not apply since no assets exist.
- Riven is a single playable hero; his wolf is a combat companion, not a separate selectable character.
- Numeric balance (damage formula, XP curve, coin/potion amounts, enemy scaling) follows the values in the spec, with minor tuning as needed so early fights stay fair and the final boss stays hard.
- The spec's suggested file breakdown is treated as guidance; the actual structure follows what is cleanest in React.
- "Gems" appear in player data but have no spending use defined; they are tracked and shown but not required for Phase 1 gameplay.
