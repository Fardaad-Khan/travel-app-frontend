import React from "react";

export default function Navbar({
  darkMode,
  toggleDarkMode,
  onViewBookings,
  onLogout,
}) {
  return (
    <nav
      className={`w-full px-8 py-4 flex justify-between items-center shadow-lg sticky top-0 z-50 transition-colors duration-300 ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-r from-blue-400 to-purple-500 text-white"
      }`}
    >
      {/* Logo / Title */}
      <h1 className="text-2xl md:text-3xl font-bold tracking-wider drop-shadow-lg flex items-center gap-2">
        🌍 Travel Next
      </h1>

      {/* Nav Buttons */}
      <div className="flex gap-4 md:gap-6 items-center text-sm md:text-base font-medium">
        <button
          onClick={onViewBookings}
          className={`px-3 py-1 rounded-lg hover:scale-105 transition transform ${
            darkMode
              ? "hover:bg-gray-700"
              : "hover:bg-white hover:text-purple-600"
          }`}
        >
          My Bookings
        </button>

        <button
          onClick={toggleDarkMode}
          className={`px-3 py-1 border rounded-lg hover:scale-105 transition transform ${
            darkMode
              ? "border-gray-500 hover:bg-gray-700"
              : "border-white hover:bg-white hover:text-purple-600"
          }`}
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>

        <button
          onClick={onLogout}
          className="px-4 py-1 bg-red-500 hover:bg-red-600 rounded-lg text-white transition transform hover:scale-105 shadow-md"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
