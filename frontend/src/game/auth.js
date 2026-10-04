const API_BASE = (process.env.REACT_APP_API_URL || "").replace(/\/$/, "");
const TOKEN_KEY = "village_legends_auth_token";

export async function authRequest(path, options = {}) {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  let body = null;
  try { body = await response.json(); } catch (_) {}
  if (!response.ok) {
    throw new Error(body?.detail || "Authentication request failed");
  }
  return body;
}

export async function login(username, password) {
  const result = await authRequest("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
  localStorage.setItem(TOKEN_KEY, result.access_token);
  return result.user;
}

export async function register(username, password) {
  const result = await authRequest("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
  localStorage.setItem(TOKEN_KEY, result.access_token);
  return result.user;
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
}

export function hasAuthToken() {
  return Boolean(localStorage.getItem(TOKEN_KEY));
}

export async function getCurrentUser() {
  if (!hasAuthToken()) return null;
  try {
    const result = await authRequest("/api/auth/me");
    return result;
  } catch (_) {
    logout();
    return null;
  }
}
