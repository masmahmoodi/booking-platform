// src/api.js
const BASE_URL = "http://127.0.0.1:8000";

// ---------------- tokens ----------------
export function getAccessToken() {
  return localStorage.getItem("access");
}

export function getRefreshToken() {
  return localStorage.getItem("refresh");
}

export function setTokens({ access, refresh }) {
  if (access) localStorage.setItem("access", access);
  // IMPORTANT: if backend rotates refresh, it will send a new refresh token
  if (refresh) localStorage.setItem("refresh", refresh);
}

export function clearTokens() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
}

// ---------------- refresh (LOCKED) ----------------
let refreshPromise = null;

export async function refreshAccessToken() {
  const refresh = getRefreshToken();
  if (!refresh) {
    clearTokens();
    throw new Error("No refresh token found. Please login again.");
  }

  const res = await fetch(`${BASE_URL}/api/auth/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    clearTokens();
    throw new Error(data?.detail || "Refresh token invalid/expired. Login again.");
  }

  // ✅ SAVE BOTH (refresh might be rotated)
  setTokens({ access: data.access, refresh: data.refresh });
  return data.access;
}

// ---------------- core fetch ----------------
export async function apiFetch(
  path,
  { method = "GET", body, auth = false } = {}
) {
  const doRequest = async (tokenOverride) => {
    const headers = { "Content-Type": "application/json" };

    if (auth) {
      const token = tokenOverride || getAccessToken();
      if (token) headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const contentType = res.headers.get("content-type");
    const data =
      contentType && contentType.includes("application/json")
        ? await res.json().catch(() => null)
        : await res.text().catch(() => "");

    return { res, data };
  };

  // 1) First attempt
  let { res, data } = await doRequest();

  // 2) If unauthorized, refresh once (LOCKED) + retry once
  if (auth && res.status === 401) {
    if (!refreshPromise) {
      refreshPromise = refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
    }

    const newAccess = await refreshPromise;
    ({ res, data } = await doRequest(newAccess));
  }

  if (!res.ok) {
    const message =
      data?.detail ||
      data?.scheduled_for?.[0] ||
      data?.service?.[0] ||
      (typeof data === "string" ? data : JSON.stringify(data));

    // if we still get 401 after refresh, kill tokens
    if (res.status === 401) clearTokens();

    throw new Error(message);
  }

  return data;
}

// ---------------- endpoints ----------------
export function loginRequest(username, password) {
  return apiFetch("/api/auth/login/", {
    method: "POST",
    body: { username, password },
    auth: false,
  });
}

export function getServices() {
  return apiFetch("/api/services/", { auth: false });
}

export function getBookings() {
  return apiFetch("/api/bookings/", { auth: true });
}

export function createBooking({ service, scheduled_for, note }) {
  return apiFetch("/api/bookings/", {
    method: "POST",
    body: { service, scheduled_for, note },
    auth: true,
  });
}

export function bookingAction(id, action) {
  return apiFetch(`/api/bookings/${id}/${action}/`, {
    method: "POST",
    auth: true,
  });
}
