// src/api.js
import axios from "axios"

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"

// ---- tokens ----
export function getAccessToken() {
  return localStorage.getItem("access")
}
export function getRefreshToken() {
  return localStorage.getItem("refresh")
}
export function setTokens({ access, refresh }) {
  if (access) localStorage.setItem("access", access)
  if (refresh) localStorage.setItem("refresh", refresh)
}
export function clearTokens() {
  localStorage.removeItem("access")
  localStorage.removeItem("refresh")
  localStorage.removeItem("role")
  localStorage.removeItem("user_id")
}

// ---- axios instance ----
export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
})

// attach access
api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// refresh lock
let refreshPromise = null

async function refreshAccessToken() {
  const refresh = getRefreshToken()
  if (!refresh) throw new Error("No refresh token. Please login again.")

  const res = await axios.post(`${BASE_URL}/api/auth/refresh/`, { refresh })
  setTokens({ access: res.data.access, refresh: res.data.refresh })
  return res.data.access
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (!error.response) {
      return Promise.reject(new Error("Network error. Backend not reachable."))
    }

    const original = error.config
    const status = error.response.status

    // show backend message for non-401
    if (status !== 401) {
      const msg =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Request failed"
      return Promise.reject(new Error(msg))
    }

    // prevent infinite loop
    if (original._retry) {
      clearTokens()
      return Promise.reject(new Error("Session expired. Please login again."))
    }
    original._retry = true

    try {
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null
        })
      }
      const newAccess = await refreshPromise
      original.headers.Authorization = `Bearer ${newAccess}`
      return api(original)
    } catch (e) {
      clearTokens()
      return Promise.reject(new Error("Session expired. Please login again."))
    }
  }
)

// ---- endpoints ----
export async function loginRequest(username, password) {
  const res = await axios.post(`${BASE_URL}/api/auth/login/`, { username, password })
  return res.data
}

export async function meRequest() {
  const res = await api.get("/api/auth/me/")
  return res.data // { id, username, role }
}

// Services
export async function getServices(params = {}) {
  const res = await api.get("/api/services/", { params })
  return res.data
}

export async function createService(payload) {
  const res = await api.post("/api/services/", payload)
  return res.data
}

export async function updateService(id, payload) {
  const res = await api.patch(`/api/services/${id}/`, payload)
  return res.data
}

export async function deleteService(id) {
  const res = await api.delete(`/api/services/${id}/`)
  return res.data
}

// Bookings
export async function getBookings() {
  const res = await api.get("/api/bookings/")
  return res.data
}

export async function createBooking(payload) {
  const res = await api.post("/api/bookings/", payload)
  return res.data
}

export async function bookingAction(id, action) {
  const res = await api.post(`/api/bookings/${id}/${action}/`)
  return res.data
}
