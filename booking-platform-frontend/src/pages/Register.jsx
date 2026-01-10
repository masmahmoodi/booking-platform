import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { csrfRequest, registerRequest } from "../api"

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

  useEffect(() => {
    csrfRequest().catch(() => {})
  }, [])

  function handleChange(e) {
    const { name, value } = e.target
    setForm((p) => ({ ...p, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await registerRequest(form)
      navigate("/login")
    } catch (err) {
      setError(err.message || "Registration failed.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-center mb-6">Create account</h1>

          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <input className="w-full border rounded-md px-3 py-2" name="username" value={form.username} onChange={handleChange} required />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input className="w-full border rounded-md px-3 py-2" name="email" value={form.email} onChange={handleChange} required />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input className="w-full border rounded-md px-3 py-2" name="password" type="password" value={form.password} onChange={handleChange} required />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Role</label>
              <select className="w-full border rounded-md px-3 py-2" name="role" value={form.role} onChange={handleChange}>
                <option value="CUSTOMER">Customer</option>
                <option value="PROVIDER">Provider</option>
              </select>
            </div>

            <button disabled={loading} className="w-full bg-black text-white rounded-md py-2 font-medium disabled:opacity-60">
              {loading ? "Creating..." : "Register"}
            </button>
          </form>

          <p className="text-sm text-center text-gray-600 mt-6">
            Already have an account?{" "}
            <button onClick={() => navigate("/login")} className="font-medium underline">
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
