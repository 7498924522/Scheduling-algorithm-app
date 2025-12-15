import React, { useState } from "react";
import axios from "axios";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    username: "", // email or username
    password: "",
  });
  const navigate=useNavigate();

  const handleSubmit = async () => {
    try {
      const res = await axios.post("http://localhost:8080/auth/login", {
        username: loginData.username,
        password: loginData.password,
      });
      alert(res.data);

      if (res.data === "Login successful!") {
      // Save user as logged in
      localStorage.setItem("loggedInUser", loginData.username);
      // redirect to home page
      window.location.href = "/home"; // or use navigate("/home") if using react-router
    }

      
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/20">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Welcome Back</h2>

        {/* Email / Username */}
        <div className="mb-4">
          <label className="block text-white mb-1">Email or Username</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-white" />
            <input
              type="text"
              placeholder="Enter email or username"
              value={loginData.username}
              onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
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
              placeholder="••••••••"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
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

        {/* Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-purple-600 hover:bg-purple-700 transition text-white mt-4 py-2 rounded-xl font-bold cursor-pointer"
        >
          Login
        </button>

        <p className="mt-4 text-center text-white  text-sm">
          Create an Account <span onClick={()=>navigate("/signup")} className="text-purple-300 cursor-pointer hover:text-purple-200">SignUp</span>
        </p>
      </div>
    </div>
  );
}
