// src/auth/ProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { meRequest } from "../api"
export default function ProtectedRoute({ children }) {
  const [ok, setOk] = useState(null)

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        await meRequest()
        if (mounted) setOk(true);
      } catch {
        if (mounted) setOk(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  if (ok === null) return null
  return ok ? children : <Navigate to="/login" replace />;
}
