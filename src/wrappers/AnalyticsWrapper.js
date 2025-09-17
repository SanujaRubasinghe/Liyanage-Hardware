import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import CookieConsent from '../Components/CookieConsent';

const AnalyticsWrapper = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [sessionId, setSessionId] = useState(null);

  // Initialize analytics
  useEffect(() => {
    const checkConsent = () => {
      const consentCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('cookie_consent='));
      
      if (consentCookie && consentCookie.split('=')[1] === 'true') {
        // User accepted cookies - use cookies
        initCookies();
      } else if (consentCookie && consentCookie.split('=')[1] === 'false') {
        // User rejected cookies - use localStorage fallback
        initLocalStorage();
      } else {
        // No consent given yet
        setUserId(null);
        setSessionId(null);
      }
    };

    checkConsent();
  }, []);

  const initCookies = () => {
    // Check for existing user ID cookie or create new one
    let id = getCookie('user_id');
    if (!id) {
      id = uuidv4();
      setCookie('user_id', id, 365);
    }
    
    // Create session ID
    const session = uuidv4();
    setCookie('session_id', session, 1);
    
    setUserId(id);
    setSessionId(session);
  };

  const initLocalStorage = () => {
    // Fallback using localStorage
    let id = localStorage.getItem('analytics_user_id');
    if (!id) {
      id = uuidv4();
      localStorage.setItem('analytics_user_id', id);
    }
    
    // Session ID in sessionStorage
    const session = uuidv4();
    sessionStorage.setItem('analytics_session_id', session);
    
    setUserId(id);
    setSessionId(session);
  };

  const handleAccept = () => {
    setCookie('cookie_consent', 'true', 365);
    initCookies();
  };

  const handleReject = () => {
    setCookie('cookie_consent', 'false', 30); // Remember rejection for 30 days
    initLocalStorage();
  };

  // Helper functions
  const setCookie = (name, value, days) => {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`;
  };

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  return (
    <>
      {children}
      <CookieConsent onAccept={handleAccept} onReject={handleReject} />
    </>
  );
};

export default AnalyticsWrapper;