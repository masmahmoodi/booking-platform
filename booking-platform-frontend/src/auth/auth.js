

function decodeJwtPayload(token) {
  try {
    const payloadPart = token.split(".")[1];
    const json = atob(payloadPart.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function isLoggedIn() {
  const access = localStorage.getItem("access");
  if (!access) return false;

  const payload = decodeJwtPayload(access);
  if (!payload?.exp) return true;

  
  const now = Math.floor(Date.now() / 1000);
  return payload.exp > now;
}

export function logout() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("role");
}

export function setRole(role) {
  localStorage.setItem("role", role);
}

export function getRole() {
  return localStorage.getItem("role") || "CUSTOMER";
}
