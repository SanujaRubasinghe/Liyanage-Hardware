'use client';
import React, { useState } from "react";
import { Link } from "../router-compat";
import "./Footer.css";

const FooterAccordion = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="footer-col footer-accordion">
      <button
        className="footer-accordion-btn"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        <i className={`fas fa-chevron-down accordion-arrow ${isOpen ? "rotated" : ""}`}></i>
      </button>
      <div className={`footer-col-content ${isOpen ? "open" : ""}`}>
        {children}
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-top-bar">
        <div className="footer-container">
          <div className="footer-grid">
            {/* Column 1: Brand Info */}
            <div className="footer-col brand-col">
              <div className="footer-logo">
                <Link to="/">
                  <img src="/images/l1.png" alt="New Liyanage Hardware Logo" />
                </Link>
              </div>
              <p className="brand-desc">
                Your trusted partner for quality construction, building materials, tools, and home improvement hardware in Sri Lanka.
              </p>
              <ul className="contact-info-list">
                <li>
                  <i className="fas fa-map-marker-alt icon"></i>
                  <span>Galwana Junction, Angoda, Sri Lanka</span>
                </li>
                <li>
                  <i className="fas fa-phone-alt icon"></i>
                  <div className="phone-links">
                    <a href="tel:072211324">072211324</a>
                    <span>/</span>
                    <a href="tel:0754232212">0754232212</a>
                  </div>
                </li>
                <li>
                  <i className="fas fa-envelope icon"></i>
                  <a href="mailto:newliyanage@gmail.com">newliyanage@gmail.com</a>
                </li>
              </ul>
            </div>

            {/* Column 2: Quick Links */}
            <FooterAccordion title="Quick Links">
              <ul className="footer-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/products">Products</Link></li>
                <li><Link to="/categories">Categories</Link></li>
                <li><Link to="/about-us">About Us</Link></li>
                <li><Link to="/contact-us">Contact Us</Link></li>
                <li><Link to="/feedback">Customer Feedback</Link></li>
                <li><Link to="/complaint">Complaints</Link></li>
              </ul>
            </FooterAccordion>

            {/* Column 3: Policy & Customer Care */}
            <FooterAccordion title="Customer Care & Policy">
              <ul className="footer-links">
                <li><Link to="/shipping-policy">Shipping Policy</Link></li>
                <li><Link to="/return-policy">Return Policy</Link></li>
                <li><Link to="/terms">Terms & Conditions</Link></li>
                <li><Link to="/disclaimer">Disclaimer</Link></li>
                <li><Link to="/policy">Privacy Policy</Link></li>
              </ul>
            </FooterAccordion>

            {/* Column 4: Opening Hours & Socials */}
            <FooterAccordion title="Opening Hours & Connect">
              <div className="business-hours">
                <p className="hours-title"><i className="far fa-clock"></i> Trade Counter Hours:</p>
                <p>Mon – Sat: 8:00 AM – 6:00 PM</p>
                <p>Sunday: 8:00 AM – 1:00 PM</p>
              </div>

              <div className="footer-socials">
                <p className="socials-title">Follow Us:</p>
                <div className="social-icons-footer">
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="https://wa.me/9472211324" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                    <i className="fab fa-whatsapp"></i>
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                    <i className="fab fa-tiktok"></i>
                  </a>
                </div>
              </div>
            </FooterAccordion>
          </div>
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="footer-bottom-bar">
        <div className="footer-container bottom-container">
          <p className="copyright-text">
            © {new Date().getFullYear()} New Liyanage Hardware. All Rights Reserved.
          </p>
          <div className="payment-badges">
            <span className="badge">Cash on Delivery</span>
            <span className="badge">VISA</span>
            <span className="badge">MasterCard</span>
            <span className="badge">Koko Pay</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
