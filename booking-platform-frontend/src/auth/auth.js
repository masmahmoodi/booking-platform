export function setTokens({ access, refresh }) {
  localStorage.setItem("access", access);
  localStorage.setItem("refresh", refresh);
}

export function getAccess() {
  return localStorage.getItem("access");
}

export function isLoggedIn() {
  return Boolean(getAccess());
}

// We'll set role manually for now (next step we can auto-detect)
export function setRole(role) {
  localStorage.setItem("role", role); // "CUSTOMER" or "PROVIDER"
}

export function getRole() {
  return localStorage.getItem("role");
}
