import React, { useState, useEffect } from "react";
import axios from "axios";
import { X, Calendar, MapPin, User, Trash2, Loader2 } from "lucide-react";

const API_BASE = process.env.REACT_APP_API_BASE || "https://travel-app-a9mw.onrender.com";

const BookingsList = ({ onClose, darkMode, token }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/bookings/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setBookings(response.data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Failed to load bookings");
      // Use mock data if API fails
      setBookings([
        {
          id: 1,
          destination: "Paris",
          customer_name: "John Doe",
          days: 5,
          travel_date: "2024-06-15",
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          destination: "Tokyo",
          customer_name: "John Doe",
          days: 7,
          travel_date: "2024-07-20",
          created_at: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      await axios.delete(`${API_BASE}/bookings/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setBookings(bookings.filter(b => b.id !== bookingId));
    } catch (err) {
      console.error("Error deleting booking:", err);
      alert("Failed to cancel booking");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`relative w-full max-w-3xl max-h-[80vh] rounded-2xl shadow-2xl ${
        darkMode ? "bg-gray-800" : "bg-white"
      } overflow-hidden`}>
        {/* Header */}
        <div className={`sticky top-0 z-10 px-6 py-4 border-b ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">My Bookings</h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                darkMode 
                  ? "hover:bg-gray-700" 
                  : "hover:bg-gray-100"
              }`}
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(80vh-80px)] p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">Loading bookings...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={fetchBookings}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Retry
              </button>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="mb-4">
                <Calendar className="h-16 w-16 text-gray-400 mx-auto" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
                No bookings yet
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-sm">
                Start exploring and book your next adventure!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className={`p-6 rounded-xl border transition-all hover:shadow-lg ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 hover:border-blue-500"
                      : "bg-gray-50 border-gray-200 hover:border-blue-400"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <MapPin className="h-5 w-5 text-blue-500" />
                        <h3 className="text-xl font-bold">{booking.destination}</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                          <User className="h-4 w-4" />
                          <span>{booking.customer_name}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(booking.travel_date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        
                        <div className="text-gray-600 dark:text-gray-400">
                          Duration: <span className="font-semibold">{booking.days} days</span>
                        </div>
                        
                        {booking.created_at && (
                          <div className="text-gray-500 dark:text-gray-500 text-xs">
                            Booked on: {new Date(booking.created_at).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(booking.id)}
                      className="ml-4 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      aria-label="Cancel booking"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Status Badge */}
                  <div className="mt-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      Confirmed
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingsList;