import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { loginRequest, meRequest, setTokens } from "../api"
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
      const tokens = await loginRequest(form.username, form.password)
      setTokens(tokens)

      const me = await meRequest()
      setRole(me.role)
      setUserId(me.id)

      if (me.role === "PROVIDER") navigate("/provider")
      else navigate("/services")
    } catch (err) {
      setError(err.message || "Login failed.")
    } finally {
      setLoading(false)
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
      </div>
      <p className="text-sm mt-4">
  Don’t have an account?{" "}
  <button
    onClick={() => navigate("/register")}
    className="underline"
  >
    Register
  </button>
</p>

    </div>
    
  )
}
