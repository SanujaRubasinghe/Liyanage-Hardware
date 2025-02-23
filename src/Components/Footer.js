import React from "react";
import "./Footer.css"; 

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Trade Counter Section */}
        <div className="footer-section">
          <h3 className="footer-title">Trade Counter</h3>
          <p>New Liyanage Hardware Ltd</p>
          <p>Galwana junction,Angoda</p>
          <p>Monday – Friday, 8am – 5pm</p>
          <strong>Sales Enquiries</strong>
          <p>Email: newliyanage@gmail.com</p>
          <p>Tel: 0721 199 690</p>
          <p>Fax: 0776 499 596</p>
        </div>

        {/* Our Range of Products */}
        <div className="footer-section">
          <h3 className="footer-title">Our Range of Products</h3>
          <ul>
            <li>Hinges</li>
            <li>Locks & Latches</li>
            <li>Door Hardware</li>
            <li>General Hardware</li>
            <li>Window Hardware</li>
            <li>Sliding & Folding Door Hardware</li>
            <li>Cabinet Hardware</li>
            <li>Thresholds & Joinery Seals</li>
            <li>Fixings & Consumables</li>
            <li>Exitex Roofing System</li>
          </ul>
        </div>

        {/* Information */}
        <div className="footer-section">
          <h3 className="footer-title">Information</h3>
          <ul>
            <li>Contact us</li>
            <li>Delivery</li>
            <li>Returns</li>
            <li>Disclaimer</li>
            <li>Terms & Conditions</li>
            <li>Privacy Policy</li>
            <li>Sitemap</li>
          </ul>
        </div>

        {/* My Account */}
        <div className="footer-section">
          <h3 className="footer-title">My Account</h3>
          <ul>
            <li>Orders</li>
            <li>Addresses</li>
            <li>Account Details</li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <p>© 2025 New Liyanage Hardware Limited</p>
        <p>Company Reg No: 01684709</p>
        <div className="social-icons">
          <i className="fab fa-facebook"></i>
          <i className="fab fa-instagram"></i>
          <i className="fab fa-twitter"></i>
          <i className="fab fa-google"></i>
          </div>
      </div>
    </footer>
  );
};

export default Footer;
