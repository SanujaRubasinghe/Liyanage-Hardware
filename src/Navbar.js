import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Navbar.css';

function Navbar() {
  const [isShrunk, setIsShrunk] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollThreshold = 100;
      // If scrolling down, shrink the navbar.
      if (currentScrollY > lastScrollY.current) {
        setIsShrunk(true);
      } else if (currentScrollY < lastScrollY.current) {
        setIsShrunk(false);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

   // check if the user is logged in
   useEffect(() => {
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)
  }, [])

  return (
    <nav className={`navbar ${isShrunk ? 'shrunk' : ''}`}>
      <div className="logo">
        <img 
          src="/images/l1.png"
          alt="Hardware Logo"  
          // The inline style is our default size.
          style={{ width: '120px', height: 'auto' }}  
        />
      </div>

      <div className="left">
        <div className='tele'>
          <h4 className='tele-h'>Tele: 072211324 / 0754232212</h4>
        </div>

        <div className="social-icons">

        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="icon">
        <i className="fas fa-compass"></i>
        </a>

          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="icon">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="icon">
            <i className="fab fa-whatsapp"></i>
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="icon">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="icon">
            <i className="fab fa-tiktok"></i>
          </a>

          <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="icon">
            <i className="fab fa-youtube"></i>
          </a>
        </div>

        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/products">Products</Link></li>
          <li><Link to="/about-us">About Us</Link></li>
          <li><Link to="/contact-us">Contact</Link></li>
          <li><Link to="/category">Categories</Link></li>
        </ul>
        <div className="auth-section">
          <Link to="/cart" className="cart-icon">
            <i className="fas fa-shopping-cart"></i>
            <span className="cart-count">0</span>
          </Link>
          <Link to="/login" className='login-button'>Log in</Link>       
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
