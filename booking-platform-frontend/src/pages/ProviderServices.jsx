import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { createService, deleteService, getServices, updateService } from "../api"
import { getUserId } from "../auth/auth"

export default function ProviderServices() {
  const navigate = useNavigate()
  const myId = getUserId()

  const [items, setItems] = useState([])
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    duration_minutes: "",
  })

  const [editingId, setEditingId] = useState(null)

  async function load() {
    setError("")
    try {
      const data = await getServices()
      const all = data?.results ?? data ?? []
      // show only my services if we have myId
      const mine = myId ? all.filter((s) => s.provider === myId) : all
      setItems(mine)
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

  function startEdit(service) {
    setEditingId(service.id)
    setForm({
      title: service.title,
      description: service.description,
      price: service.price,
      duration_minutes: service.duration_minutes,
    })
  }

  function resetForm() {
    setEditingId(null)
    setForm({ title: "", description: "", price: "", duration_minutes: "" })
  }

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    setError("")

    try {
      const payload = {
        title: form.title,
        description: form.description,
        price: form.price,
        duration_minutes: Number(form.duration_minutes),
      }

      if (editingId) await updateService(editingId, payload)
      else await createService(payload)

      resetForm()
      await load()
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  async function onDelete(id) {
    setError("")
    try {
      await deleteService(id)
      await load()
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">My Services</h1>

        <button onClick={() => navigate("/services")} className="border rounded-md px-4 py-2">
          Back to Services
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      <div className="bg-white rounded-xl shadow border p-4 mb-6">
        <h2 className="text-xl font-semibold mb-3">
          {editingId ? `Edit Service #${editingId}` : "Create Service"}
        </h2>

        <form onSubmit={submit} className="grid gap-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input className="w-full border rounded-md p-2" name="title" value={form.title} onChange={onChange} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Price</label>
              <input className="w-full border rounded-md p-2" name="price" value={form.price} onChange={onChange} required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <input className="w-full border rounded-md p-2" name="description" value={form.description} onChange={onChange} required />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
              <input className="w-full border rounded-md p-2" name="duration_minutes" value={form.duration_minutes} onChange={onChange} required />
            </div>
          </div>

          <div className="flex gap-2">
            <button disabled={busy} className="bg-black text-white rounded-md px-4 py-2 disabled:opacity-60">
              {busy ? "Saving..." : editingId ? "Update" : "Create"}
            </button>

            {editingId && (
              <button type="button" onClick={resetForm} className="border rounded-md px-4 py-2">
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow border">
        <div className="p-4 border-b font-semibold">Your Services</div>

        <div className="p-4 space-y-4">
          {items.length === 0 ? (
            <p className="text-gray-500">No services yet.</p>
          ) : (
            items.map((s) => (
              <div key={s.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-semibold text-lg">{s.title}</div>
                    <div className="text-gray-600">{s.description}</div>
                    <div className="mt-2 text-sm">${s.price} • {s.duration_minutes} min</div>
                    <div className="text-xs text-gray-500 mt-1">Service ID: {s.id}</div>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => startEdit(s)} className="border rounded-md px-3 py-1">
                      Edit
                    </button>
                    <button onClick={() => onDelete(s.id)} className="border rounded-md px-3 py-1">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
