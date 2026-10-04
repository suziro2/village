import { EMPTY_UPGRADES } from "./data";

const LEGACY_KEY = "village_legends_save_v1";
const KEY_PREFIX = "village_legends_save_v2_";

export function profileKey(userIdOrUsername) {
  const safe = String(userIdOrUsername || "guest").trim().toLowerCase().replace(/[^a-z0-9_.-]/g, "_");
  return KEY_PREFIX + safe;
}

function normalize(p) {
  p.gems = p.gems || 0;
  p.upgrades = { ...EMPTY_UPGRADES, ...(p.upgrades || {}) };
  p.consumables = { antidote: 0, phoenix_feather: 0, ...p.consumables };
  return p;
}

export function loadProfile(userIdOrUsername) {
  try {
    const key = userIdOrUsername ? profileKey(userIdOrUsername) : LEGACY_KEY;
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return normalize(JSON.parse(raw));
  } catch (e) {
    return null;
  }
}

export function saveProfile(profile, userIdOrUsername) {
  try {
    if (profile) {
      const key = userIdOrUsername ? profileKey(userIdOrUsername) : LEGACY_KEY;
      localStorage.setItem(key, JSON.stringify(profile));
    }
  } catch (e) {}
}

export function clearProfile(userIdOrUsername) {
  try {
    if (userIdOrUsername) localStorage.removeItem(profileKey(userIdOrUsername));
    else localStorage.removeItem(LEGACY_KEY);
  } catch (e) {}
}
