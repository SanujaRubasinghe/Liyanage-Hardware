import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';  // Import the CSS file

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        
        <img 
            src="/logo.png"  // Use the path to the logo image in the public folder
            alt="Your Logo"  // Alt text for accessibility
            style={{ width: '100px', height: 'auto' }}  // Adjust the size as needed
          />
      </div>
      <ul>
        <li><Link to="/" >Home</Link></li>
        <li><Link to="/job-seekers">Job Seekers</Link></li>
        <li><Link to="/about-us">About Us</Link></li>
        <li><Link to="/contact-us">Contact Us</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
