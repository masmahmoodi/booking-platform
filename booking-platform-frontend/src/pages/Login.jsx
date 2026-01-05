import React from "react"

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginRequest } from "../api";
import { setTokens, setRole } from "../auth/auth";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRoleState] = useState("CUSTOMER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginRequest(username, password);
      setTokens(data);

      // temporary: user selects role from dropdown
      setRole(role);

      // redirect based on role
      if (role === "PROVIDER") navigate("/provider");
      else navigate("/services");
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        "Login failed. Check username/password.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Login</h1>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              className="w-full border rounded-md p-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              className="w-full border rounded-md p-2"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select
              className="w-full border rounded-md p-2"
              value={role}
              onChange={(e) => setRoleState(e.target.value)}
            >
              <option value="CUSTOMER">CUSTOMER</option>
              <option value="PROVIDER">PROVIDER</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Temporary: choose the role you’re logging in as.
            </p>
          </div>

          <button
            disabled={loading}
            className="w-full bg-black text-white rounded-md p-2 hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
