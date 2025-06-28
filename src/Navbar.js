import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

import API from "./api"
import './Navbar.css';

function Navbar() {
  const [isShrunk, setIsShrunk] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current) {
        setIsShrunk(true);
      } else {
        setIsShrunk(false);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(open => !open);
  };
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className={`navbar ${isShrunk ? 'shrunk' : ''}`}>
      <div className="logo">
        <img src="/images/l1.png" alt="Hardware Logo" />
      </div>

      <button 
        className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
      >
        <span/>
        <span/>
        <span/>
      </button>

      {isMobileMenuOpen && (
        <div className="mobile-overlay" onClick={closeMobileMenu}/>
      )}

      <div className={`left ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <button className="mobile-close" onClick={closeMobileMenu} aria-label="Close menu">
          <i className="fas fa-times"></i>
        </button>

        <div className="tele">
          <h4 className="tele-h">Tele: 072211324 / 0754232212</h4>
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
          <li><Link to="/" onClick={closeMobileMenu}>Home</Link></li>
          <li><Link to="/products" onClick={closeMobileMenu}>Products</Link></li>
          <li><Link to="/about-us" onClick={closeMobileMenu}>Complaints</Link></li>
          <li><Link to="/admin" onClick={closeMobileMenu}>Admin</Link></li>
          <li><Link to="/contact-us" onClick={closeMobileMenu}>Category</Link></li>
          <li><Link to="/feedback" onClick={closeMobileMenu}>Feedback</Link></li>
          <li><Link to="/services" onClick={closeMobileMenu}>AboutUsNew</Link></li>
        </ul>

        <div className="auth-section">
          <Link to="/cart" className="cart-icon" onClick={closeMobileMenu}>
            <i className="fas fa-shopping-cart"></i>
            <span className="cart-count">0</span>
          </Link>
          {/* {user ? (
            <Link to="/login" className='login-button' onClick={closeMobileMenu}>Log in</Link> 
          ) : (<>
            <button className='login-button' onClick={getProfile}>Profile</button>
            <button className='login-button' onClick={logout}>Log out</button>  
          </>)} */}
          <Link to="/profile" className='login-button' onClick={closeMobileMenu}>Profile</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;