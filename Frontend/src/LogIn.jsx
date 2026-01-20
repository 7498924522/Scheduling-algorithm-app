import React, { useState } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // static credentials
  const STATIC_USERNAME = "USERNAME";
  const STATIC_PASSWORD = "PASSWORD";

  const handleSubmit = () => {
    if (username === STATIC_USERNAME && password === STATIC_PASSWORD) {
      navigate("/home");
    } else {
      alert("Username or Password Incorrect");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/20">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          Welcome Back
        </h2>

        {/* Username */}
        <div className="mb-4">
          <label className="block text-white mb-1">Username</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-white" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="w-full pl-10 pr-3 py-2 rounded-xl bg-white/20 text-white placeholder-gray-300 focus:outline-none"
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-white mb-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-white" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-10 py-2 rounded-xl bg-white/20 text-white placeholder-gray-300 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2 text-white"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
        </div>

        {/* Login Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-purple-600 hover:bg-purple-700 transition text-white mt-4 py-2 rounded-xl font-bold"
        >
          Login
        </button>
      </div>
    </div>
  );
}
