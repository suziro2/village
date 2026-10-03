const KEY = "village_legends_save_v1";

export function loadProfile() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw);
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
