import React from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import Login from "./pages/Login"
import Services from "./pages/Services"
import Bookings from "./pages/Bookings"
import ProviderDashboard from "./pages/ProviderDashboard"
import NotFound from "./pages/NotFound"

import ProtectedRoute from "./auth/ProtectedRoute"
import RoleRoute from "./auth/RoleRoute"
import ProviderServices from "./pages/ProviderServices";
import Register from "./pages/Register";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/services" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/services" element={<Services />} />

        <Route
          path="/bookings"
          element={
            <ProtectedRoute>
              <RoleRoute allow={["CUSTOMER"]}>
                <Bookings />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/provider"
          element={
            <ProtectedRoute>
              <RoleRoute allow={["PROVIDER"]}>
                <ProviderDashboard />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
            path="/provider/services"
            element={
              <ProtectedRoute>
                <RoleRoute allow={["PROVIDER"]}>
                  <ProviderServices />
                </RoleRoute>
              </ProtectedRoute>
            }
          />

        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  )
}
