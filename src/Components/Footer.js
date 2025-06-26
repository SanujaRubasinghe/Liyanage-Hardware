// Footer.js
import React, { useState } from "react";
import "./Footer.css";

const FooterSection = ({ title, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="footer-accordion">
      <button
        className="footer-accordion-header"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        {title}
        <span className={`arrow ${open ? "open" : ""}`}>▶</span>
      </button>

      <div
        className="footer-accordion-body"
        style={{ display: open ? "block" : "none" }}
      >
        {children}
      </div>
    </div>
  );
};

const Footer = () => (
  <footer className="footer">
    <div className="footer-container">
      <FooterSection title="Trade Counter">
        <p>
          New Liyanage Hardware Ltd<br />
          Galwana junction, Angoda<br />
          Mon – Fri, 8 am – 5 pm
        </p>
        <strong>Sales Enquiries</strong>
        <p>
          Email: newliyanage@gmail.com<br />
          Tel: 0721 199 690<br />
          Fax: 0776 499 596
        </p>
      </FooterSection>

      <FooterSection title="Our Range of Products">
        <ul>
          {[
            "Hinges",
            "Locks & Latches",
            "Door Hardware",
            "General Hardware",
            "Window Hardware",
            "Sliding & Folding Door Hardware",
            "Cabinet Hardware",
            "Thresholds & Joinery Seals",
            "Fixings & Consumables",
            "Exitex Roofing System",
          ].map(item => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </FooterSection>

      <FooterSection title="Information">
        <ul>
          {[
            "Contact Us",
            "Delivery",
            "Returns",
            "Disclaimer",
            "Terms & Conditions",
            "Privacy Policy",
            "Sitemap",
          ].map(item => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </FooterSection>

      <FooterSection title="My Account">
        <ul>
          {["Orders", "Addresses", "Account Details"].map(item => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </FooterSection>
    </div>

    <div className="footer-bottom">
      <p>© 2025 New Liyanage Hardware Limited – Reg No: 01684709</p>
      <div className="social-icons">
        {["facebook", "instagram", "twitter", "google"].map(net => (
          <i key={net} className={`fab fa-${net}`} />
        ))}
      </div>
    </div>
  </footer>
);

export default Footer;
