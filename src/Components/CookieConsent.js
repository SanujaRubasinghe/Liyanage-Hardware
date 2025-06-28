import React, { useState, useEffect } from 'react';
import './CookieConsent.css';

const CookieConsent = ({ onAccept, onReject }) => {
  const [visible, setVisible] = useState(false);
  const [bounce, setBounce] = useState(false);

  useEffect(() => {
    // Check if consent was already given
    const consentGiven = document.cookie.includes('cookie_consent=');
    if (!consentGiven) {
      setTimeout(() => {
        setVisible(true);
        setBounce(true);
      }, 1000);
    }
  }, []);

  const handleAccept = () => {
    setVisible(false);
    onAccept();
  };

  const handleReject = () => {
    setVisible(false);
    onReject();
  };

  if (!visible) return null;

  return (
    <div className={`cookie-consent ${bounce ? 'bounce' : ''}`}>
      <div className="cookie-content">
        <h3>We Value Your Privacy</h3>
        <p>
          We use cookies to enhance your browsing experience and analyze site traffic. 
          By clicking "Accept All", you consent to our use of cookies.
        </p>
        <div className="cookie-buttons">
          <button className="accept-btn" onClick={handleAccept}>
            Accept All
          </button>
          <button className="reject-btn" onClick={handleReject}>
            Reject
          </button>
        </div>
        <a href="/privacy-policy" className="privacy-link">
          Privacy Policy
        </a>
      </div>
    </div>
  );
};

export default CookieConsent;