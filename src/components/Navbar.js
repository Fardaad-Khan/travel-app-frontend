import React from "react";

export default function Navbar({
  darkMode,
  toggleDarkMode,
  onViewBookings,
  onLogout,
}) {
  return (
    <nav
      className={`w-full px-8 py-4 flex justify-between items-center shadow-md ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
      }`}
    >
      <h1 className="text-2xl font-bold tracking-wide text-blue-600 dark:text-blue-300">
        🌍 Travel Explorer
      </h1>

      <div className="flex gap-5 items-center text-sm font-medium">
        <button
          onClick={onViewBookings}
          className="hover:text-blue-600 dark:hover:text-blue-400 transition"
        >
          My Bookings
        </button>

        <button
          onClick={toggleDarkMode}
          className="px-3 py-1 border rounded-lg hover:bg-blue-100 dark:hover:bg-gray-700 transition"
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>

        <button
          onClick={onLogout}
          className="px-4 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
