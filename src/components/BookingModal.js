import React, { useState } from "react";
import axios from "axios";
import { X, Calendar, User, Hash, MapPin, Loader2 } from "lucide-react";

const API_BASE = process.env.REACT_APP_API_BASE || "https://travel-app-a9mw.onrender.com";

const BookingModal = ({ selected, onClose, darkMode, token, user }) => {
  const [formData, setFormData] = useState({
    customerName: user?.username || "",
    days: 5,
    travelDate: "",
    travelers: 1,
    specialRequests: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.customerName || !formData.travelDate) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `${API_BASE}/bookings/create`,
        {
          destination: selected.name,
          customer_name: formData.customerName,
          days: parseInt(formData.days),
          travel_date: formData.travelDate,
          travelers: parseInt(formData.travelers),
          special_requests: formData.specialRequests
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (err) {
      console.error("Booking error:", err);
      setError(err.response?.data?.message || "Failed to create booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className={`relative w-full max-w-md rounded-2xl shadow-2xl transition-all transform ${
        darkMode ? "bg-gray-800" : "bg-white"
      } ${success ? "scale-95" : "scale-100"}`}>
        {/* Header */}
        <div className={`relative h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-t-2xl`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5 text-white" />
          </button>
          <div className="absolute bottom-4 left-6 text-white">
            <h2 className="text-2xl font-bold">Book Your Trip</h2>
            <div className="flex items-center space-x-2 mt-1">
              <MapPin className="h-4 w-4" />
              <span>{selected.name}</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Success Message */}
          {success && (
            <div className="p-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg">
              ✅ Booking confirmed! Redirecting...
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg">
              {error}
            </div>
          )}

          {/* Customer Name */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium mb-2">
              <User className="h-4 w-4" />
              <span>Your Name *</span>
            </label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                darkMode
                  ? "bg-gray-700 border-gray-600 focus:border-blue-500"
                  : "bg-gray-50 border-gray-300 focus:border-blue-500"
              } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Travel Date */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium mb-2">
              <Calendar className="h-4 w-4" />
              <span>Travel Date *</span>
            </label>
            <input
              type="date"
              name="travelDate"
              value={formData.travelDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                darkMode
                  ? "bg-gray-700 border-gray-600 focus:border-blue-500"
                  : "bg-gray-50 border-gray-300 focus:border-blue-500"
              } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
              required
            />
          </div>

          {/* Number of Days and Travelers */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium mb-2">
                <Hash className="h-4 w-4" />
                <span>Days</span>
              </label>
              <input
                type="number"
                name="days"
                value={formData.days}
                onChange={handleChange}
                min="1"
                max="30"
                className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 focus:border-blue-500"
                    : "bg-gray-50 border-gray-300 focus:border-blue-500"
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
              />
            </div>

            <div>
              <label className="flex items-center space-x-2 text-sm font-medium mb-2">
                <User className="h-4 w-4" />
                <span>Travelers</span>
              </label>
              <input
                type="number"
                name="travelers"
                value={formData.travelers}
                onChange={handleChange}
                min="1"
                max="10"
                className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 focus:border-blue-500"
                    : "bg-gray-50 border-gray-300 focus:border-blue-500"
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
              />
            </div>
          </div>

          {/* Special Requests */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Special Requests (Optional)
            </label>
            <textarea
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleChange}
              rows="3"
              className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                darkMode
                  ? "bg-gray-700 border-gray-600 focus:border-blue-500"
                  : "bg-gray-50 border-gray-300 focus:border-blue-500"
              } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
              placeholder="Any special requirements or preferences..."
            />
          </div>

          {/* Price Summary */}
          <div className={`p-4 rounded-lg ${
            darkMode ? "bg-gray-700" : "bg-gray-100"
          }`}>
            <div className="flex justify-between items-center">
              <span className="text-sm">Estimated Total:</span>
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {selected.price || "$0"} × {formData.travelers} traveler{formData.travelers > 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || success}
            className={`w-full py-3 rounded-xl font-semibold transition-all transform shadow-lg ${
              loading || success
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:scale-105 text-white"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center space-x-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Processing...</span>
              </span>
            ) : success ? (
              "Booking Confirmed! ✅"
            ) : (
              "Confirm Booking"
            )}
          </button>
        </form>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default BookingModal;