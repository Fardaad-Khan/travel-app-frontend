import React, { useState } from "react";
import axios from "axios";

// Your backend API (Render)
const API_BASE = "https://travel-app-a9mw.onrender.com";

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
        // Register a new user
        await axios.post(`${API_BASE}/auth/register`, {
          username: form.username,
          email: form.email,
          password: form.password,
        });
        alert("✅ Registration successful! You can now log in.");
        setIsRegister(false);
      } else {
        // Log in
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96 text-center">
        <h2 className="text-3xl font-bold mb-4 text-blue-700">
          {isRegister ? "Create an Account" : "Login to Travel Explorer"}
        </h2>

        {isRegister && (
          <input
            className="border rounded p-2 w-full mb-3"
            placeholder="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
          />
        )}

        <input
          className="border rounded p-2 w-full mb-3"
          placeholder="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          className="border rounded p-2 w-full mb-3"
          type="password"
          placeholder="Password"
          name="password"
          value={form.password}
          onChange={handleChange}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 text-white w-full py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition"
        >
          {loading
            ? "Please wait..."
            : isRegister
            ? "Register"
            : "Login"}
        </button>

        <div className="mt-4">
          {isRegister ? (
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => setIsRegister(false)}
                className="text-blue-600 font-medium"
              >
                Log in
              </button>
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              Don’t have an account?{" "}
              <button
                onClick={() => setIsRegister(true)}
                className="text-blue-600 font-medium"
              >
                Register here
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
