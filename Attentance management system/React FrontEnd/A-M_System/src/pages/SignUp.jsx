import React, { useState } from 'react';
import bg from '../assets/images/background2.jpg';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Attenedlyicon from '../components/Attenedlyicon';

const SignUp = () => {
    const [Name,setUserName] = useState('');
    const [employeeId,setempid] = useState('');
    const [department,setdepartment] = useState('');
    const [Password,setpassword] = useState('');
    const [Role,setrole] = useState('');
    const navigate = useNavigate()

    const signupSubmit = async (userDetails) => {
        const res = await fetch('/api/signup',{
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userDetails),
        });

        if(res.ok){
          toast.success('Signup Successful');
            alert("Signup Successful")
            navigate('/Login');
        } else{
          console.log("resss",res);
          
            toast.error('Please check the input data');
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const userDetails = {
          Name,
          employeeId,
            department,
            Password,
            Role
        };
        signupSubmit(userDetails);
    }

  return (
    <div
      className="bg-cover bg-center min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundAttachment: 'fixed',
      }}
    >
      <ToastContainer/>
      <div className='fixed top-0 left-0 m-4 '>
        <Attenedlyicon />
      </div>
      <div className="bg-white bg-opacity-90 shadow-lg rounded-lg w-full max-w-md p-8 mx-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Sign Up</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your Name"
              value={Name}
              onChange={(e)=>setUserName(e.target.value)}
              className="block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Employee Id
            </label>
            <input
              type="text"
              id="empid"
              name="empid"
              placeholder="Enter your Employee Id"
              value={employeeId}
              onChange={(e)=>setempid(e.target.value)}
              className="block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Department
            </label>
            <input
              type="text"
              id="Department"
              name="Department"
              placeholder="Enter your Department"
              value={department}
              onChange={(e)=>setdepartment(e.target.value)}
              className="block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={Password}
              onChange={(e)=>setpassword(e.target.value)}
              className="block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label
                className="block text-sm font-medium text-gray-700 mb-1"
            >
                Role
            </label>
            <select
                id="role"
                name="role"
                value={Role}
                onChange={(e)=>setrole(e.target.value)}
                className="block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
            >
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="employee">User</option>
            </select>
            </div>

          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
          >
            Sign Up
          </button>
          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-blue-500 hover:underline focus:outline-none"
            >
              Log In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
