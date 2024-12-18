import React, { useEffect, useState } from 'react';
import homeimg from '../assets/symbols/home.png';
import userCheck from '../assets/symbols/user-check.png';
import profit from '../assets/symbols/profit-report.png';
import absent from '../assets/symbols/absent.png';
import userImg from '../assets/symbols/user.png';
import AddUser from '../components/AddUser';
import ViewUser from '../components/ViewUser';
import UserReq from '../components/UserReq';
import Attentance from '../components/Attentance'
import division from '../assets/symbols/user.png'
import LogouButton from '../components/logouButton';
import AdDash from '../components/AdDash';

const AdminDash = () => {
  const [activeComponent, setActiveComponent] = useState('dashboard'); // State to track the active component
  const [adminName, setAdminName] = useState(''); // State to store admin name

  useEffect(() => {
    const storedAdminName = localStorage.getItem('Name');
    if (storedAdminName) {
      setAdminName(storedAdminName); // Set the retrieved name to state
    }
  }, []);

  const handleSectionChange = (section) => {
    setActiveComponent(section); // Change the active component
  };

  return (
    <div className="bg-gray-100 h-screen ">
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
              onClick={() => handleSectionChange('Attentance')}
            >
              <img className="w-8 mr-6 " src={userCheck} alt="" />
              <span className="p-1">Attentance</span>
            </li>
            <li
              className="p-3 hover:bg-blue-500 rounded-lg mb-4 flex cursor-pointer"
              onClick={() => handleSectionChange('employees')}
            >
              <img className="w-8 mr-6 filter grayscale brightness-0" src={ division} alt="" />
              <span className="p-1">Employees</span>
            </li>
            <li
              className="p-3 hover:bg-blue-500 rounded-lg mb-4 flex cursor-pointer"
              onClick={() => handleSectionChange('addUser')}
            >
              <img className="w-8 mr-6" src={profit} alt="" />
              <span className="p-1">Add User</span>
            </li>
            <li
              className="p-3 hover:bg-blue-500 rounded-lg mb-4 flex cursor-pointer"
              onClick={() => handleSectionChange('leaveRequests')}
            >
              <img className="w-8 mr-6 filter grayscale brightness-0" src={absent} alt="" />
              <span className="p-1">Leave Requests</span>
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
              <h2 className="ml-4">Welcome Admin{adminName && `, ${adminName}`}</h2>
              <LogouButton /> {/* Logout button added here */}
            </div>
          </div>

          {/* Content Area */}
          <div className="contentClass p-6">
            {activeComponent === 'dashboard' && <AdDash/>}
            {activeComponent === 'Attentance' && <Attentance />}
            {activeComponent === 'addUser' && <AddUser />}
            {activeComponent === 'employees' && <ViewUser />}
            {activeComponent === 'leaveRequests' && <UserReq />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDash;
