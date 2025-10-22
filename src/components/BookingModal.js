import React, { useState } from "react";
import axios from "axios";

const API_BASE = "https://travel-app-1-1lq9.onrender.com";

export default function BookingModal({ selected, onClose }) {
  const [name, setName] = useState("");
  const [days, setDays] = useState("");

  const handleBook = async () => {
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
    } catch (error) {
      console.error("🔥 Booking error:", error.response?.data || error.message);
      alert("❌ Booking error — please check backend or login again.");
    }
  };

  if (!selected) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center backdrop-blur-sm z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl w-[420px]">
        <h2 className="text-2xl font-semibold mb-4 text-blue-700 dark:text-blue-300 text-center">
          Book your trip to {selected.name}
        </h2>
        <input
          className="border rounded p-2 w-full mb-3"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border rounded p-2 w-full mb-3"
          type="number"
          placeholder="Number of days"
          value={days}
          onChange={(e) => setDays(e.target.value)}
        />
        <div className="flex justify-between">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">
            Cancel
          </button>
          <button
            onClick={handleBook}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
