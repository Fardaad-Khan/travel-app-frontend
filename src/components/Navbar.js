import React from "react";

export default function Navbar({ darkMode, toggleDarkMode, onViewBookings }) {
  return (
    <nav
      className={`w-full px-6 py-4 flex justify-between items-center shadow-md ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
      }`}
    >
      <h1 className="text-2xl font-bold">🌍 Travel Explorer</h1>
      <div className="flex gap-4 items-center">
        <button
          onClick={onViewBookings}
          className="px-4 py-1 border rounded-lg hover:bg-blue-100 dark:hover:bg-gray-700"
        >
          My Bookings
        </button>
        <button
          onClick={toggleDarkMode}
          className="px-3 py-1 border rounded-lg hover:bg-blue-100 dark:hover:bg-gray-700"
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>
    </nav>
  );
}
