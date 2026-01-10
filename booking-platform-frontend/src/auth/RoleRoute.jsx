// src/auth/RoleRoute.jsx
import React, { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import { meRequest } from "../api"

export default function RoleRoute({ allow = [], children }) {
  const [state, setState] = useState({ loading: true, ok: false })

  useEffect(() => {
    let mounted = true

    (async () => {
      try {
        const me = await meRequest()
        const ok = allow.includes(me.role)
        if (mounted) setState({ loading: false, ok })
      } catch {
        if (mounted) setState({ loading: false, ok: false })
      }
    })()

    return () => {
      mounted = false
    }
  }, [allow])

  if (state.loading) return null
  return state.ok ? children : <Navigate to="/services" replace />
}
