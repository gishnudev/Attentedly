import React from 'react'
import Attenedicon from '../assets/images/logo1.png'
import { Link } from 'react-router-dom'

const Attenedlyicon = () => {
  return (
    <div>
        <Link to="/" >
        <img src={Attenedicon}  className="w-18 h-16 mr-auto"
          alt="Logo" />
        </Link>
        
    </div>
  )
}

export default Attenedlyicon