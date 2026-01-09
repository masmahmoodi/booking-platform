import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const API_BASE = "http://127.0.0.1:8000"

export default function Register() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    username: "",
    email: "",
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
      await axios.post(`${API_BASE}/api/auth/register/`, form)
      navigate("/login")
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Registration failed. Check your input."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Register</h1>

        {error && (
          <div className="mb-4 bg-red-50 text-red-700 p-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="username"
            placeholder="Username"
            className="w-full border p-2 rounded"
            onChange={handleChange}
            required
          />

          <input
            name="email"
            placeholder="Email"
            className="w-full border p-2 rounded"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full border p-2 rounded"
            onChange={handleChange}
            required
          />

          <select
            name="role"
            className="w-full border p-2 rounded"
            onChange={handleChange}
          >
            <option value="CUSTOMER">Customer</option>
            <option value="PROVIDER">Provider</option>
          </select>

          <button
            disabled={loading}
            className="w-full bg-black text-white p-2 rounded"
          >
            {loading ? "Creating..." : "Register"}
          </button>
        </form>

        <p className="text-sm mt-4">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  )
}
