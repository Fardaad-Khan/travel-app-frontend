import React from "react";
import { MapPin, Star, Clock, DollarSign } from "lucide-react";

const DestinationGrid = ({ destinations, onBook, darkMode }) => {
  if (destinations.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {destinations.map((destination, index) => (
        <div
          key={destination.id || index}
          className={`group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
          style={{
            animation: `slideUp 0.5s ease-out ${index * 0.1}s both`
          }}
        >
          {/* Image Container */}
          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-400 to-purple-600">
            <img
              src={destination.image || `https://source.unsplash.com/800x600/?${destination.name},landmark`}
              alt={destination.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Rating Badge */}
            {destination.rating && (
              <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-1 shadow-lg">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="text-sm font-semibold">{destination.rating}</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            <h3 className="text-2xl font-bold mb-2">{destination.name}</h3>
            
            {/* Location */}
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 mb-4">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">
                {destination.lat.toFixed(4)}, {destination.lng.toFixed(4)}
              </span>
            </div>

            {/* Price and Duration */}
            <div className="flex items-center justify-between mb-6">
              {destination.price && (
                <div className="flex items-center space-x-1">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="font-bold text-lg">{destination.price}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">/person</span>
                </div>
              )}
              
              {destination.duration && (
                <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">{destination.duration}</span>
                </div>
              )}
            </div>

            {/* Book Button */}
            <button
              onClick={() => onBook(destination)}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Book Now
            </button>
          </div>
        </div>
      ))}

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default DestinationGrid;