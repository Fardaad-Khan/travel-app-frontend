import React from "react";

export default function DestinationGrid({ destinations, onBook }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-11/12 mt-10 mx-auto">
      {destinations.map((place, idx) => (
        <div
          key={idx}
          className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden transform hover:scale-105 hover:shadow-2xl transition-all duration-300"
        >
          <div className="relative h-52">
            <img
              src={`https://source.unsplash.com/400x250/?${place.name}`}
              alt={place.name}
              className="w-full h-full object-cover rounded-t-3xl"
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent rounded-t-3xl"></div>
            <h2 className="absolute bottom-4 left-4 text-white text-xl font-bold drop-shadow-lg">
              {place.name}
            </h2>
          </div>

          <div className="p-5 flex flex-col justify-between h-32">
            <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm">
              Latitude: {place.lat}, Longitude: {place.lng}
            </p>
            <button
              onClick={() => onBook(place)}
              className="mt-auto bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold px-4 py-2 rounded-xl hover:scale-105 hover:from-blue-600 hover:to-purple-700 transition transform shadow-md"
            >
              Book Now
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
