import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { bookingAction, getBookings } from "../api"

export default function ProviderDashboard() {
  const navigate = useNavigate()

  const [items, setItems] = useState([])
  const [error, setError] = useState("")

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

  async function act(id, action) {
    setError("")
    try {
      await bookingAction(id, action)
      await load()
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Provider Dashboard</h1>
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

      <div className="bg-white rounded-xl shadow border p-4">
        <h2 className="text-xl font-semibold mb-2">Bookings for My Services</h2>

        {items.length === 0 ? (
          <p className="text-gray-500">No bookings found.</p>
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

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => act(b.id, "approve")}
                    className="border rounded-md px-3 py-1"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => act(b.id, "reject")}
                    className="border rounded-md px-3 py-1"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => act(b.id, "complete")}
                    className="border rounded-md px-3 py-1"
                  >
                    Complete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
