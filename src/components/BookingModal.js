import React, { useState } from "react";
import axios from "axios";

const API_BASE = "https://travel-app-a9mw.onrender.com";

export default function BookingModal({ selected, onClose }) {
  const [name, setName] = useState("");
  const [days, setDays] = useState("");

  const handleBook = async () => {
    try {
      const payload = { destination: selected.name, days: Number(days), customer_name: name };
      await axios.post(`${API_BASE}/bookings/`, payload);
      alert("Booking confirmed!");
      onClose();
    } catch (error) {
      console.error(error);
      alert("Error booking trip!");
    }
  };

  if (!selected) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-xl w-96">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
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
          <button onClick={handleBook} className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
