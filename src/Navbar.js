'use client';
import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useLocation } from "./router-compat";
import { AuthContext } from "./context/AuthContext";
import "./Navbar.css";
import "./Components/Header.css";
import { useCart } from "./Components/CartContext";

function Navbar() {
  const [isShrunk, setIsShrunk] = useState(false);
  const { cartCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);
  const lastScrollY = useRef(0);
  const location = useLocation();

  const { user } = useContext(AuthContext);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsShrunk(currentScrollY > 40 && currentScrollY > lastScrollY.current);
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsPolicyOpen(false);
  }, [location.pathname]);

  const toggleMobileMenu = () => setIsMobileMenuOpen((open) => !open);
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsPolicyOpen(false);
  };

  const togglePolicy = (e) => {
    e.preventDefault();
    setIsPolicyOpen((prev) => !prev);
  };

  return (
    <header className={`site-header ${isShrunk ? "shrunk" : ""}`}>
      {/* Top Banner Image Header */}
      <header className="header-container-h">
        <img 
          src="/images/n3.png" 
          alt="Website Header" 
          className="header-image" 
        />
      </header>

      {/* Main Navbar */}
      <nav className="navbar">
        <div className="navbar-container">
          {/* Far Left Logo */}
          <div className="logo">
            <Link to="/" onClick={closeMobileMenu}>
              <img src="/images/l1.png" alt="Liyanage Hardware Logo" />
            </Link>
          </div>

          {/* Navigation Links / Mobile Drawer */}
          <div className={`nav-menu ${isMobileMenuOpen ? "mobile-open" : ""}`}>
            <div className="mobile-drawer-header">
              <div className="tele-mobile">
                <i className="fas fa-phone-alt"></i> 072211324 / 0754232212
              </div>
              <button
                className="mobile-close"
                onClick={closeMobileMenu}
                aria-label="Close menu"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <ul className="nav-links">
              <li>
                <Link
                  to="/"
                  onClick={closeMobileMenu}
                  className={location.pathname === "/" ? "active" : ""}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  onClick={closeMobileMenu}
                  className={location.pathname === "/products" ? "active" : ""}
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  to="/categories"
                  onClick={closeMobileMenu}
                  className={
                    location.pathname.startsWith("/categories") || location.pathname.startsWith("/category")
                      ? "active"
                      : ""
                  }
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  to="/about-us"
                  onClick={closeMobileMenu}
                  className={location.pathname === "/about-us" ? "active" : ""}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/contact-us"
                  onClick={closeMobileMenu}
                  className={location.pathname === "/contact-us" ? "active" : ""}
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/feedback"
                  onClick={closeMobileMenu}
                  className={location.pathname === "/feedback" ? "active" : ""}
                >
                  Feedback
                </Link>
              </li>
              <li>
                <Link
                  to="/complaint"
                  onClick={closeMobileMenu}
                  className={location.pathname === "/complaint" ? "active" : ""}
                >
                  Complaints
                </Link>
              </li>

              <li className={`dropdown ${isPolicyOpen ? "open" : ""}`}>
                <a
                  href="#policy"
                  className="dropdown-title"
                  onClick={togglePolicy}
                >
                  Policy <i className={`fas fa-chevron-down dropdown-arrow ${isPolicyOpen ? "rotated" : ""}`}></i>
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <Link
                      to="/shipping-policy"
                      onClick={closeMobileMenu}
                      className={location.pathname === "/shipping-policy" ? "active" : ""}
                    >
                      Shipping Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/return-policy"
                      onClick={closeMobileMenu}
                      className={location.pathname === "/return-policy" ? "active" : ""}
                    >
                      Return Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/terms"
                      onClick={closeMobileMenu}
                      className={location.pathname === "/terms" ? "active" : ""}
                    >
                      Terms & Conditions
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/disclaimer"
                      onClick={closeMobileMenu}
                      className={location.pathname === "/disclaimer" ? "active" : ""}
                    >
                      Disclaimer
                    </Link>
                  </li>
                </ul>
              </li>

              {/* Auth item inside mobile drawer */}
              <li className="mobile-auth-item">
                {user ? (
                  <Link to="/profile" onClick={closeMobileMenu} className="login-button">
                    <i className="fas fa-user"></i> Profile
                  </Link>
                ) : (
                  <Link to="/login" onClick={closeMobileMenu} className="login-button">
                    <i className="fas fa-sign-in-alt"></i> Sign in
                  </Link>
                )}
              </li>
            </ul>

            <div className="social-icons-mobile">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="icon" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://wa.me/9472211324" target="_blank" rel="noopener noreferrer" className="icon" aria-label="WhatsApp">
                <i className="fab fa-whatsapp"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="icon" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="icon" aria-label="TikTok">
                <i className="fab fa-tiktok"></i>
              </a>
            </div>
          </div>

          {/* Right Action Items: Desktop Sign In/Profile, Cart & Hamburger */}
          <div className="nav-right-actions">
            {user ? (
              <Link to="/profile" className="login-button desktop-auth-btn">
                <i className="fas fa-user"></i> Profile
              </Link>
            ) : (
              <Link to="/login" className="login-button desktop-auth-btn">
                <i className="fas fa-sign-in-alt"></i> Sign in
              </Link>
            )}

            <Link to="/cart" className="cart-icon" aria-label="Shopping Cart">
              <i className="fas fa-shopping-cart"></i>
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </Link>

            <button
              className={`hamburger ${isMobileMenuOpen ? "active" : ""}`}
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Overlay Backdrop */}
      {isMobileMenuOpen && (
        <div className="mobile-overlay" onClick={closeMobileMenu} />
      )}
    </header>
  );
}

export default Navbar;
