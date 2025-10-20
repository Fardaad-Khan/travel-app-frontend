import React from "react";
import { Globe2, Moon, Sun, LogOut, Calendar, User } from "lucide-react";

const Navbar = ({ darkMode, toggleDarkMode, onViewBookings, onLogout, user }) => {
  return (
    <nav className={`sticky top-0 z-50 backdrop-blur-md ${
      darkMode 
        ? "bg-gray-900/95 border-gray-700" 
        : "bg-white/95 border-gray-200"
    } border-b transition-all duration-300`}>
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <Globe2 className="h-8 w-8 text-blue-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Travel Explorer
            </span>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* User info */}
            {user && (
              <div className="hidden md:flex items-center space-x-2 text-sm">
                <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300">
                  Welcome, {user.username || user.email || "Traveler"}
                </span>
              </div>
            )}

            {/* My Bookings Button */}
            <button
              onClick={onViewBookings}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-md"
            >
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">My Bookings</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-all ${
                darkMode
                  ? "bg-gray-800 hover:bg-gray-700 text-yellow-400"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
              aria-label="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;