
export function setRole(role) {
  localStorage.setItem("role", role || "");
}

export function getRole() {
  return localStorage.getItem("role") || "";
}

export function setUserId(id) {
  if (id === null || id === undefined) localStorage.removeItem("userId");
  else localStorage.setItem("userId", String(id));
}

export function getUserId() {
  const v = localStorage.getItem("userId");
  return v ? Number(v) : null;
}

export function isLoggedIn() {
  return !!getUserId();
}

export function logoutLocal() {
  localStorage.removeItem("role");
  localStorage.removeItem("userId");
}
