import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function LogIn() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    let formErrors = {};

    // Validation
    if (!username) {
      formErrors.username = "Username is required!";
    }
    if (!password) {
      formErrors.password = "Password is required!";
    } else if (password.length < 5) {
      formErrors.password = "Password must be at least 5 characters!";
    }

    setErrors(formErrors);

    // If no errors, check credentials
    if (Object.keys(formErrors).length === 0) {
      setIsLoading(true);
      // Simulate loading
      setTimeout(() => {
        if (username === "rahulrrr" && password === "123456") {
          alert(`Dear Organiser you login successfully`);
          navigate("/home");
        } else {
          setMessage("❌ Invalid Username or Password!");
          setIsLoading(false);
        }
      }, 800);
    } else {
      setMessage("");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-4">
     
      <div className="relative bg-white backdrop-blur-lg p-8 rounded-3xl shadow-2xl w-74 md:w-full max-w-md transform transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl">
        {/* Header with icon */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg transform transition-transform hover:rotate-12">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome Here
          </h2>
          
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Username Field */}
          <div className="relative">
            <label className="block mb-1 text-gray-700 font-medium">
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                className={`w-full border-2 rounded-xl px-4 py-3 pl-12 focus:outline-none transition-all duration-300 ${
                  errors.username
                    ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                    : "border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                }`}
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setErrors({ ...errors, username: "" });
                  setMessage("");
                }}
                placeholder="Enter username"
              />
              <svg
                className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            {errors.username && (
              <p className="text-red-500 text-sm mt-2 flex items-center gap-1 animate-shake">
                <span>⚠️</span> {errors.username}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="relative">
            <label className="block mb-1 text-gray-700 font-medium">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                className={`w-full border-2 rounded-xl px-4 py-3 pl-12 focus:outline-none transition-all duration-300 ${
                  errors.password
                    ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                    : "border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                }`}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors({ ...errors, password: "" });
                  setMessage("");
                }}
                placeholder="Enter password"
              />
              <svg
                className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-2 flex items-center gap-1 animate-shake">
                <span>⚠️</span> {errors.password}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 rounded-xl font-semibold shadow-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Logging in...
              </>
            ) : (
              <>
                Login
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </>
            )}
          </button>
        </form>

        {/* Error Message */}
        {message && (
          <div
            className={`mt-6 p-4 rounded-xl font-semibold text-center transform transition-all duration-300 animate-bounce-in ${
              message.includes("✅")
                ? "bg-green-50 text-green-600 border-2 border-green-200"
                : "bg-red-50 text-red-600 border-2 border-red-200"
            }`}
          >
            {message}
          </div>
        )}

        
       
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        @keyframes bounce-in {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
        .animate-bounce-in {
          animation: bounce-in 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}

export default LogIn;