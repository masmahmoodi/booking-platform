
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { createBooking, getBookings } from "../api"

export default function Bookings() {
  const navigate = useNavigate()

  const [items, setItems] = useState([])
  const [form, setForm] = useState({ service: "", scheduled_for: "", note: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function load() {
    setError("")
    try {
      const data = await getBookings()
      setItems(data?.results ?? data ?? [])
    } catch (e) {
      setError(e.message)
    }
  }

  useEffect(() => {
    load()
  }, [])

  function onChange(e) {
    const { name, value } = e.target
    setForm((p) => ({ ...p, [name]: value }))
  }

  async function submit(e) {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const iso = form.scheduled_for
        ? new Date(form.scheduled_for).toISOString()
        : ""

      await createBooking({
        service: Number(form.service),
        scheduled_for: iso,
        note: form.note || "",
      })

      setForm({ service: "", scheduled_for: "", note: "" })
      await load()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Bookings</h1>
        <button
          onClick={() => navigate("/services")}
          className="border rounded-md px-4 py-2"
        >
          Back to Services
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow border p-4 mb-6">
        <h2 className="text-xl font-semibold mb-2">Create Booking</h2>
        <p className="text-sm text-gray-500 mb-4">
          Customer-only. Uses: <code>POST /api/bookings/</code>
        </p>

        <form onSubmit={submit} className="grid gap-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Service ID</label>
              <input
                className="w-full border rounded-md p-2"
                name="service"
                value={form.service}
                onChange={onChange}
                placeholder="e.g. 3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Scheduled For</label>
              <input
                className="w-full border rounded-md p-2"
                name="scheduled_for"
                value={form.scheduled_for}
                onChange={onChange}
                type="datetime-local"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Note (optional)</label>
            <input
              className="w-full border rounded-md p-2"
              name="note"
              value={form.note}
              onChange={onChange}
              placeholder="Anything you want..."
            />
          </div>

          <button
            disabled={loading}
            className="bg-black text-white rounded-md px-4 py-2 w-fit disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Booking"}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow border p-4">
        <h2 className="text-xl font-semibold mb-2">My Bookings</h2>

        {items.length === 0 ? (
          <p className="text-gray-500">No bookings yet.</p>
        ) : (
          <div className="space-y-3">
            {items.map((b) => (
              <div key={b.id} className="border rounded-lg p-3">
                <div className="font-semibold">
                  Booking #{b.id} • {b.status}
                </div>
                <div className="text-sm text-gray-600">
                  Service: {b.service} • Scheduled: {b.scheduled_for}
                </div>
                {b.note && <div className="text-sm mt-1">{b.note}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
