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
import amsterdamImg from "./assets/amsterdam.jpg";
import bangkokImg from "./assets/bangkok.jpg";
import barcelonaImg from "./assets/barcelona.jpg";
import berlinImg from "./assets/berlin.jpg";
import boraImg from "./assets/bora.jpg";
import cairoImg from "./assets/cairo.jpg";
import capetownImg from "./assets/capetown.jpg";
import chinaImg from "./assets/china.jpg";
import grandImg from "./assets/grand.jpg";
import hongKongImg from "./assets/hong kong.jpg";
import istanbulImg from "./assets/istanbul.jpg";
import kyotoImg from "./assets/kyoto.jpg";
import londonImg from "./assets/london.jpg";
import machaImg from "./assets/macha.jpg";
import mexicoImg from "./assets/mexico.jpg";
import moscowImg from "./assets/moscow.jpg";
import newYorkImg from "./assets/new york.jpg";
import pragueImg from "./assets/prague.jpg";
import rioImg from "./assets/rio.jpg";
import romeImg from "./assets/rome.jpg";
import santoriniImg from "./assets/santorini.jpg";
import seoulImg from "./assets/seoul.jpg";
import singaporeImg from "./assets/singapore.jpg";
import tajmahalImg from "./assets/tajmahal.jpg";
import veniceImg from "./assets/venice.jpg";
import viennaImg from "./assets/vienna.jpg";

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
    // Expanded list of destinations around the world
    const fallbackImages = [
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop"
    ];

    const destList = [
      {
        id: 1,
        name: "Tokyo",
        lat: 35.6895,
        lng: 139.6917,
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
        description: "A city of luxury, innovation, and desert beauty.",
        price: "$1,599",
        rating: 4.8,
        duration: "5 days",
        highlights: ["Burj Khalifa", "Dubai Mall", "Desert Safari"]
      },
      {
        id: 5,
        name: "New York",
        lat: 40.7128,
        lng: -74.0060,
        description: "The city that never sleeps, with iconic skyscrapers.",
        price: "$2,099",
        rating: 4.8,
        duration: "6 days",
        highlights: ["Statue of Liberty", "Times Square", "Central Park"]
      },
      {
        id: 6,
        name: "London",
        lat: 51.5074,
        lng: -0.1278,
        description: "Historic landmarks and modern culture in the UK capital.",
        price: "$1,999",
        rating: 4.7,
        duration: "5 days",
        highlights: ["Big Ben", "Buckingham Palace", "British Museum"]
      },
      {
        id: 7,
        name: "Rome",
        lat: 41.9028,
        lng: 12.4964,
        description: "Ancient ruins and delicious Italian cuisine.",
        price: "$1,799",
        rating: 4.9,
        duration: "7 days",
        highlights: ["Colosseum", "Vatican City", "Trevi Fountain"]
      },
      {
        id: 8,
        name: "Barcelona",
        lat: 41.3851,
        lng: 2.1734,
        description: "Gaudi's architecture and vibrant beach life.",
        price: "$1,699",
        rating: 4.8,
        duration: "5 days",
        highlights: ["Sagrada Familia", "Park Guell", "La Rambla"]
      },
      {
        id: 9,
        name: "Rio de Janeiro",
        lat: -22.9068,
        lng: -43.1729,
        description: "Beaches, carnival, and Christ the Redeemer.",
        price: "$1,899",
        rating: 4.7,
        duration: "6 days",
        highlights: ["Copacabana Beach", "Sugarloaf Mountain", "Christ the Redeemer"]
      },
      {
        id: 10,
        name: "Cape Town",
        lat: -33.9249,
        lng: 18.4241,
        description: "Stunning landscapes and Table Mountain.",
        price: "$1,799",
        rating: 4.8,
        duration: "7 days",
        highlights: ["Table Mountain", "Robben Island", "Cape of Good Hope"]
      },
      {
        id: 11,
        name: "Bangkok",
        lat: 13.7563,
        lng: 100.5018,
        description: "Temples, street food, and bustling markets.",
        price: "$1,299",
        rating: 4.6,
        duration: "5 days",
        highlights: ["Grand Palace", "Wat Arun", "Chatuchak Market"]
      },
      {
        id: 12,
        name: "Istanbul",
        lat: 41.0082,
        lng: 28.9784,
        description: "Where East meets West, with historic mosques.",
        price: "$1,499",
        rating: 4.8,
        duration: "6 days",
        highlights: ["Hagia Sophia", "Blue Mosque", "Grand Bazaar"]
      },
      {
        id: 13,
        name: "Hong Kong",
        lat: 22.3964,
        lng: 114.1095,
        description: "Skyscrapers, harbors, and dim sum delights.",
        price: "$1,999",
        rating: 4.7,
        duration: "5 days",
        highlights: ["Victoria Peak", "Star Ferry", "Temple Street Market"]
      },
      {
        id: 14,
        name: "Singapore",
        lat: 1.3521,
        lng: 103.8198,
        description: "Modern city-state with gardens and marina.",
        price: "$2,099",
        rating: 4.9,
        duration: "4 days",
        highlights: ["Marina Bay Sands", "Gardens by the Bay", "Sentosa Island"]
      },
      {
        id: 15,
        name: "Amsterdam",
        lat: 52.3676,
        lng: 4.9041,
        description: "Canals, bicycles, and world-class museums.",
        price: "$1,899",
        rating: 4.8,
        duration: "5 days",
        highlights: ["Anne Frank House", "Rijksmuseum", "Vondelpark"]
      },
      {
        id: 16,
        name: "Prague",
        lat: 50.0755,
        lng: 14.4378,
        description: "Fairy-tale architecture and historic charm.",
        price: "$1,599",
        rating: 4.7,
        duration: "6 days",
        highlights: ["Prague Castle", "Charles Bridge", "Old Town Square"]
      },
      {
        id: 17,
        name: "Vienna",
        lat: 48.2082,
        lng: 16.3738,
        description: "Imperial palaces and classical music.",
        price: "$1,799",
        rating: 4.8,
        duration: "5 days",
        highlights: ["Schonbrunn Palace", "St. Stephen's Cathedral", "Vienna Opera House"]
      },
      {
        id: 18,
        name: "Berlin",
        lat: 52.5200,
        lng: 13.4050,
        description: "History, street art, and vibrant nightlife.",
        price: "$1,699",
        rating: 4.7,
        duration: "6 days",
        highlights: ["Brandenburg Gate", "Berlin Wall", "Museum Island"]
      },
      {
        id: 19,
        name: "Moscow",
        lat: 55.7558,
        lng: 37.6173,
        description: "Red Square, Kremlin, and onion domes.",
        price: "$1,899",
        rating: 4.6,
        duration: "7 days",
        highlights: ["Red Square", "Kremlin", "St. Basil's Cathedral"]
      },
      {
        id: 20,
        name: "Cairo",
        lat: 30.0444,
        lng: 31.2357,
        description: "Ancient pyramids and the Nile River.",
        price: "$1,499",
        rating: 4.8,
        duration: "6 days",
        highlights: ["Pyramids of Giza", "Sphinx", "Egyptian Museum"]
      },
      {
        id: 21,
        name: "Machu Picchu",
        lat: -13.1631,
        lng: -72.5450,
        description: "Ancient Incan ruins in the Andes.",
        price: "$2,499",
        rating: 4.9,
        duration: "8 days",
        highlights: ["Inca Trail", "Sun Gate", "Temple of the Sun"]
      },
      {
        id: 22,
        name: "Great Wall of China",
        lat: 40.4319,
        lng: 116.5704,
        description: "Iconic ancient fortification spanning mountains.",
        price: "$2,199",
        rating: 4.9,
        duration: "7 days",
        highlights: ["Mutianyu Section", "Jinshanling", "Badaling"]
      },
      {
        id: 23,
        name: "Taj Mahal",
        lat: 27.1751,
        lng: 78.0421,
        description: "Marble mausoleum of eternal love.",
        price: "$1,799",
        rating: 4.9,
        duration: "5 days",
        highlights: ["Agra Fort", "Mehtab Bagh", "Itmad-ud-Daulah"]
      },
      {
        id: 24,
        name: "Bora Bora",
        lat: -16.5004,
        lng: -151.7415,
        description: "Overwater bungalows and turquoise lagoons.",
        price: "$3,999",
        rating: 4.9,
        duration: "7 days",
        highlights: ["Mount Otemanu", "Matira Beach", "Coral Gardens"]
      },
      {
        id: 25,
        name: "Grand Canyon",
        lat: 36.1069,
        lng: -112.1129,
        description: "Vast natural wonder carved by the Colorado River.",
        price: "$1,599",
        rating: 4.8,
        duration: "5 days",
        highlights: ["South Rim", "Bright Angel Trail", "Havasu Falls"]
      },
      {
        id: 26,
        name: "Santorini",
        lat: 36.3932,
        lng: 25.4615,
        description: "White-washed buildings and stunning sunsets.",
        price: "$2,299",
        rating: 4.9,
        duration: "6 days",
        highlights: ["Oia Village", "Akrotiri", "Red Beach"]
      },
      {
        id: 27,
        name: "Kyoto",
        lat: 35.0116,
        lng: 135.7681,
        description: "Traditional temples and cherry blossoms.",
        price: "$2,099",
        rating: 4.8,
        duration: "7 days",
        highlights: ["Fushimi Inari", "Kinkaku-ji", "Arashiyama Bamboo Grove"]
      },
      {
        id: 28,
        name: "Venice",
        lat: 45.4408,
        lng: 12.3155,
        description: "Romantic canals and gondola rides.",
        price: "$2,199",
        rating: 4.7,
        duration: "5 days",
        highlights: ["St. Mark's Square", "Rialto Bridge", "Doge's Palace"]
      },
      {
        id: 29,
        name: "Seoul",
        lat: 37.5665,
        lng: 126.9780,
        description: "Modern tech hub with ancient palaces.",
        price: "$1,799",
        rating: 4.8,
        duration: "6 days",
        highlights: ["Gyeongbokgung Palace", "N Seoul Tower", "Myeongdong"]
      },
      {
        id: 30,
        name: "Mexico City",
        lat: 19.4326,
        lng: -99.1332,
        description: "Vibrant culture and Aztec ruins.",
        price: "$1,499",
        rating: 4.7,
        duration: "5 days",
        highlights: ["Zocalo", "Teotihuacan", "Chapultepec Castle"]
      }
    ];

    // Map destination names to their specific images
    const imageMap = {
      "Tokyo": tokyoImg,
      "Paris": parisImg,
      "Sydney": sydneyImg,
      "Dubai": dubaiImg,
      "New York": newYorkImg,
      "London": londonImg,
      "Rome": romeImg,
      "Barcelona": barcelonaImg,
      "Rio de Janeiro": rioImg,
      "Cape Town": capetownImg,
      "Bangkok": bangkokImg,
      "Istanbul": istanbulImg,
      "Hong Kong": hongKongImg,
      "Singapore": singaporeImg,
      "Amsterdam": amsterdamImg,
      "Prague": pragueImg,
      "Vienna": viennaImg,
      "Berlin": berlinImg,
      "Moscow": moscowImg,
      "Cairo": cairoImg,
      "Machu Picchu": machaImg,
      "Great Wall of China": chinaImg,
      "Taj Mahal": tajmahalImg,
      "Bora Bora": boraImg,
      "Grand Canyon": grandImg,
      "Santorini": santoriniImg,
      "Kyoto": kyotoImg,
      "Venice": veniceImg,
      "Seoul": seoulImg,
      "Mexico City": mexicoImg,
    };

    // Assign specific images and fallbacks
    const enhancedDests = destList.map((dest, index) => ({
      ...dest,
      image: imageMap[dest.name] || tokyoImg, // Fallback to tokyoImg if no match
      fallbackImage: fallbackImages[index % 4]
    }));

    setDestinations(enhancedDests);
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

  // Filter destinations based on search - now works with the expanded list
  const filteredDestinations = destinations.filter(dest =>
    dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dest.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dest.highlights.some(h => h.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (!token) return <LoginForm onLogin={(t) => setToken(t)} darkMode={darkMode} />;

  return (
    <div className={`min-h-screen transition-all duration-300 font-sans ${
      darkMode 
        ? "dark bg-gray-900 text-gray-100" 
        : "bg-white text-gray-800"
    }`}>
      <Navbar
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
        onViewBookings={() => setShowBookings(true)}
        onLogout={handleLogout}
      />

      {/* Hero Section with Local Background Image - Improved aesthetics: softer overlay, better typography */}
      <section
        className="relative flex items-center justify-center h-[700px] text-center overflow-hidden"
        style={{
          backgroundImage: `url(${travelBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/50"></div>
        <div className="relative z-10 px-6 animate-fadeInUp max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 drop-shadow-xl tracking-tight">
            ✈️ Travel Next
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10 drop-shadow-md leading-relaxed">
            Embark on journeys that inspire, with handpicked destinations and seamless experiences.
          </p>
          <div className="flex justify-center">
            <input
              type="text"
              placeholder="🔍 Search for your dream destination..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-6 py-4 rounded-full w-full max-w-lg text-gray-800 shadow-xl focus:outline-none focus:ring-2 focus:ring-white/50 transition-all bg-white/90"
            />
          </div>
        </div>
      </section>

      {/* Stats Section - Improved: cleaner cards, subtle animations, neutral colors */}
      <section className="py-16 px-6 bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { number: "50+", label: "Destinations", icon: "🌍" },
            { number: "10K+", label: "Happy Travelers", icon: "😊" },
            { number: "4.8", label: "Average Rating", icon: "⭐" },
            { number: "24/7", label: "Support", icon: "💬" }
          ].map((stat, idx) => (
            <div key={idx} className={`text-center p-8 rounded-xl transition-all hover:scale-105 hover:shadow-lg ${
              darkMode 
                ? "bg-gray-800/70" 
                : "bg-white/70 shadow-md"
            }`}>
              <div className="text-5xl mb-3">{stat.icon}</div>
              <div className="text-4xl font-semibold mb-1 text-gray-800 dark:text-gray-100">
                {stat.number}
              </div>
              <div className={`text-base font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us Cards - Improved: more elegant design, softer gradients, better spacing */}
      <section className="py-16 px-6">
        <h2 className="text-4xl font-serif font-bold text-center mb-12 text-gray-800 dark:text-gray-100">
          Why Choose Travel Next?
        </h2>
        <div className="flex flex-col md:flex-row justify-center items-stretch gap-8 max-w-7xl mx-auto">
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
              className={`group relative overflow-hidden rounded-2xl p-8 flex flex-col items-center text-center transition-all duration-300 hover:scale-105 ${
                darkMode 
                  ? "bg-gray-800 hover:bg-gray-700" 
                  : "bg-white shadow-lg hover:shadow-xl"
              }`}
            >
              <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                {item.title}
              </h3>
              <p className={`text-base leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Destination Grid - Assuming cards show description, not lat/lng */}
      <div className="flex flex-col items-center py-16 px-6 bg-gradient-to-b from-gray-50 to-transparent dark:from-gray-800 dark:to-transparent">
        <h2 className="text-4xl font-serif font-bold mb-4 text-center text-gray-800 dark:text-gray-100">
          Popular Destinations
        </h2>
        <p className={`text-center mb-10 text-lg ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          Discover handpicked adventures tailored for unforgettable memories
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
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Search
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Interactive Map - Improved: larger, better tiles, subtle shadow */}
      <div className="flex flex-col items-center mt-12 px-6 pb-16">
        <h2 className="text-4xl font-serif font-bold mb-10 text-center text-gray-800 dark:text-gray-100">
          Explore on the Map
        </h2>
        <div className="w-full max-w-7xl h-[600px] rounded-2xl overflow-hidden shadow-xl">
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
                  <div className="text-center p-4 max-w-xs">
                    <img 
                      src={place.image} 
                      alt={place.name} 
                      className="w-full h-32 object-cover rounded-md mb-3"
                      onError={(e) => {
                        e.target.src = place.fallbackImage;
                      }}
                    />
                    <strong className="text-xl block text-gray-800 dark:text-gray-100">{place.name}</strong>
                    <p className="text-sm my-2 text-gray-600 dark:text-gray-300">{place.description}</p>
                    <p className="font-semibold text-blue-600 dark:text-blue-400">{place.price} • {place.duration}</p>
                    <button
                      onClick={() => handleSelectDestination(place)}
                      className="mt-3 px-5 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
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

      {/* Footer - Improved: functional links, cleaner design, no APIs added (using standard links) */}
      <footer className={`mt-16 py-12 text-center border-t ${
        darkMode 
          ? "bg-gray-900 border-gray-800" 
          : "bg-gray-50 border-gray-200"
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-3xl font-serif font-bold mb-4 text-gray-800 dark:text-gray-100">
            Travel Next
          </div>
          <p className={`mb-8 text-lg ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            Your journey starts here. Explore the world with confidence.
          </p>
          <div className="flex justify-center gap-6 mb-8">
            <a 
              href="mailto:fardaadbusiness@gmail.com"
              className={`px-5 py-3 rounded-lg transition-all hover:scale-105 flex items-center gap-2 ${
                darkMode 
                  ? "bg-gray-800 hover:bg-gray-700" 
                  : "bg-white hover:bg-gray-50 shadow"
              }`}
            >
              📧 Email
            </a>
            <a 
              href="https://wa.me/61483894346"
              className={`px-5 py-3 rounded-lg transition-all hover:scale-105 flex items-center gap-2 ${
                darkMode 
                  ? "bg-gray-800 hover:bg-gray-700" 
                  : "bg-white hover:bg-gray-50 shadow"
              }`}
            >
              📱 WhatsApp
            </a>
            <a 
              href="https://wa.me/61483894346?text=Hi,%20I'd%20like%20to%20start%20a%20live%20chat."
              className={`px-5 py-3 rounded-lg transition-all hover:scale-105 flex items-center gap-2 ${
                darkMode 
                  ? "bg-gray-800 hover:bg-gray-700" 
                  : "bg-white hover:bg-gray-50 shadow"
              }`}
            >
              💬 Live Chat
            </a>
            <a 
              href="tel:+61483894346"
              className={`px-5 py-3 rounded-lg transition-all hover:scale-105 flex items-center gap-2 ${
                darkMode 
                  ? "bg-gray-800 hover:bg-gray-700" 
                  : "bg-white hover:bg-gray-50 shadow"
              }`}
            >
              📞 Call
            </a>
          </div>
          <p className={`text-sm ${darkMode ? "text-gray-500" : "text-gray-500"}`}>
            © {new Date().getFullYear()} Travel Next — Plan your journey, live your story.
            <br />
            Designed with ❤️ by Travel Next Team
          </p>
        </div>
      </footer>

      {/* Add animations and global styles */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Roboto:wght@300;400;500&display=swap');
        body {
          font-family: 'Roboto', sans-serif;
        }
        h1, h2, h3 {
          font-family: 'Playfair Display', serif;
        }
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