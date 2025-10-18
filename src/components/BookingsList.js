import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "https://travel-app-a9mw.onrender.com";

export default function BookingsList({ onClose }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${API_BASE}/bookings/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setBookings(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching bookings:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center backdrop-blur-sm z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl w-[420px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-300">
            My Bookings
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500">
            ✖
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500 dark:text-gray-400">Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No bookings yet.</p>
        ) : (
          <ul className="space-y-3 max-h-80 overflow-y-auto">
            {bookings.map((b) => (
              <li
                key={b.id}
                className="p-3 border rounded-lg shadow-sm dark:border-gray-700"
              >
                <p className="font-semibold">{b.destination}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {b.days} days — for {b.customer_name}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
