import { useEffect } from 'react';
import { checkConsent } from '../services/checkConsent';
import API from '../api';

export const useTrackVisit = () => {
  useEffect(() => {
    const hasConsent = checkConsent()
    if (!hasConsent) return

    const trackVisit = async () => {
      try {
        const deviceType = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
          ? window.innerWidth < 768 ? 'mobile' : 'tablet'
          : 'desktop';

        await API.post('/analytics/user/page-visit', {
          page_url: window.location.pathname,
          device_type: deviceType
        });
      } catch (error) {
        console.error('Error tracking visit:', error);
      }
    };

    trackVisit();
  }, []);
};