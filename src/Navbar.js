import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import API from "./api";
import './Navbar.css';
import { useCart } from './Components/CartContext';

function Navbar() {
  const [isShrunk, setIsShrunk] = useState(false);
  const {cartCount} = useCart()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const { user, logout } = useContext(AuthContext);
  const location = useLocation(); // Get current route

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsShrunk(currentScrollY > lastScrollY.current);
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(open => !open);
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
        <span />
        <span />
        <span />
      </button>

      {isMobileMenuOpen && <div className="mobile-overlay" onClick={closeMobileMenu} />}

      <div className={`left ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <button className="mobile-close" onClick={closeMobileMenu} aria-label="Close menu">
          <i className="fas fa-times"></i>
        </button>

        <div className="tele">
          <h4 className="tele-h">Tele: 072211324 / 0754232212</h4>
        </div>

        <div className="social-icons">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="icon"><i className="fab fa-facebook-f"></i></a>
          <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="icon"><i className="fab fa-whatsapp"></i></a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="icon"><i className="fab fa-instagram"></i></a>
          <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="icon"><i className="fab fa-tiktok"></i></a>
        </div>

        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/products">Products</Link></li>
          <li><Link to="/complaint">Complaints</Link></li>
          <li><Link to="/categories">Category</Link></li>
          <li><Link to="/feedback">Feedback</Link></li>
          <li><Link to="/about-us">About Us</Link></li>



        </ul>

        <div className="auth-section">
          <Link to="/cart" className="cart-icon" onClick={closeMobileMenu}>
            <i className="fas fa-shopping-cart"></i>
            <span className="cart-count">{cartCount}</span>
          </Link>
          {/* {user ? (
            <Link to="/login" className='login-button'>Log in</Link> 
          ) : (<>
            <button className='login-button' onClick={getProfile}>Profile</button>
            <button className='login-button' onClick={logout}>Log out</button>  
          </>)} */}
          {/* <Link to="/profile" className='login-button'>Profile</Link> */}
            
        </div>
      </div>
      </div>
    </nav>
  );
}

export default Navbar;
