// src/auth/auth.js
export function logout() {
  localStorage.removeItem("access")
  localStorage.removeItem("refresh")
  localStorage.removeItem("role")
  localStorage.removeItem("user_id")
}

export function setRole(role) {
  localStorage.setItem("role", role)
}

export function getRole() {
  return localStorage.getItem("role") || ""
}

export function setUserId(id) {
  localStorage.setItem("user_id", String(id))
}

export function getUserId() {
  const v = localStorage.getItem("user_id")
  return v ? Number(v) : null
}

export function isLoggedIn() {
  return !!localStorage.getItem("access")
}
