import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { loginRequest, setTokens } from "../api"
import { setRole } from "../auth/auth"

export default function Login() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "CUSTOMER", 
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const data = await loginRequest(form.username, form.password)

     
      setTokens(data)

      
      setRole(form.role)

      
      if (form.role === "PROVIDER") {
        navigate("/provider")
      } else {
        navigate("/services")
      }
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.message ||
        "Login failed. Check username/password."
      setError(msg)
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
              placeholder="e.g. ahmad"
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
              placeholder="••••••••"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select
              className="w-full border rounded-md p-2"
              name="role"
              value={form.role}
              onChange={handleChange}
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
  )
}
