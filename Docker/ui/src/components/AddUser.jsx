import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import bcrypt from 'bcryptjs';


const AddUser = () => {
  const [Name,setUserName] = useState('');
  const [employeeId,setempid] = useState('');
  const [department,setdepartment] = useState('');
  const [Password,setpassword] = useState('');
  const [Role,setrole] = useState('');

  //Don't forget to add fetch data from user database for checking userid exists
  const AddUserSubmit = async (userDetails) => {
    const res = await fetch('/api/addUser',{
        method:'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userDetails),
    });

    if(res.ok){
      toast.success('User Added Successfully');
    } else{
      console.log("resss",res);
        toast.error('Please check the input data');
    }
};
const handleSubmit = async(e) => {
    e.preventDefault();
    // Hash the password
    const hashedPassword = await bcrypt.hash(Password, 10);
    const NewuserDetails = {
      Name,
      employeeId,
        department,
        Password:hashedPassword,
        Role
    };
    AddUserSubmit(NewuserDetails);
}

  return (
    <div className='flex items-center justify-center'>
     <div className=' bg-gray-300 w-[600px] rounded-lg p-10 shadow-lg'>
      <div className='text-center font-bold text-3xl'>Add New User</div>
      <ToastContainer/>
      <form onSubmit={handleSubmit}>
        <div>Name :
          <input 
          type="text" 
        id="name"
        name="name"
        placeholder="Enter your Name"
        value={Name}
        onChange={(e)=>setUserName(e.target.value)}
        className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'/></div>
        <div>Department:
          <input 
          type="text"
        id="department"
        name="department"
        placeholder="Enter your department"
        value={department}
        onChange={(e)=>setdepartment(e.target.value)}
        className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'/></div>
         <div>Employee id:
          <input 
          type="text"
        id="empid"
        name="empid"
        placeholder="Enter your Employee Id"
        value={employeeId}
        onChange={(e)=>setempid(e.target.value)}
        className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'/></div>
   
        <div>Password :
          <input type="text" 
          id="password"
          name="password"
          placeholder="Enter your password"
          value={Password}
          onChange={(e)=>setpassword(e.target.value)}
        className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'/></div>
        <div>Role :
          <input type="text" 
          id="role"
          name="role"
          value={Role}
          onChange={(e)=>setrole(e.target.value)}
          className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'/></div>
        <button type='submit' className="bg-purple-500 hover:bg-purple-600 my-10 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline">Submit</button>
      </form>
     </div>
     </div>
  )
}

export default AddUser