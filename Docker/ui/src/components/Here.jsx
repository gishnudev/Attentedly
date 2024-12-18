import React from 'react';
import { Link } from 'react-router-dom';
import img from '../assets/images/img2.png'
const Here = () => {
  return (
    <section className="relative flex items-center justify-center w-full py-20 lg:py-40 bg-black">
      <div className="container flex flex-col items-center max-w-6xl mx-auto text-center lg:flex-row lg:items-start">
        <div className="max-w-xl mb-8 lg:mb-0 lg:w-1/2">
          <h1 className="text-3xl font-black leading-tight text-white sm:text-6xl">   
          Simplify Attendance Tracking
          </h1>
          <p className="mt-4 text-lg text-gray-600">
          Manage attendance effortlessly with our smart and intuitive system, designed to save you time and boost productivity.
          </p>
          <Link
            to='/SignUp'
            className="inline-block px-8 py-4 mt-6 text-white bg-indigo-600 rounded shadow hover:bg-indigo-700"
          >
            Signup Today!
          </Link>
        </div>
        <div className="w-full lg:w-1/2">
          <img
            src={img}
            className="w-full"
          />
        </div>
      </div>
    </section>
  );
};

export default Here;
