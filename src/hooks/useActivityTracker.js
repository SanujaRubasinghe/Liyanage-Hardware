import { useEffect } from 'react';
import API from '../api';

export const useActivityTracker = () => {
  useEffect(() => {
    // Initial page view recording
    recordActivity();
    
    // Set up heartbeat (every 30 seconds)
    const interval = setInterval(recordActivity, 30000);
    
    // Record activity on visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        recordActivity();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
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