import React from "react"
import { Link } from "react-router-dom"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white rounded-xl shadow p-8 text-center">
        <h1 className="text-2xl font-bold mb-2">404</h1>
        <p className="text-gray-600 mb-4">Page not found.</p>
        <Link to="/services" className="px-4 py-2 rounded-md bg-black text-white">
          Go to Services
        </Link>
      </div>
    </div>
  )
}
