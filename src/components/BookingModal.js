import React, { useState } from "react";
import axios from "axios";

const API_BASE = "https://travel-app-1-1lq9.onrender.com";

function BookingModal({ selected, onClose, darkMode }) {
  const [customerName, setCustomerName] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [travelers, setTravelers] = useState(1);
  const [specialRequests, setSpecialRequests] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE}/bookings/`,
        {
          destination: selected.name,
          days: parseInt(selected.duration.split(" ")[0]),
          customer_name: customerName,
          travel_date: travelDate,
          travelers,
          special_requests: specialRequests,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(true);
      setTimeout(onClose, 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className={`p-8 rounded-2xl max-w-md w-full ${darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-800"} shadow-2xl`}>
        <h2 className="text-2xl font-bold mb-6">Book {selected.name}</h2>
        {success ? (
          <p className="text-green-500 mb-4">Booking successful!</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Your Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className={`w-full p-3 mb-4 rounded-lg ${darkMode ? "bg-gray-700 text-gray-100" : "bg-gray-100 text-gray-800"}`}
              required
            />
            <input
              type="date"
              placeholder="Travel Date"
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
              className={`w-full p-3 mb-4 rounded-lg ${darkMode ? "bg-gray-700 text-gray-100" : "bg-gray-100 text-gray-800"}`}
            />
            <input
              type="number"
              placeholder="Number of Travelers"
              value={travelers}
              min={1}
              onChange={(e) => setTravelers(parseInt(e.target.value))}
              className={`w-full p-3 mb-4 rounded-lg ${darkMode ? "bg-gray-700 text-gray-100" : "bg-gray-100 text-gray-800"}`}
              required
            />
            <textarea
              placeholder="Special Requests"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              className={`w-full p-3 mb-4 rounded-lg ${darkMode ? "bg-gray-700 text-gray-100" : "bg-gray-100 text-gray-800"}`}
              rows={3}
            />
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="flex justify-end gap-4">
              <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-500 text-white rounded-lg">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded-lg">
                {loading ? "Booking..." : "Confirm Booking"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default BookingModal;