import { useEffect } from 'react';
import {checkConsent} from '../services/checkConsent'
import API from '../api';

export const useActivityTracker = () => {
  useEffect(() => {
    let interval;

    const startTracking = () => {
      if (!checkConsent() || interval) return;
      recordActivity();
      interval = setInterval(recordActivity, 30000);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && checkConsent()) {
        recordActivity();
      }
    };

    startTracking();
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('cookie-consent-changed', startTracking);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('cookie-consent-changed', startTracking);
    };
  }, []);
};

const recordActivity = async () => {
  try {
    await API.post('/analytics/user/active-user', {
      device_type: getDeviceType()
    });
  } catch (error) {
    console.error('Activity tracking failed:', error);
  }
};

const getDeviceType = () => {
  const userAgent = navigator.userAgent;
  if (/Mobi|Android|iPhone|iPad|iPod/i.test(userAgent)) {
    return window.innerWidth < 768 ? 'mobile' : 'tablet';
  }
  return 'desktop';
};
