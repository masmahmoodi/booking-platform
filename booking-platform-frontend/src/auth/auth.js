// src/auth/auth.js

// -----------------------------
// Local (non-secret) user info
// -----------------------------
export function setRole(role) {
  localStorage.setItem("role", role);
}

export function getRole() {
  return localStorage.getItem("role") || "CUSTOMER";
}

export function setUserId(id) {
  localStorage.setItem("userId", String(id));
}

export function getUserId() {
  const v = localStorage.getItem("userId");
  return v ? Number(v) : null;
}

// -----------------------------
// "Logged in" helpers
// -----------------------------
// For cookie-based auth, the REAL source of truth is calling /api/auth/me/.
// But for UI routing we can treat "having userId saved" as logged-in-ish.
export function hasSessionInfo() {
  return !!getUserId();
}

// Keep this name for compatibility with your old code (ProtectedRoute imports it)
export function isLoggedIn() {
  return hasSessionInfo();
}

// -----------------------------
// Logout (local cleanup)
// -----------------------------
export function logoutLocal() {
  localStorage.removeItem("role");
  localStorage.removeItem("userId");
}

// Backward-compatible name (if any old file imports logout())
export function logout() {
  logoutLocal();
}
