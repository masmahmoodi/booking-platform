import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { loginRequest, meRequest } from "../api"
import { setRole, setUserId } from "../auth/auth"

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  function handleChange(e) {
    const { name, value } = e.target
    setForm((p) => ({ ...p, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const data = await loginRequest(form.username, form.password)

      setRole(data.role)
      setUserId(data.id)
      if (data.role === "PROVIDER") navigate("/provider")
      else navigate("/services")
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        "Login failed. Check username/password."
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-6">
        <h1 className="text-3xl font-bold mb-2">Sign in to your account</h1>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              className="w-full border rounded-md p-2"
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
              className="w-full border rounded-md p-2"
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
            className="w-full bg-black text-white rounded-md p-2 hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px bg-gray-200 flex-1" />
          <div className="text-xs text-gray-500">or</div>
          <div className="h-px bg-gray-200 flex-1" />
        </div>

        <div className="text-center">
          <div className="text-sm text-gray-600 mb-2">Don’t have an account?</div>
          <button
            onClick={() => navigate("/register")}
            className="w-full border rounded-md py-2 font-medium hover:bg-gray-50"
          >
            Create an account
          </button>
        </div>
      </div>
    </div>
  )
}
