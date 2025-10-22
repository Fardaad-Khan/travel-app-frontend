import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./components/Navbar";
import DestinationGrid from "./components/DestinationGrid";
import BookingModal from "./components/BookingModal";
import LoginForm from "./components/LoginForm";
import BookingsList from "./components/BookingsList";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import tokyoImg from "./assets/tokyo.jpg";
import parisImg from "./assets/paris.jpg";
import sydneyImg from "./assets/sydney.jpg";
import dubaiImg from "./assets/dubai.jpg";


// Import the travel background image from src/assets
import travelBg from "./assets/travel-bg.jpg";

// Backend API - Keep the same
const API_BASE = "https://travel-app-1-1lq9.onrender.com";

// Leaflet icons fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Map Animation Component
function MapController({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 10, { animate: true, duration: 1.5 });
    }
  }, [center, map]);
  return null;
}

function App() {
  const [destinations, setDestinations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });
  const [showBookings, setShowBookings] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    // Enhanced destinations using your local images and fallback online images
    const dests = [
      {
        id: 1,
        name: "Tokyo",
        lat: 35.6895,
        lng: 139.6917,
        // Use local image from public/assets folder
        image: tokyoImg,
        fallbackImage: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=600&fit=crop",
        description: "A vibrant mix of modern life and ancient tradition.",
        price: "$2,299",
        rating: 4.9,
        duration: "7 days",
        highlights: ["Mount Fuji", "Shibuya Crossing", "Senso-ji Temple"]
      },
      {
        id: 2,
        name: "Paris",
        lat: 48.8566,
        lng: 2.3522,
        image: parisImg,
        fallbackImage: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=600&fit=crop",
        description: "The city of lights, romance, and exquisite cuisine.",
        price: "$1,899",
        rating: 4.8,
        duration: "5 days",
        highlights: ["Eiffel Tower", "Louvre Museum", "Notre-Dame"]
      },
      {
        id: 3,
        name: "Sydney",
        lat: -33.8688,
        lng: 151.2093,
        image: sydneyImg,
        fallbackImage: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&h=600&fit=crop",
        description: "Harbor views, beaches, and the iconic Opera House.",
        price: "$1,799",
        rating: 4.7,
        duration: "6 days",
        highlights: ["Opera House", "Bondi Beach", "Harbour Bridge"]
      },
      {
        id: 4,
        name: "Dubai",
        lat: 25.2048,
        lng: 55.2708,
        image: dubaiImg,
        fallbackImage: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop",
        description: "A city of luxury, innovation, and desert beauty.",
        price: "$1,599",
        rating: 4.8,
        duration: "5 days",
        highlights: ["Burj Khalifa", "Dubai Mall", "Desert Safari"]
      },
    ];
    setDestinations(dests);
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  const handleSelectDestination = (destination) => {
    setSelected(destination);
    setMapCenter([destination.lat, destination.lng]);
  };

  // Filter destinations based on search
  const filteredDestinations = destinations.filter(dest =>
    dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dest.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!token) return <LoginForm onLogin={(t) => setToken(t)} darkMode={darkMode} />;

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      darkMode 
        ? "dark bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100" 
        : "bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-800"
    }`}>
      <Navbar
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
        onViewBookings={() => setShowBookings(true)}
        onLogout={handleLogout}
      />

      {/* Hero Section with Local Background Image */}
      <section
        className="relative flex items-center justify-center h-[600px] text-center overflow-hidden"
        style={{
          backgroundImage: `url(${travelBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/60"></div>
        <div className="relative z-10 px-4 animate-fadeInUp">
          <h1 className="text-6xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-2xl">
            ✈️ Travel Next
          </h1>
          <p className="text-xl md:text-2xl text-white/95 max-w-3xl mx-auto mb-8 drop-shadow-lg">
            Discover stunning destinations, trusted service, and unforgettable experiences worldwide.
          </p>
          <div className="flex justify-center">
            <input
              type="text"
              placeholder="🔍 Search destinations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-6 py-3 rounded-full w-full max-w-md text-gray-800 shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-400/50 transition-all"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { number: "50+", label: "Destinations", icon: "🌍" },
            { number: "10K+", label: "Happy Travelers", icon: "😊" },
            { number: "4.8", label: "Average Rating", icon: "⭐" },
            { number: "24/7", label: "Support", icon: "💬" }
          ].map((stat, idx) => (
            <div key={idx} className={`text-center p-6 rounded-2xl transition-all hover:scale-105 ${
              darkMode 
                ? "bg-gray-800/50 backdrop-blur" 
                : "bg-white/80 backdrop-blur shadow-lg"
            }`}>
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold mb-1 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                {stat.number}
              </div>
              <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us Cards */}
      <section className="py-12 px-6">
        <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Why Choose Travel Next?
        </h2>
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 max-w-6xl mx-auto">
          {[
            { 
              icon: "🌏", 
              title: "Global Destinations", 
              desc: "From Tokyo to Paris, explore top locations worldwide with curated experiences." 
            },
            { 
              icon: "🛡️", 
              title: "Trusted Service", 
              desc: "Book safely with a platform trusted by thousands of happy travelers." 
            },
            { 
              icon: "💰", 
              title: "Best Prices", 
              desc: "Get the best deals and value for your trips with price match guarantee." 
            },
          ].map((item, idx) => (
            <div 
              key={idx} 
              className={`group relative overflow-hidden rounded-3xl p-8 w-full md:w-80 text-center transition-all duration-300 hover:scale-105 hover:-translate-y-2 ${
                darkMode 
                  ? "bg-gradient-to-br from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600" 
                  : "bg-gradient-to-br from-white to-gray-50 shadow-xl hover:shadow-2xl"
              }`}
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                {item.title}
              </h3>
              <p className={`text-sm leading-relaxed ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Destination Grid */}
      <div className="flex flex-col items-center py-12 px-6">
        <h2 className="text-4xl font-bold mb-3 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Popular Destinations
        </h2>
        <p className={`text-center mb-8 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          Choose your next adventure from our handpicked destinations
        </p>
        {loading ? (
          <div className="flex flex-col items-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
            <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
              Loading amazing destinations...
            </p>
          </div>
        ) : (
          <>
            {filteredDestinations.length > 0 ? (
              <DestinationGrid 
                destinations={filteredDestinations} 
                onBook={handleSelectDestination}
                darkMode={darkMode}
              />
            ) : (
              <div className="text-center py-12">
                <p className={`text-lg ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  No destinations found matching "{searchQuery}"
                </p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Clear Search
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Interactive Map */}
      <div className="flex flex-col items-center mt-12 px-4 pb-16">
        <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Explore on Map
        </h2>
        <div className="w-full max-w-7xl h-[500px] rounded-3xl overflow-hidden shadow-2xl">
          <MapContainer 
            center={mapCenter || [20, 0]} 
            zoom={mapCenter ? 10 : 2} 
            scrollWheelZoom 
            className="h-full w-full"
          >
            <TileLayer 
              url={darkMode 
                ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              }
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            <MapController center={mapCenter} />
            {filteredDestinations.map((place) => (
              <Marker key={place.id} position={[place.lat, place.lng]}>
                <Popup>
                  <div className="text-center p-2">
                    <img 
                      src={place.image} 
                      alt={place.name} 
                      className="w-full h-24 object-cover rounded-lg mb-2"
                      onError={(e) => {
                        e.target.src = place.fallbackImage;
                      }}
                    />
                    <strong className="text-lg block">{place.name}</strong>
                    <p className="text-sm my-1">{place.description}</p>
                    <p className="font-bold text-blue-600">{place.price} • {place.duration}</p>
                    <button
                      onClick={() => handleSelectDestination(place)}
                      className="mt-2 px-4 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600"
                    >
                      Book Now
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {selected && (
        <BookingModal 
          selected={selected} 
          onClose={() => setSelected(null)}
          darkMode={darkMode}
        />
      )}
      {showBookings && (
        <BookingsList 
          onClose={() => setShowBookings(false)}
          darkMode={darkMode}
        />
      )}

      {/* Footer */}
      <footer className={`mt-16 py-12 text-center ${
        darkMode 
          ? "bg-gray-900 border-t border-gray-800" 
          : "bg-gradient-to-br from-gray-100 to-gray-50"
      }`}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Travel Next
          </div>
          <p className={`mb-6 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Your journey starts here. Explore the world with confidence.
          </p>
          <div className="flex justify-center gap-4 mb-6">
            {["📧 Email", "📱 WhatsApp", "💬 Live Chat", "📞 Call"].map((contact, idx) => (
              <button 
                key={idx}
                className={`px-4 py-2 rounded-lg transition-all hover:scale-105 ${
                  darkMode 
                    ? "bg-gray-800 hover:bg-gray-700" 
                    : "bg-white hover:bg-gray-50 shadow"
                }`}
              >
                {contact}
              </button>
            ))}
          </div>
          <p className={`text-sm ${darkMode ? "text-gray-500" : "text-gray-500"}`}>
            © {new Date().getFullYear()} Travel Next — Plan your journey, live your story.
            <br />
            Designed with ❤️ by Travel Next Team
          </p>
        </div>
      </footer>

      {/* Add animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 1s ease-out;
        }
      `}</style>
    </div>
  );
}

export default App;