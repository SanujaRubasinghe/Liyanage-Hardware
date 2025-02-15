import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [isShrunk, setIsShrunk] = useState(false);
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

  return (
    <nav className={`navbar ${isShrunk ? 'shrunk' : ''}`}>
      <div className="logo">
        <img 
          src="/hardware-logo.png"
          alt="Hardware Logo"  
          // The inline style is our default size.
          style={{ width: '120px', height: 'auto' }}  
        />
      </div>

      <div className="left">
        <div className='tele'>
          <h4 className='tele-h'>tele: 072211324 / 0754232212</h4>
        </div>

        <div className="social-icons">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="icon">
        <i className="fas fa-compass"></i>
        </a>
        </div>

        <div className="social-icons">
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
        </div>

        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/products">Products</Link></li>
          <li><Link to="/about-us">About Us</Link></li>
          <li><Link to="/contact-us">Contact Us</Link></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
