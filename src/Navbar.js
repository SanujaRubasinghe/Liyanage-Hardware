import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';  

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        
        <img 
            src="/logo.png"  
            alt="Your Logo"  
            style={{ width: '100px', height: 'auto' }}  
          />
      </div>
      <ul>
        <li><Link to="/" >Home</Link></li>
        <li><Link to="/job-seekers">Job Seekers</Link></li>
        <li><Link to="/about-us">About Us</Link></li>
        <li><Link to="/contact-us">Contact Us</Link></li>
        <li><Link to="/testh">testh</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
