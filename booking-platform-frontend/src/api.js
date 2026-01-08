
import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000";

export function getAccessToken() {
  return localStorage.getItem("access");
}

export function getRefreshToken() {
  return localStorage.getItem("refresh");
}

export function setTokens({ access, refresh }) {
  if (access) localStorage.setItem("access", access);
  if (refresh) localStorage.setItem("refresh", refresh);
}

export function clearTokens() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("role");
}


export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

let refreshPromise = null;

async function refreshAccessToken() {
  const refresh = getRefreshToken();
  if (!refresh) {
    clearTokens();
    throw new Error("No refresh token. Please login again.");
  }
  const res = await axios.post(
    `${BASE_URL}/api/auth/refresh/`,
    { refresh },
    { headers: { "Content-Type": "application/json" } }
  );

  setTokens({ access: res.data.access, refresh: res.data.refresh });
  return res.data.access;
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (!error.response) {
      return Promise.reject(new Error("Network error. Backend not reachable."));
    }

    const status = error.response.status;

    if (status !== 401) {
      const msg =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        (typeof error.response?.data === "string"
          ? error.response.data
          : JSON.stringify(error.response?.data));
      return Promise.reject(new Error(msg));
    }

    if (original._retry) {
      clearTokens();
      return Promise.reject(new Error("Session expired. Please login again."));
    }
    original._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }
      const newAccess = await refreshPromise;
      original.headers.Authorization = `Bearer ${newAccess}`;
      return api(original);
    } catch (e) {
      clearTokens();
      return Promise.reject(
        new Error(e?.message || "Session expired. Please login again.")
      );
    }
  }
);

export async function loginRequest(username, password) {
  const res = await axios.post(`${BASE_URL}/api/auth/login/`, {
    username,
    password,
  });
  return res.data;
}


export async function getServices() {
  const res = await api.get("/api/services/");
  return res.data;
}

export async function getBookings() {
  const res = await api.get("/api/bookings/");
  return res.data;
}

export async function createBooking({ service, scheduled_for, note }) {
  const res = await api.post("/api/bookings/", {
    service,
    scheduled_for,
    note,
  });
  return res.data;
}

export async function bookingAction(id, action) {
  const res = await api.post(`/api/bookings/${id}/${action}/`);
  return res.data;
}
