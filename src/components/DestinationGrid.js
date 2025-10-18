import React from "react";

export default function DestinationGrid({ destinations, onBook }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-11/12 mt-10">
      {destinations.map((place, idx) => (
        <div
          key={idx}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden hover:scale-105 transition-transform duration-200"
        >
          <img
            src={`https://source.unsplash.com/400x250/?${place.name}`}
            alt={place.name}
            className="w-full h-52 object-cover"
          />
          <div className="p-5">
            <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-gray-100">{place.name}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-3">Lat: {place.lat}, Lng: {place.lng}</p>
            <button
              onClick={() => onBook(place)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Book
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
