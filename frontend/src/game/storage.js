import { EMPTY_UPGRADES } from "./data";

const KEY = "village_legends_save_v1";

export function loadProfile() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const p = JSON.parse(raw);
    p.gems = p.gems || 0;
    p.upgrades = { ...EMPTY_UPGRADES, ...(p.upgrades || {}) };
    p.consumables = { antidote: 0, phoenix_feather: 0, ...p.consumables };
    return p;
  } catch (e) {
    return null;
  }
}

export function saveProfile(profile) {
  try {
    if (profile) localStorage.setItem(KEY, JSON.stringify(profile));
  } catch (e) {
    /* ignore quota errors */
  }
}

export function clearProfile() {
  try {
    localStorage.removeItem(KEY);
  } catch (e) {}
}
