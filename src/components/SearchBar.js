import React from "react";
import { Search, Filter } from "lucide-react";

export const SearchBar = ({ searchQuery, setSearchQuery, sortBy, setSortBy, darkMode }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
      {/* Search Input */}
      <div className="flex-1 relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search destinations..."
          className={`w-full pl-12 pr-4 py-3 rounded-xl transition-all ${
            darkMode
              ? "bg-gray-800 text-gray-200 placeholder-gray-500 focus:bg-gray-700"
              : "bg-white placeholder-gray-400"
          } shadow-lg focus:shadow-xl focus:ring-2 focus:ring-blue-500/50 focus:outline-none`}
        />
      </div>

      {/* Sort Dropdown */}
      <div className="relative">
        <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className={`pl-12 pr-8 py-3 rounded-xl appearance-none cursor-pointer transition-all ${
            darkMode
              ? "bg-gray-800 text-gray-200 focus:bg-gray-700"
              : "bg-white"
          } shadow-lg hover:shadow-xl focus:shadow-xl focus:ring-2 focus:ring-blue-500/50 focus:outline-none`}
        >
          <option value="name">Sort by Name</option>
          <option value="price">Sort by Price</option>
          <option value="rating">Sort by Rating</option>
        </select>
      </div>
    </div>
  );
};

export default SearchBar;