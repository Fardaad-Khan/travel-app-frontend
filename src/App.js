import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./components/Navbar";
import DestinationGrid from "./components/DestinationGrid";
import BookingModal from "./components/BookingModal";
import LoginForm from "./components/LoginForm";
import BookingsList from "./components/BookingsList";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// ✅ Correct backend API
const API_BASE = "https://travel-app-1-1lq9.onrender.com";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function App() {
  const [destinations, setDestinations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [darkMode, setDarkMode] = useState(false);
  const [showBookings, setShowBookings] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ Load destinations with local images
  useEffect(() => {
    const dests = [
      {
        name: "Tokyo",
        lat: 35.6895,
        lng: 139.6917,
        image: process.env.PUBLIC_URL + "/photos/tokyo.jpg",
        description: "A vibrant mix of modern life and ancient tradition.",
      },
      {
        name: "Paris",
        lat: 48.8566,
        lng: 2.3522,
        image: process.env.PUBLIC_URL + "/photos/paris.jpg",
        description: "The city of lights, romance, and exquisite cuisine.",
      },
      {
        name: "Sydney",
        lat: -33.8688,
        lng: 151.2093,
        image: process.env.PUBLIC_URL + "/photos/sydney.jpg",
        description: "Harbor views, beaches, and the iconic Opera House.",
      },
      {
        name: "Dubai",
        lat: 25.2048,
        lng: 55.2708,
        image: process.env.PUBLIC_URL + "/photos/dubai.jpg",
        description: "A city of luxury, innovation, and desert beauty.",
      },
    ];
    setDestinations(dests);
    setLoading(false);
  }, []);

  // ✅ Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  // ✅ Protect login route
  if (!token) {
    return <LoginForm onLogin={(t) => setToken(t)} />;
  }

  return (
    <div
      className={
        darkMode
          ? "dark bg-gray-900 text-gray-200 min-h-screen"
          : "bg-gradient-to-br from-blue-50 to-blue-200 text-gray-800 min-h-screen"
      }
    >
      <Navbar
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
        onViewBookings={() => setShowBookings(true)}
        onLogout={handleLogout}
      />

      <div className="flex flex-col items-center py-8">
        <h1 className="text-5xl font-extrabold mb-3 text-center">
          ✈️ Travel Explorer
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-10 text-lg text-center max-w-2xl">
          Explore the world’s most iconic destinations and book your next
          unforgettable experience.
        </p>

        {/* Destination Grid */}
        {loading ? (
          <p className="text-gray-500 dark:text-gray-400">
            Loading destinations...
          </p>
        ) : (
          <DestinationGrid
            destinations={destinations}
            onBook={(place) => setSelected(place)}
          />
        )}

        {/* Map Section */}
        <div className="mt-20 w-11/12 max-w-6xl h-[400px] rounded-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700">
          <MapContainer
            center={[20, 0]}
            zoom={2}
            scrollWheelZoom
            className="h-full w-full rounded-xl"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {destinations.map((place, idx) => (
              <Marker key={idx} position={[place.lat, place.lng]}>
                <Popup>
                  <strong>{place.name}</strong>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Booking Modal */}
        {selected && (
          <BookingModal selected={selected} onClose={() => setSelected(null)} />
        )}
        {showBookings && (
          <BookingsList onClose={() => setShowBookings(false)} />
        )}
      </div>

      <footer className="mt-16 py-6 text-center text-gray-600 dark:text-gray-400 text-sm">
        © {new Date().getFullYear()} Travel Explorer — Plan your journey, live
        your story.
      </footer>
    </div>
  );
}

export default App;
