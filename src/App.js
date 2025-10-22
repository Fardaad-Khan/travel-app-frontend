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

// Backend API
const API_BASE = "https://travel-app-1-1lq9.onrender.com";

// Leaflet icons
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

  useEffect(() => {
    const dests = [
      {
        name: "Tokyo",
        lat: 35.6895,
        lng: 139.6917,
        image: process.env.PUBLIC_URL + "/assets/tokyo.jpg",
        description: "A vibrant mix of modern life and ancient tradition.",
      },
      {
        name: "Paris",
        lat: 48.8566,
        lng: 2.3522,
        image: process.env.PUBLIC_URL + "/assets/paris.jpg",
        description: "The city of lights, romance, and exquisite cuisine.",
      },
      {
        name: "Sydney",
        lat: -33.8688,
        lng: 151.2093,
        image: process.env.PUBLIC_URL + "/assets/sydney.jpg",
        description: "Harbor views, beaches, and the iconic Opera House.",
      },
      {
        name: "Dubai",
        lat: 25.2048,
        lng: 55.2708,
        image: process.env.PUBLIC_URL + "/assets/dubai.jpg",
        description: "A city of luxury, innovation, and desert beauty.",
      },
    ];
    setDestinations(dests);
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  if (!token) return <LoginForm onLogin={(t) => setToken(t)} />;

  return (
    <div className={`min-h-screen ${darkMode ? "dark bg-gray-900 text-gray-200" : "bg-gray-50 text-gray-800"}`}>
      <Navbar
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
        onViewBookings={() => setShowBookings(true)}
        onLogout={handleLogout}
      />

      {/* Hero Section */}
      <section
        className="relative flex items-center justify-center h-[500px] text-center"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/assets/travel-bg.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 px-4">
          <h1 className="text-5xl font-extrabold text-white mb-4">✈️ Travel Next</h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Discover stunning destinations, trusted service, and unforgettable experiences worldwide.
          </p>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="flex flex-col md:flex-row justify-center items-center gap-6 mt-12 px-6">
        {[
          { title: "Global Destinations", desc: "From Tokyo to Paris, explore top locations worldwide." },
          { title: "Trusted Service", desc: "Book safely with a platform trusted by thousands." },
          { title: "Best Prices", desc: "Get the best deals and value for your trips." },
        ].map((item, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-2xl shadow-lg p-6 w-72 text-center hover:scale-105 transition transform">
            <h2 className="text-xl font-bold mb-2">{item.title}</h2>
            <p className="text-gray-700 dark:text-gray-300 text-sm">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* Destination Grid */}
      <div className="flex flex-col items-center py-12">
        <h2 className="text-3xl font-bold mb-6 text-center">Explore Destinations</h2>
        {loading ? (
          <p className="text-gray-500 dark:text-gray-400">Loading destinations...</p>
        ) : (
          <DestinationGrid destinations={destinations} onBook={(place) => setSelected(place)} />
        )}
      </div>

      {/* Map */}
      <div className="flex justify-center mt-20 px-4">
        <div className="w-full max-w-6xl h-[400px] rounded-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700">
          <MapContainer center={[20, 0]} zoom={2} scrollWheelZoom className="h-full w-full">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {destinations.map((place, idx) => (
              <Marker key={idx} position={[place.lat, place.lng]}>
                <Popup>
                  <strong>{place.name}</strong>: {place.description}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {selected && <BookingModal selected={selected} onClose={() => setSelected(null)} />}
      {showBookings && <BookingsList onClose={() => setShowBookings(false)} />}

      {/* Footer */}
      <footer className="mt-16 py-6 text-center text-gray-700 dark:text-gray-300 text-sm bg-gray-100 dark:bg-gray-900">
        <p>© {new Date().getFullYear()} Travel Next — Plan your journey, live your story.</p>
        <p className="mt-2">Designed with ❤️ by Travel Next Team</p>
      </footer>
    </div>
  );
}

export default App;
