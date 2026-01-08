
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getServices } from "../api";
import { getRole, logout } from "../auth/auth";

export default function Services() {
  const navigate = useNavigate();
  const role = getRole(); 

  const [services, setServices] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadServices() {
      try {
        const data = await getServices();
        
        setServices(data?.results ?? data ?? []);
      } catch (err) {
        setError(err.message || "Failed to load services");
      }
    }

    loadServices();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
     
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Services</h1>

        <div className="flex gap-2">
          
          {role === "CUSTOMER" && (
            <button
              onClick={() => navigate("/bookings")}
              className="border rounded-md px-4 py-2"
            >
              My Bookings
            </button>
          )}

         
          {role === "PROVIDER" && (
            <>
              <button
                onClick={() => navigate("/provider")}
                className="border rounded-md px-4 py-2"
              >
                Provider Dashboard
              </button>

              <button
                onClick={() => navigate("/provider/services")}
                className="border rounded-md px-4 py-2"
              >
                My Services
              </button>
            </>
          )}
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="bg-black text-white rounded-md px-4 py-2"
          >
            Logout
          </button>
        </div>
      </div>
      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <div className="bg-white rounded-xl shadow border">
        <div className="p-4 border-b font-semibold">
          Available Services
        </div>

        <div className="p-4 space-y-4">
          {services.length === 0 ? (
            <p className="text-gray-500">No services available.</p>
          ) : (
            services.map((service) => (
              <div
                key={service.id}
                className="border rounded-lg p-4"
              >
                <div className="font-semibold text-lg">
                  {service.title}
                </div>

                <div className="text-gray-600">
                  {service.description}
                </div>

                <div className="mt-2 text-sm">
                  ${service.price} • {service.duration_minutes} min
                </div>

                <div className="text-xs text-gray-500 mt-1">
                  Service ID: {service.id}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
