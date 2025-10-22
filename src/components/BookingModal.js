import React, { useState } from "react";
import axios from "axios";

const API_BASE = "https://travel-app-1-1lq9.onrender.com";

export default function BookingModal({ selected, onClose }) {
  const [name, setName] = useState("");
  const [days, setDays] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!selected) return null;

  const handleBook = async () => {
    if (!name || !days) {
      setError("Please fill in both fields!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const payload = {
        destination: selected.name,
        days: Number(days),
        customer_name: name,
      };

      await axios.post(`${API_BASE}/bookings/`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("✅ Booking saved successfully!");
      onClose();
    } catch (err) {
      console.error("🔥 Booking error:", err.response?.data || err.message);
      setError("❌ Booking error — please check backend or login again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center backdrop-blur-sm z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6 relative transition-colors">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-700 dark:text-gray-200 hover:text-red-500 dark:hover:text-red-400 font-bold text-lg transition-colors"
        >
          ✖
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold text-center mb-4 text-blue-600 dark:text-blue-300">
          Book your trip to {selected.name}
        </h2>

        {/* Error Message */}
        {error && (
          <p className="text-red-600 dark:text-red-400 mb-3 text-center font-medium">
            {error}
          </p>
        )}

        {/* Name Input */}
        <input
          className="w-full p-3 mb-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 transition-colors"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Days Input */}
        <input
          className="w-full p-3 mb-4 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 transition-colors"
          type="number"
          placeholder="Number of Days"
          value={days}
          onChange={(e) => setDays(e.target.value)}
          min="1"
        />

        {/* Buttons */}
        <div className="flex justify-between mt-2">
          <button
            onClick={onClose}
            className="px-6 py-2 border rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleBook}
            disabled={loading}
            className={`px-6 py-2 rounded-lg text-white ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all"
            }`}
          >
            {loading ? "Booking..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}
