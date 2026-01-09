import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getServices } from "../api"
import { getRole, logout } from "../auth/auth"

export default function Services() {
  const navigate = useNavigate()
  const role = getRole()

  const [items, setItems] = useState([])
  const [error, setError] = useState("")

  const [search, setSearch] = useState("")
  const [ordering, setOrdering] = useState("-created_at")
  const [page, setPage] = useState(1)

  const [count, setCount] = useState(0)
  const [next, setNext] = useState(null)
  const [previous, setPrevious] = useState(null)

  async function load() {
    setError("")
    try {
      const data = await getServices({ search, ordering, page })
      setItems(data?.results ?? data ?? [])
      setCount(data?.count ?? 0)
      setNext(data?.next ?? null)
      setPrevious(data?.previous ?? null)
    } catch (e) {
      setError(e.message)
    }
  }

  useEffect(() => {
    load()
  }, [search, ordering, page])

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Services</h1>

        <div className="flex gap-2">
          {role === "CUSTOMER" && (
            <button onClick={() => navigate("/bookings")} className="border rounded-md px-4 py-2">
              My Bookings
            </button>
          )}

          {role === "PROVIDER" && (
            <>
              <button onClick={() => navigate("/provider")} className="border rounded-md px-4 py-2">
                Provider Dashboard
              </button>
              <button onClick={() => navigate("/provider/services")} className="border rounded-md px-4 py-2">
                My Services
              </button>
            </>
          )}

          <button
            onClick={() => {
              logout()
              navigate("/login")
            }}
            className="bg-black text-white rounded-md px-4 py-2"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow border p-4 mb-4 flex flex-col md:flex-row gap-3">
        <input
          className="border rounded-md p-2 flex-1"
          placeholder="Search services..."
          value={search}
          onChange={(e) => {
            setPage(1)
            setSearch(e.target.value)
          }}
        />

        <select
          className="border rounded-md p-2"
          value={ordering}
          onChange={(e) => {
            setPage(1)
            setOrdering(e.target.value)
          }}
        >
          <option value="-created_at">Newest</option>
          <option value="created_at">Oldest</option>
          <option value="price">Price: Low</option>
          <option value="-price">Price: High</option>
        </select>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      {/* List */}
      <div className="bg-white rounded-xl shadow border">
        <div className="p-4 border-b font-semibold">Available Services ({count})</div>

        <div className="p-4 space-y-4">
          {items.length === 0 ? (
            <p className="text-gray-500">No services found.</p>
          ) : (
            items.map((s) => (
              <div key={s.id} className="border rounded-lg p-4">
                <div className="font-semibold text-lg">{s.title}</div>
                <div className="text-gray-600">{s.description}</div>
                <div className="mt-2 text-sm">${s.price} • {s.duration_minutes} min</div>
                <div className="text-xs text-gray-500 mt-1">Service ID: {s.id}</div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="p-4 border-t flex items-center justify-between">
          <button
            disabled={!previous}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="border rounded-md px-3 py-1 disabled:opacity-50"
          >
            Previous
          </button>

          <div className="text-sm text-gray-600">Page {page}</div>

          <button
            disabled={!next}
            onClick={() => setPage((p) => p + 1)}
            className="border rounded-md px-3 py-1 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
