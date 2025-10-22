import React, { useState } from "react";
import axios from "axios";
import travelBg from "../assets/travel-bg.jpg"; // Correct relative path

// Your backend API (Render)
const API_BASE = "https://travel-app-1-1lq9.onrender.com";

export default function LoginForm({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (isRegister) {
        await axios.post(`${API_BASE}/auth/register`, {
          username: form.username,
          email: form.email,
          password: form.password,
        });
        alert("✅ Registration successful! You can now log in.");
        setIsRegister(false);
      } else {
        const res = await axios.post(`${API_BASE}/auth/login`, {
          email: form.email,
          password: form.password,
        });
        localStorage.setItem("token", res.data.access_token);
        onLogin(res.data.access_token);
      }
    } catch (err) {
      console.error(err);
      alert("❌ " + (err.response?.data?.message || "Login/Register failed!"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage: `url(${travelBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay for better readability */}
      <div className="flex-1 bg-black/50 flex flex-col justify-center items-center px-4">
        {/* Heading */}
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-8 text-center drop-shadow-lg">
          Travel Next
        </h1>

        {/* Why Choose Us */}
        <div className="max-w-2xl text-center text-white mb-12">
          <p className="text-lg md:text-xl mb-2">
            Explore the world with comfort and confidence. Our platform helps you
            plan, book, and enjoy trips effortlessly.
          </p>
          <p className="text-md md:text-lg">
            Secure bookings, personalized recommendations, and unforgettable
            experiences await you.
          </p>
        </div>

        {/* Login/Register Form with glass effect */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl w-full max-w-md p-10">
          <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">
            {isRegister ? "Create an Account" : "Login to Travel Next"}
          </h2>

          {isRegister && (
            <input
              className="border border-gray-300 rounded-lg p-3 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Username"
              name="username"
              value={form.username}
              onChange={handleChange}
            />
          )}

          <input
            className="border border-gray-300 rounded-lg p-3 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />

          <input
            className="border border-gray-300 rounded-lg p-3 w-full mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="password"
            placeholder="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 w-full rounded-xl shadow-lg transition-all disabled:opacity-50"
          >
            {loading
              ? "Please wait..."
              : isRegister
              ? "Register"
              : "Login"}
          </button>

          <div className="mt-6 text-center">
            {isRegister ? (
              <p className="text-sm text-gray-700">
                Already have an account?{" "}
                <button
                  onClick={() => setIsRegister(false)}
                  className="text-blue-600 font-medium hover:underline"
                >
                  Log in
                </button>
              </p>
            ) : (
              <p className="text-sm text-gray-700">
                Don’t have an account?{" "}
                <button
                  onClick={() => setIsRegister(true)}
                  className="text-blue-600 font-medium hover:underline"
                >
                  Register here
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-white/80 text-sm">
          &copy; {new Date().getFullYear()} Travel Next. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
