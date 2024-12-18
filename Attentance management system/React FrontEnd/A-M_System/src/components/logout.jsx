import React from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import axios from 'axios';

const LogoutButton = () => {
  const navigate = useNavigate(); // React Router hook for navigation

  const logout = async () => {
    try {
      // Call the backend logout API
      const response = await axios.post('/api/logout');
      console.log(response.data.message); // Log the response message (if any)

      // Redirect to the login page after successful logout
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error.response?.data || error.message);
      alert('Failed to log out. Please try again.');
    }
  };

  return (
    <button onClick={logout} style={styles.button}>
      Logout
    </button>
  );
};

const styles = {
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#ff4d4d',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default LogoutButton;
