import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { csrfRequest, loginRequest, meRequest } from "../api";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // ✅ 1) Get CSRF cookie first
      await csrfRequest();

      // ✅ 2) Now login (session cookie will be set)
      await loginRequest(form.username, form.password);

      // ✅ 3) Ask who am I (to get role/id)
      const me = await meRequest();

      if (me.role === "PROVIDER") navigate("/provider");
      else navigate("/services");
    } catch (err) {
      // simplest readable error
      setError(err?.response?.data?.detail || "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-8">
        <h1 className="text-3xl font-bold text-center mb-6">Sign in to your account</h1>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              className="w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-black/20"
              name="username"
              value={form.username}
              onChange={handleChange}
              autoComplete="username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              className="w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-black/20"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-black text-white rounded-md p-3 hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px bg-gray-200 flex-1" />
          <span className="text-xs text-gray-500">or</span>
          <div className="h-px bg-gray-200 flex-1" />
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600 mb-3">Don’t have an account?</p>
          <button
            onClick={() => navigate("/register")}
            className="w-full border rounded-md p-3 font-medium hover:bg-gray-50"
            type="button"
          >
            Create an account
          </button>
        </div>
      </div>
    </div>
  );
}
