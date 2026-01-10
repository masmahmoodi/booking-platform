import axios from "axios"
const BASE_URL = "http://localhost:8000"

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
})

function getCookie(name) {
  const value = ` ${document.cookie}`
  const parts = value.split(` ${name}=`)
  if (parts.length === 2) return parts.pop().split("").shift()
  return null
}

api.interceptors.request.use((config) => {
  const method = (config.method || "get").toLowerCase()
  const unsafe = ["post", "put", "patch", "delete"].includes(method)

  if (unsafe) {
    const token = getCookie("csrftoken")
    if (token) config.headers["X-CSRFToken"] = token
  }
  return config
})

export async function csrfRequest() {
  const res = await api.get("/api/auth/csrf/")
  return res.data
}

export async function loginRequest(username, password) {
  await csrfRequest()
  const res = await api.post("/api/auth/login/", { username, password })
  return res.data
}

export async function registerRequest(payload) {
  await csrfRequest()
  const res = await api.post("/api/auth/register/", payload)
  return res.data
}

export async function logoutRequest() {
  await csrfRequest()
  const res = await api.post("/api/auth/logout/")
  return res.data
}

export async function meRequest() {
  const res = await api.get("/api/auth/me/")
  return res.data
}

export async function getServices() {
  const res = await api.get("/api/services/")
  return res.data
}

export async function createService(body) {
  await csrfRequest()
  const res = await api.post("/api/services/", body)
  return res.data
}

export async function updateService(id, body) {
  await csrfRequest()
  const res = await api.patch(`/api/services/${id}/`, body)
  return res.data
}

export async function deleteService(id) {
  await csrfRequest()
  const res = await api.delete(`/api/services/${id}/`)
  return res.data
}


export async function getBookings() {
  const res = await api.get("/api/bookings/")
  return res.data
}

export async function createBooking(body) {
  await csrfRequest()
  const res = await api.post("/api/bookings/", body)
  return res.data
}

export async function bookingAction(id, action) {
  await csrfRequest()
  const res = await api.post(`/api/bookings/${id}/${action}/`)
  return res.data
}
