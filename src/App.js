import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import Navbar from "./components/Navbar";
import DestinationGrid from "./components/DestinationGrid";
import BookingModal from "./components/BookingModal";
import BookingsList from "./components/BookingsList";
import LoginForm from "./components/LoginForm";
import SearchBar from "./components/SearchBar";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorMessage from "./components/ErrorMessage";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// API Configuration
const API_BASE = process.env.REACT_APP_API_BASE || "https://travel-app-a9mw.onrender.com";

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Map controller component for smooth animations
function MapController({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 10, {
        animate: true,
        duration: 1.5
      });
    }
  }, [center, map]);
  return null;
}

function App() {
  // State Management
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });
  const [showBookings, setShowBookings] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [mapCenter, setMapCenter] = useState(null);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Fetch destinations with proper error handling
  const fetchDestinations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_BASE}/destinations/`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        timeout: 10000
      });
      
      // Add additional data to destinations for better UX
      const enhancedDestinations = response.data.map(dest => ({
        ...dest,
        price: dest.price || `$${Math.floor(Math.random() * 2000 + 500)}`,
        rating: dest.rating || (Math.random() * 2 + 3).toFixed(1),
        duration: dest.duration || `${Math.floor(Math.random() * 7 + 3)} days`,
        image: `https://source.unsplash.com/800x600/?${dest.name},landmark,travel`
      }));
      
      setDestinations(enhancedDestinations);
    } catch (err) {
      console.error("Error fetching destinations:", err);
      
      // Fallback to mock data if API fails
      if (err.code === 'ECONNABORTED' || err.response?.status >= 500) {
        const mockDestinations = [
          { id: 1, name: "Paris", lat: 48.8566, lng: 2.3522, price: "$1,499", rating: "4.7", duration: "5 days" },
          { id: 2, name: "Tokyo", lat: 35.6895, lng: 139.6917, price: "$2,299", rating: "4.9", duration: "7 days" },
          { id: 3, name: "Sydney", lat: -33.8688, lng: 151.2093, price: "$1,899", rating: "4.6", duration: "6 days" },
          { id: 4, name: "Dubai", lat: 25.2048, lng: 55.2708, price: "$1,299", rating: "4.8", duration: "4 days" },
          { id: 5, name: "New York", lat: 40.7128, lng: -74.0060, price: "$1,699", rating: "4.5", duration: "5 days" },
          { id: 6, name: "Bali", lat: -8.3405, lng: 115.0920, price: "$999", rating: "4.9", duration: "7 days" },
        ].map(dest => ({
          ...dest,
          image: `https://source.unsplash.com/800x600/?${dest.name},landmark,travel`
        }));
        
        setDestinations(mockDestinations);
        setError("Using offline mode. Some features may be limited.");
      } else {
        setError("Failed to load destinations. Please check your connection and try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchDestinations();
    }
  }, [token, fetchDestinations]);

  // Filter and sort destinations
  const filteredAndSortedDestinations = useMemo(() => {
    let filtered = destinations.filter(dest =>
      dest.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort destinations
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price":
          const priceA = parseInt(a.price.replace(/\D/g, ""));
          const priceB = parseInt(b.price.replace(/\D/g, ""));
          return priceA - priceB;
        case "rating":
          return parseFloat(b.rating) - parseFloat(a.rating);
        default:
          return 0;
      }
    });

    return filtered;
  }, [destinations, searchQuery, sortBy]);

  // Handle login
  const handleLogin = useCallback((token, userData) => {
    setToken(token);
    setUser(userData);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
  }, []);

  // Handle logout
  const handleLogout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setShowBookings(false);
    setSelected(null);
  }, []);

  // Handle destination selection
  const handleSelectDestination = useCallback((destination) => {
    setSelected(destination);
    setMapCenter([destination.lat, destination.lng]);
  }, []);

  // Render login form if not authenticated
  if (!token) {
    return <LoginForm onLogin={handleLogin} darkMode={darkMode} />;
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? "dark bg-gray-900 text-gray-100" 
        : "bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-800"
    }`}>
      <Navbar
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
        onViewBookings={() => setShowBookings(true)}
        onLogout={handleLogout}
        user={user}
      />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Travel Explorer
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Discover and book your favorite destinations
          </p>
          
          {/* Search and Filter Bar */}
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortBy={sortBy}
            setSortBy={setSortBy}
            darkMode={darkMode}
          />
        </div>

        {/* Error Message */}
        {error && (
          <ErrorMessage 
            message={error} 
            onRetry={fetchDestinations}
            darkMode={darkMode}
          />
        )}

        {/* Loading State */}
        {loading ? (
          <LoadingSpinner darkMode={darkMode} />
        ) : (
          <>
            {/* Results count */}
            {!loading && filteredAndSortedDestinations.length > 0 && (
              <p className="text-center mb-6 text-gray-600 dark:text-gray-400">
                Found {filteredAndSortedDestinations.length} destination{filteredAndSortedDestinations.length !== 1 ? 's' : ''}
              </p>
            )}

            {/* Destinations Grid */}
            <DestinationGrid
              destinations={filteredAndSortedDestinations}
              onBook={handleSelectDestination}
              darkMode={darkMode}
            />

            {/* No results message */}
            {filteredAndSortedDestinations.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
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

            {/* Interactive Map */}
            {filteredAndSortedDestinations.length > 0 && (
              <div className="mt-12 animate-slide-up">
                <h2 className="text-2xl font-bold mb-6 text-center">Explore on Map</h2>
                <div className="w-full h-[500px] rounded-2xl shadow-2xl overflow-hidden">
                  <MapContainer
                    center={mapCenter || [20, 0]}
                    zoom={mapCenter ? 10 : 2}
                    scrollWheelZoom={true}
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
                    {filteredAndSortedDestinations.map((place) => (
                      <Marker key={place.id || place.name} position={[place.lat, place.lng]}>
                        <Popup>
                          <div className="text-center p-2">
                            <strong className="text-lg block mb-1">{place.name}</strong>
                            <p className="text-sm text-gray-600 mb-2">
                              {place.price} • {place.duration}
                            </p>
                            <button
                              onClick={() => handleSelectDestination(place)}
                              className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
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
            )}
          </>
        )}

        {/* Modals */}
        {selected && (
          <BookingModal
            selected={selected}
            onClose={() => setSelected(null)}
            darkMode={darkMode}
            token={token}
            user={user}
          />
        )}
        
        {showBookings && (
          <BookingsList
            onClose={() => setShowBookings(false)}
            darkMode={darkMode}
            token={token}
          />
        )}
      </main>

      {/* Add custom styles for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}

export default App;