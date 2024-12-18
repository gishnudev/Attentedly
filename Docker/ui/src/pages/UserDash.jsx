import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import for navigation
import axios from 'axios'; // Import axios
import homeimg from '../assets/symbols/home.png';
import userCheck from '../assets/symbols/user-check.png';
import profit from '../assets/symbols/profit-report.png';
import userImg from '../assets/symbols/user.png';
import ViewUser from '../components/ViewUser';
import LeaveRequest from '../components/leaveRequest';
import MarkAttendance from '../components/MarkAttentance';
import UserChart from '../components/UserChart';

const LogoutButton = () => {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      // Call the backend logout API
      const response = await axios.post('/api/logout');
      console.log(response.data.message); // Log success message
      localStorage.clear(); // Clear any stored data
      navigate('/'); // Redirect to login page
    } catch (error) {
      console.error('Logout failed:', error.response?.data || error.message);
      alert('Failed to log out. Please try again.');
    }
  };

  return (
    <button
      onClick={logout}
      className="ml-4 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow-md"
    >
      Logout
    </button>
  );
};

const UserDash = () => {
  const [activeComponent, setActiveComponent] = useState('dashboard'); // State to track the active component
  const [userName, setuserName] = useState(''); // State to store user name

  useEffect(() => {
    const storedUserName = localStorage.getItem('Name');
    if (storedUserName) {
      setuserName(storedUserName); // Set the retrieved name to state
    }
  }, []);

  const handleSectionChange = (section) => {
    setActiveComponent(section); // Change the active component
  };

  return (
    <div className="bg-gray-100 h-screen">
      <div className="flex">
        {/* Sidebar */}
        <div className="bg-blue-800 w-1/5 h-screen p-4 font-bold text-white">
          <h1 className="text-2xl text-center pb-8">Dashboard</h1>
          <ul>
            <li
              className="p-3 hover:bg-blue-500 rounded-lg mb-4 flex cursor-pointer"
              onClick={() => handleSectionChange('dashboard')}
            >
              <img className="w-8 mr-6" src={homeimg} alt="" />
              <span className="p-1">Dashboard</span>
            </li>
            <li
              className="p-3 hover:bg-blue-500 rounded-lg mb-4 flex cursor-pointer"
              onClick={() => handleSectionChange('MarkAttendance')}
            >
              <img className="w-8 mr-6" src={userCheck} alt="" />
              <span className="p-1">Mark Attendance</span>
            </li>
            <li
              className="p-3 hover:bg-blue-500 rounded-lg mb-4 flex cursor-pointer"
              onClick={() => handleSectionChange('Requestsleave')}
            >
              <img className="w-8 mr-6" src={profit} alt="" />
              <span className="p-1">Request Leave</span>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="w-full">
          <div className="flex justify-between items-center m-12">
            <input
              className="p-4 rounded-lg w-[600px] focus:outline-blue-500 shadow-lg"
              type="text"
              placeholder="Search..."
            />
            <div className="flex items-center">
              <img
                src={userImg}
                alt=""
                className="w-16 h-16 bg-gray-300 p-4 rounded-full shadow-md shadow-blue-300"
              />
              <h2 className="ml-4">Welcome User{userName && `, ${userName}`}</h2>
              {/* Logout Button */}
              <LogoutButton />
            </div>
          </div>

          {/* Content Area */}
          <div className="contentClass p-6">
            {activeComponent === 'dashboard' && <UserChart/>}
            {activeComponent === 'MarkAttendance' && <MarkAttendance />}
            {activeComponent === 'Requestsleave' && <LeaveRequest />}
            {activeComponent === 'employees' && <ViewUser />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDash;
