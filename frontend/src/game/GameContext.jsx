import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { loadProfile, saveProfile, clearProfile } from "./storage";
import { createProfile, getComputedStats, getHero, xpToNext, makeDrop, QUESTS, GEM_UPGRADES, blessingCost } from "./data";

const GameContext = createContext(null);
export const useGame = () => useContext(GameContext);

export function GameProvider({ children }) {
  const existing = loadProfile();
  const [profile, setProfile] = useState(existing);
  const [screen, setScreen] = useState(existing ? "menu" : "login");
  const [draftName, setDraftName] = useState(existing ? existing.username : "");
  const [currentChapter, setCurrentChapter] = useState(1);
  const [currentBattle, setCurrentBattle] = useState(null); // {chapter, level}
  const [lastRewards, setLastRewards] = useState(null);

  useEffect(() => {
    if (profile) saveProfile(profile);
  }, [profile]);

  const computed = profile ? getComputedStats(profile) : null;

  // ---- profile lifecycle ----
  const startNewGame = useCallback((username, heroId) => {
    const p = createProfile(username, heroId);
    setProfile(p);
    setScreen("menu");
  }, []);

  const resetSave = useCallback(() => {
    clearProfile();
    setProfile(null);
    setDraftName("");
    setScreen("login");
  }, []);

  // ---- navigation ----
  const go = useCallback((s) => setScreen(s), []);
  const openChapter = useCallback((ch) => {
    setCurrentChapter(ch);
    setScreen("chapter");
  }, []);
  const startLevel = useCallback((chapter, level) => {
    setCurrentBattle({ chapter, level });
    setScreen("battle");
  }, []);

  // ---- xp / level ----
  function applyXp(p, amount) {
    p.xp += amount;
    const h = getHero(p.heroId);
    let leveled = false;
    while (p.level < 50 && p.xp >= xpToNext(p.level)) {
      p.xp -= xpToNext(p.level);
      p.level += 1;
      leveled = true;
      for (const k of ["hp", "mp", "atk", "def", "mag", "spd", "crit"]) {
        p.baseStats[k] = Math.round((p.baseStats[k] + h.growth[k]) * 10) / 10;
      }
    }
    if (p.level >= 50) p.xp = Math.min(p.xp, xpToNext(50));
    if (leveled) {
      const c = getComputedStats(p);
      p.hp = c.maxHp;
      p.mp = c.maxMp;
    }
    return leveled;
  }

  // ---- settings ----
  const updateSettings = useCallback((patch) => {
    setProfile((prev) => ({ ...prev, settings: { ...prev.settings, ...patch } }));
  }, []);

  // ---- shop / inventory ----
  const buyItem = useCallback((item) => {
    let ok = false;
    setProfile((prev) => {
      if (prev.coins < item.price) return prev;
      ok = true;
      const next = { ...prev, coins: prev.coins - item.price, consumables: { ...prev.consumables } };
      next.consumables[item.id] = (next.consumables[item.id] || 0) + 1;
      return next;
    });
    return ok;
  }, []);

  // ---- gem shop ----
  const buyGemGear = useCallback((item) => {
    let ok = false;
    setProfile((prev) => {
      if (prev.gems < item.gems) return prev;
      ok = true;
      const drop = {
        uid: "it_" + Date.now().toString(36) + Math.floor(Math.random() * 1e6).toString(36),
        templateId: item.id, name: item.name, slot: item.slot, rarity: item.rarity, stats: { ...item.stats }, premium: true,
      };
      return { ...prev, gems: prev.gems - item.gems, inventory: [...prev.inventory, drop] };
    });
    return ok;
  }, []);

  const buyGemConsumable = useCallback((item) => {
    let ok = false;
    setProfile((prev) => {
      if (prev.gems < item.gems) return prev;
      ok = true;
      const next = { ...prev, gems: prev.gems - item.gems, consumables: { ...prev.consumables } };
      next.consumables[item.id] = (next.consumables[item.id] || 0) + 1;
      return next;
    });
    return ok;
  }, []);

  const buyBlessing = useCallback((upId) => {
    let ok = false;
    setProfile((prev) => {
      const up = GEM_UPGRADES.find((u) => u.id === upId);
      const rank = prev.upgrades[upId] || 0;
      if (rank >= up.max) return prev;
      const cost = blessingCost(up, rank);
      if (prev.gems < cost) return prev;
      ok = true;
      const next = { ...prev, gems: prev.gems - cost, upgrades: { ...prev.upgrades, [upId]: rank + 1 } };
      const c = getComputedStats(next);
      next.hp = Math.min(c.maxHp, Math.max(prev.hp, Math.round(prev.hp * (c.maxHp / getComputedStats(prev).maxHp))));
      return next;
    });
    return ok;
  }, []);

  const equipItem = useCallback((uid) => {
    setProfile((prev) => {
      const item = prev.inventory.find((i) => i.uid === uid);
      if (!item) return prev;
      const equipment = { ...prev.equipment };
      const inventory = prev.inventory.filter((i) => i.uid !== uid);
      const prevEquipped = equipment[item.slot];
      if (prevEquipped) inventory.push(prevEquipped);
      equipment[item.slot] = item;
      return { ...prev, equipment, inventory };
    });
  }, []);

  const unequipItem = useCallback((slot) => {
    setProfile((prev) => {
      const item = prev.equipment[slot];
      if (!item) return prev;
      return { ...prev, equipment: { ...prev.equipment, [slot]: null }, inventory: [...prev.inventory, item] };
    });
  }, []);

  const sellItem = useCallback((uid) => {
    setProfile((prev) => {
      const item = prev.inventory.find((i) => i.uid === uid);
      if (!item) return prev;
      const value = { common: 40, rare: 100, epic: 220, legendary: 500 }[item.rarity] || 40;
      return { ...prev, coins: prev.coins + value, inventory: prev.inventory.filter((i) => i.uid !== uid) };
    });
  }, []);

  // ---- quests ----
  const statValue = useCallback((p, key) => {
    if (key === "level") return p.level;
    return p.stats[key] || 0;
  }, []);

  const claimQuest = useCallback((questId) => {
    setProfile((prev) => {
      const q = QUESTS.find((x) => x.id === questId);
      if (!q) return prev;
      const qs = prev.questState[questId] || { baseline: 0, claimed: 0 };
      const val = q.statKey === "level" ? prev.level : prev.stats[q.statKey] || 0;
      if (val - qs.baseline < q.target) return prev;
      const next = { ...prev, consumables: { ...prev.consumables }, inventory: [...prev.inventory], questState: { ...prev.questState } };
      const r = q.reward;
      if (r.coins) next.coins += r.coins;
      if (r.gems) next.gems = (next.gems || 0) + r.gems;
      if (r.xp) applyXp(next, r.xp);
      if (r.consumables) for (const k in r.consumables) next.consumables[k] = (next.consumables[k] || 0) + r.consumables[k];
      if (r.drop) next.inventory.push(makeDrop(Math.min(10, prev.progress.unlockedChapter + 1), true));
      next.questState[questId] = { baseline: q.repeatable ? qs.baseline + q.target : qs.baseline, claimed: (qs.claimed || 0) + 1, done: !q.repeatable };
      return next;
    });
  }, []);

  // ---- battle resolution ----
  const applyVictory = useCallback(({ chapter, level, enemy, dropItem, playerHp, playerMp, potionsUsed }) => {
    setProfile((prev) => {
      const next = {
        ...prev,
        coins: prev.coins + enemy.coins,
        inventory: [...prev.inventory],
        progress: { ...prev.progress, completed: { ...prev.progress.completed } },
        stats: { ...prev.stats },
      };
      next.baseStats = { ...prev.baseStats };
      const ratio = playerHp / getComputedStats(prev).maxHp;
      const stars = ratio > 0.6 ? 3 : ratio > 0.3 ? 2 : 1;
      const key = `${chapter}-${level}`;
      const prevStars = next.progress.completed[key] || 0;
      next.progress.completed[key] = Math.max(prevStars, stars);
      const gems = (enemy.gems || 0) + (stars === 3 && prevStars < 3 ? 1 : 0);
      next.gems = (prev.gems || 0) + gems;
      next.stats.kills += 1;
      next.stats.levels += 1;
      next.stats.coinsEarned += enemy.coins;
      next.stats.potionsUsed += potionsUsed || 0;
      if (enemy.isBoss) {
        next.stats.bosses += 1;
        if (chapter === prev.progress.unlockedChapter && chapter < 10) next.progress.unlockedChapter = chapter + 1;
      }
      next.hp = Math.max(1, Math.round(playerHp));
      next.mp = Math.max(0, Math.round(playerMp));
      const leveled = applyXp(next, enemy.xp);
      if (dropItem) next.inventory.push(dropItem);
      setLastRewards({ xp: enemy.xp, coins: enemy.coins, gems, item: dropItem || null, leveled, newLevel: next.level, stars });
      return next;
    });
    if (enemy.isFinal) setScreen("gameComplete");
    else if (enemy.isBoss) setScreen("chapterComplete");
    else setScreen("victory");
  }, []);

  const applyDefeat = useCallback(() => {
    setProfile((prev) => {
      const c = getComputedStats(prev);
      return { ...prev, hp: c.maxHp, mp: c.maxMp };
    });
    setScreen("defeat");
  }, []);

  const applyEscape = useCallback((playerHp, playerMp, potionsUsed) => {
    setProfile((prev) => ({
      ...prev,
      hp: Math.max(1, Math.round(playerHp)),
      mp: Math.max(0, Math.round(playerMp)),
      stats: { ...prev.stats, potionsUsed: prev.stats.potionsUsed + (potionsUsed || 0) },
    }));
    setScreen("chapter");
  }, []);

  const value = {
    profile, computed, screen, draftName, setDraftName, currentChapter, currentBattle, lastRewards,
    startNewGame, resetSave, go, openChapter, startLevel,
    updateSettings, buyItem, buyGemGear, buyGemConsumable, buyBlessing, equipItem, unequipItem, sellItem, claimQuest, statValue,
    applyVictory, applyDefeat, applyEscape,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
