import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
function LogIn() {

  const navigate=useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  
  

  
  
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
      if (username === "rahul" && password === "12345") {
        
        alert(`Dear Organiser you login successfully`);
        navigate("/home")
        // setMessage("✅ Login Successful!");
      } else {
        setMessage("❌ Invalid Username or Password!");
      }
    } else {
      setMessage("");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 ">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6 " >Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 text-gray-700">Username</label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-gray-700">Password</label>
            <input
              type="password"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>
          <button
            
            // onClick={LLL}
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium"
          >
            Login
          </button>
        </form>
        {message && (
          <p
            className={`text-center mt-4 font-semibold ${
              message.includes("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>


      {/* <Router>
        <Routes>
          <Route path="/home" element={<Home/>}  />
        </Routes>
    
     </Router> */}
    </div>

   

  );
}

export default LogIn;
