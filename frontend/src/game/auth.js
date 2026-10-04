const USERS_KEY = "village_legends_users_v1";
const SESSION_KEY = "village_legends_session_v1";

function readUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
  } catch (_) {
    return {};
  }
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

async function hashPassword(password, salt) {
  const data = new TextEncoder().encode(`${salt}:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function createSalt() {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function register(username, password) {
  const normalized = username.trim().toLowerCase();
  const users = readUsers();

  if (users[normalized]) {
    throw new Error("Username is already registered");
  }

  const salt = createSalt();
  const passwordHash = await hashPassword(password, salt);

  users[normalized] = {
    id: crypto.randomUUID(),
    username: normalized,
    salt,
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  writeUsers(users);
  localStorage.setItem(SESSION_KEY, normalized);

  return { id: users[normalized].id, username: normalized };
}

export async function login(username, password) {
  const normalized = username.trim().toLowerCase();
  const users = readUsers();
  const user = users[normalized];

  if (!user) {
    throw new Error("Invalid username or password");
  }

  const passwordHash = await hashPassword(password, user.salt);
  if (passwordHash !== user.passwordHash) {
    throw new Error("Invalid username or password");
  }

  localStorage.setItem(SESSION_KEY, normalized);
  return { id: user.id, username: user.username };
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export function hasAuthToken() {
  return Boolean(localStorage.getItem(SESSION_KEY));
}

export async function getCurrentUser() {
  const username = localStorage.getItem(SESSION_KEY);
  if (!username) return null;

  const user = readUsers()[username];
  if (!user) {
    logout();
    return null;
  }

  return { id: user.id, username: user.username };
}
