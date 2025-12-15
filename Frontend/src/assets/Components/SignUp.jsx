import React, { useState } from "react";
import axios from "axios";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  // universal change handler
  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // sign-up function
  const handleSubmit = async () => {
    try {
      const res = await axios.post("http://localhost:8080/auth/signup", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      alert(res.data);
      navigate("/login");
    } catch (error) {
      alert("Signup failed: " + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="md:w-full max-w-md bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/20">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">
          Create Account
        </h2>

        {/* Username */}
        <div className="mb-4">
          <label className="block text-white mb-1">Username</label>
          <div className="relative">
            <User className="absolute left-3 top-3 text-white" />
            <input
              type="text"
              value={formData.username}
              onChange={(e) => handleChange("username", e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-xl bg-white/20 text-white placeholder-gray-300"
              placeholder="777 Charlie"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-white mb-1">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-white" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-xl bg-white/20 text-white placeholder-gray-300"
              placeholder="you@example.com"
              required
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
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              className="w-full pl-10 pr-10 py-2 rounded-xl bg-white/20 text-white placeholder-gray-300"
              placeholder="••••••••"
              required
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

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="w-full bg-purple-500 hover:bg-purple-600 text-white mt-3 py-2 rounded-xl font-bold cursor-pointer"
        >
          Sign Up
        </button>

        <p className="mt-4 text-center text-white">
          
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-purple-300 hover:text-purple-200 font-semibold cursor-pointer"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
