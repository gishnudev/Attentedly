import React from "react";
import bgImage from "../assets/images/background2.jpg"; // Adjust the path to match your project structure
import sideImage from "../assets/images/background3.jpg"; // Adjust the path to match your project structure
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Attenedlyicon from "../components/Attenedlyicon";

const Login = () => {
  const [Name, setName] = useState("");
  const [Password, setPassword] = useState("");
  const navigate = useNavigate();

  const loginSubmit = async (e) => {
    e.preventDefault();
    const loginDetails = {
      Name,
      Password,
    };
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginDetails),
      credentials: "include",
    });
    if (res.ok) {
      const data = await fetch("/api/viewUser", {
        headers: { "Content-Type": "application/json" },
      });
      
      const user = await data.json();
      console.log("User data:",user);
      console.log("Login success");
      
      toast.success("Logging in...");
      setTimeout(() => {
        if (user === "admin") {
          localStorage.setItem('Name', Name); 
          navigate("/AdminDash");
        } else {
          localStorage.setItem('Name', Name); 
          navigate("/UserDash");
        }
      }, 1000);
    } else {
      toast.error("Please check your credentials.");
    }
  };

  return (
    <div
      className="bg-cover bg-center bg-no-repeat min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
       <div className='fixed top-0 left-0 m-4 '>
        <Attenedlyicon />
      </div>
      <ToastContainer />
      <div className="bg-white bg-opacity-90 rounded-2xl shadow-lg max-w-4xl w-full overflow-hidden flex">
        {/* Left Section - Form */}
        <div className="w-full lg:w-2/3 p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-center text-gray-800">
            Welcome Back!
          </h2>
          <p className="text-sm text-center text-gray-600 mt-2">
            Log in to your account to continue
          </p>
          <form className="mt-8 space-y-6" onSubmit={loginSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="Name"
                type="text"
                value={Name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your email or username"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <Link
                to="#"
                className="text-blue-600 hover:underline focus:outline-none"
              >
                Forgot Password?
              </Link>
            </div>
            <div>
              <button
                type="submit"
                className="w-full py-2 px-4 text-white bg-blue-500 hover:bg-blue-600 rounded-lg shadow-md transition duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
              >
                Log In
              </button>
            </div>
          </form>
          <p className="text-center text-sm text-gray-600 mt-6">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-600 hover:underline focus:outline-none"
            >
              Sign Up
            </Link>
          </p>
        </div>

        {/* Right Section - Image */}
        <div className="hidden lg:block w-1/3 bg-cover bg-center">
          <img
            src={sideImage}
            alt="Visual Side Panel"
            className="h-full w-full object-cover rounded-r-2xl"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
