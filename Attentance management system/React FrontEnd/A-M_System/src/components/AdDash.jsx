import React, { useEffect, useState } from 'react'

const AdDash = () => {
  // Initialize state to store user data
  const [allUsers, setAllUsers] = useState([]);
  const [allAtt, setallAtt] = useState("");
  
  // Fetch users data 
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const res = await fetch('/api/viewAll', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (res.ok) {
          const data = await res.json();
          setAllUsers(data); // Set the fetched data to the state
        } else {
          console.log("User data not found");
        }
      } catch (err) {
        console.log("Server error");
      }
    };

    fetchAllUsers();
  }, []);

  //fetch all attentance
  useEffect(() => {
    const fetchallAtt = async () => {
      try {
        const res = await fetch('/api/viewallattentanceToday', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (res.ok) {
          const data = await res.json();
          setallAtt(data); // Set the fetched data to the state
        } else {
          console.log("Attentance data not found");
        }
      } catch (err) {
        console.log("Server error");
      }
    };

    fetchallAtt();
  }, []);


  // Get the number of users
  const numberOfUsers = allUsers.length;
  const numberOfAttentance = allAtt.length;

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Display the number of users */}
      <div className="bg-white h-24 ml-12 pl-8 pt-3 rounded-lg relative shadow-xl">
        <h2 className="text-4xl text-blue-600 font-bold">{numberOfUsers}</h2>
        <p className="text-xl text-gray-500">Total Employees</p>
      </div>
      {/* Your other dashboard items */}
      {/* Example: */}
      <div className="bg-white h-24 ml-12 pl-8 pt-3 rounded-lg relative shadow-xl">
        <h2 className="text-4xl text-blue-600 font-bold">{numberOfAttentance}</h2>
        <p className="text-xl text-gray-500">Attentance Marked Today</p>
      </div>
    </div>
  );
};

export default AdDash;
