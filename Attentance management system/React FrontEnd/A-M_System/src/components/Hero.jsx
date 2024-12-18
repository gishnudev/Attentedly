import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <>
      <div className="relative h-screen bg-cover">
        {/* Video Background */}
        <video
          autoPlay
          muted
          loop
          className="absolute inset-0 w-full h-full object-cover z-[-1]"
        >
          <source
            src="/src/assets/images/video.mp4"
            type="video/mp4"
          />
        </video>

        {/* Overlay Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white bg-black bg-opacity-50 px-4">
          <h1 className="text-8xl font-extrabold ">
          Attendly
          </h1>
          <p className="mt-4 text-lg sm:text-xl">
            The Ultimate Solution for Effortless Attendance Management
          </p>
          <Link
            to="/login"
            className="mt-8 px-6 py-3 bg-indigo-600 text-white font-medium text-lg rounded shadow hover:bg-indigo-700"
          >
            Go to Login
          </Link>

          {/* Downward Indicator */}
          <a
            href="#features"
            className="mt-[100px] flex flex-col items-center text-white animate-bounce"
          >
            <span className="mb-2">Scroll Down</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </a>
        </div>
      </div>
    </>
  );
};

export default Hero;
