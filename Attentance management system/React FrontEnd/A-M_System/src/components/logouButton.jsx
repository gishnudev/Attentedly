import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios

const LogouButton = () => { // Component name updated to PascalCase
  const navigate = useNavigate();

  const logout = async () => {
    try {
      // Call the backend logout API
      const response = await axios.post('/api/logout'); // Ensure your backend API endpoint is correct
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

export default LogouButton;
