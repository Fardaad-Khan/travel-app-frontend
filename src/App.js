import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./components/Navbar";
import DestinationGrid from "./components/DestinationGrid";
import BookingModal from "./components/BookingModal";
import BookingsList from "./components/BookingsList";
import LoginForm from "./components/LoginForm";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const API_BASE = "https://travel-app-a9mw.onrender.com";

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
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [darkMode, setDarkMode] = useState(false);
  const [showBookings, setShowBookings] = useState(false);

  useEffect(() => {
    axios
      .get(`${API_BASE}/destinations/`)
      .then((res) => {
        setDestinations(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching destinations:", err);
        setLoading(false);
      });
  }, []);

  if (!token) return <LoginForm onLogin={(t) => setToken(t)} />;

  return (
    <div
      className={
        darkMode
          ? "dark bg-gray-900 text-gray-200"
          : "bg-gradient-to-br from-blue-50 to-blue-200 text-gray-800"
      }
    >
      <Navbar
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
        onViewBookings={() => setShowBookings(true)}
      />

      <div className="flex flex-col items-center py-8">
        <h1 className="text-4xl font-bold mb-2">🌍 Travel Explorer</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Discover and book your favorite destinations
        </p>

        {loading ? (
          <p className="text-gray-500 dark:text-gray-400">Loading...</p>
        ) : (
          <>
            <DestinationGrid
              destinations={destinations}
              onBook={(place) => setSelected(place)}
            />
            <div className="w-11/12 h-[500px] rounded-xl shadow-xl overflow-hidden mt-12">
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
          </>
        )}

        {selected && (
          <BookingModal selected={selected} onClose={() => setSelected(null)} />
        )}
        {showBookings && (
          <BookingsList onClose={() => setShowBookings(false)} />
        )}
      </div>
    </div>
  );
}

export default App;
