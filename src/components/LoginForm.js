import React, { useState } from "react";
import axios from "axios";
import { Globe2, Mail, Lock, User, Loader2, Eye, EyeOff } from "lucide-react";

const API_BASE = process.env.REACT_APP_API_BASE || "https://travel-app-a9mw.onrender.com";

const LoginForm = ({ onLogin, darkMode }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = isLoginMode ? "/auth/login" : "/auth/register";
      const payload = isLoginMode
        ? { email: formData.email, password: formData.password }
        : { username: formData.username, email: formData.email, password: formData.password };

      const response = await axios.post(`${API_BASE}${endpoint}`, payload);

      if (response.data.access_token) {
        onLogin(response.data.access_token, {
          username: formData.username || formData.email.split('@')[0],
          email: formData.email
        });
      }
    } catch (err) {
      console.error("Auth error:", err);
      setError(
        err.response?.data?.message || 
        (isLoginMode ? "Invalid email or password" : "Registration failed. Please try again.")
      );
      
      // For demo purposes, allow login with any credentials after showing error
      if (isLoginMode && formData.email && formData.password) {
        setTimeout(() => {
          onLogin("demo-token", {
            username: formData.email.split('@')[0],
            email: formData.email
          });
        }, 1500);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      darkMode 
        ? "bg-gray-900" 
        : "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"
    }`}>
      <div className={`w-full max-w-md transform transition-all ${
        darkMode ? "bg-gray-800" : "bg-white"
      } rounded-2xl shadow-2xl overflow-hidden`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-white text-center">
          <Globe2 className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Travel Explorer</h1>
          <p className="text-blue-100">
            {isLoginMode ? "Welcome back!" : "Start your journey today"}
          </p>
        </div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Username (Register only) */}
            {!isLoginMode && (
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium mb-2">
                  <User className="h-4 w-4" />
                  <span>Username</span>
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 focus:border-blue-500"
                      : "bg-gray-50 border-gray-300 focus:border-blue-500"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  placeholder="Choose a username"
                  required={!isLoginMode}
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium mb-2">
                <Mail className="h-4 w-4" />
                <span>Email</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 focus:border-blue-500"
                    : "bg-gray-50 border-gray-300 focus:border-blue-500"
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                placeholder="your@email.com"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium mb-2">
                <Lock className="h-4 w-4" />
                <span>Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 pr-12 rounded-lg border transition-colors ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 focus:border-blue-500"
                      : "bg-gray-50 border-gray-300 focus:border-blue-500"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  placeholder={isLoginMode ? "Enter your password" : "Choose a strong password"}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold transition-all transform shadow-lg ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:scale-105 text-white"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center space-x-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>{isLoginMode ? "Signing in..." : "Creating account..."}</span>
                </span>
              ) : (
                isLoginMode ? "Sign In" : "Create Account"
              )}
            </button>
          </form>

          {/* Toggle Mode */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isLoginMode ? "Don't have an account?" : "Already have an account?"}
            </p>
            <button
              onClick={() => {
                setIsLoginMode(!isLoginMode);
                setError("");
                setFormData({ username: "", email: "", password: "" });
              }}
              className="mt-2 text-blue-500 hover:text-blue-600 font-semibold transition-colors"
            >
              {isLoginMode ? "Sign up now" : "Sign in instead"}
            </button>
          </div>

          {/* Demo Note */}
          <div className={`mt-6 p-3 rounded-lg text-xs text-center ${
            darkMode ? "bg-gray-700" : "bg-gray-100"
          }`}>
            <p className="text-gray-600 dark:text-gray-400">
              Demo Mode: Use any email/password to explore
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;