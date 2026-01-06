// src/auth/RoleRoute.jsx
import React from "react"
import { Navigate } from "react-router-dom"
import { isLoggedIn, getRole } from "./auth"

export default function RoleRoute({ allow = [], children }) {
  if (!isLoggedIn()) return <Navigate to="/login" replace />

  const role = getRole()
  if (allow.length > 0 && !allow.includes(role)) {
    return <Navigate to="/services" replace />
  }

  return children
}
