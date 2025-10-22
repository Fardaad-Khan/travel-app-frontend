import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "https://travel-app-1-1lq9.onrender.com";

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
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center backdrop-blur-sm z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-lg p-6 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            My Bookings
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 transition-colors text-2xl"
          >
            ✖
          </button>
        </div>

        {/* Loading / Empty */}
        {loading ? (
          <p className="text-gray-500 dark:text-gray-400 text-center">
            Loading your bookings...
          </p>
        ) : bookings.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center">
            No bookings yet. Start planning your next trip!
          </p>
        ) : (
          <ul className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {bookings.map((b) => (
              <li
                key={b.id}
                className="flex flex-col p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700"
              >
                <p className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                  {b.destination}
                </p>
                <div className="flex justify-between mt-1 text-gray-600 dark:text-gray-400 text-sm">
                  <span>{b.days} {b.days > 1 ? "days" : "day"}</span>
                  <span>For {b.customer_name}</span>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Footer */}
        <div className="mt-6 text-center text-gray-500 dark:text-gray-400 text-sm">
          Showing your latest trips
        </div>
      </div>
    </div>
  );
}
