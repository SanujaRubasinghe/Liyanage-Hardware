import { useEffect } from 'react';
import API from '../api';

const useTrackPageVisit = () => {
  useEffect(() => {
    const trackPageVisit = async () => {
      const deviceType = window.innerWidth < 768 ? 'mobile' : 'desktop';
      try {
        // Get IP address
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        const ip_address = ipData.ip;

        await API.post('/analytics/page-visit', {
            page_url: window.location.pathname,
            user_id: localStorage.getItem('user_id') || 0,
            session_id: sessionStorage.getItem('session_id'),
            device_type: deviceType,
            ip_address,
            referrer: document.referrer
        });

        // Update active user
        await API.post('/api/analytics/active-user', {
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: localStorage.getItem('user_id'),
            session_id: sessionStorage.getItem('session_id'),
            device_type: deviceType
          })
        });
      } catch (error) {
        console.error('Error tracking page visit:', error);
      }
    };

    // Track initial page load
    trackPageVisit();

    // Set up history listener for SPA route changes
    const originalPushState = window.history.pushState;
    window.history.pushState = function() {
      originalPushState.apply(this, arguments);
      trackPageVisit();
    };

    const originalReplaceState = window.history.replaceState;
    window.history.replaceState = function() {
      originalReplaceState.apply(this, arguments);
      trackPageVisit();
    };

    window.addEventListener('popstate', trackPageVisit);

    return () => {
      window.removeEventListener('popstate', trackPageVisit);
    };
  }, []);
};

export default useTrackPageVisit