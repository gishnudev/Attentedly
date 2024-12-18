import React from 'react'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Home } from './pages/Home'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import UserDash from './pages/UserDash';
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from 'react-router-dom'
import AdminDash from './pages/AdminDash';


const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
      <Route path="/" element={<Home />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/SignUp" element={<SignUp />} />
      <Route path='/AdminDash' element={<AdminDash/>}/>
      <Route path='/UserDash' element={<UserDash/>}/>
      </>
    )
  );
return (
  <>
      <ToastContainer />

    <RouterProvider router={router} />
  </>
  )
}

export default App