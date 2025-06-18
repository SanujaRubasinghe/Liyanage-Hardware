import API from '../api'

export const trackView = async (categoryId) => {
  try {
    await API.post(`/analytics/categories/${categoryId}/view`);
  } catch (error) {
    console.error('Error tracking view:', error);
  }
};

export const trackClick = async (categoryId) => {
  try {
    await API.post(`/analytics/categories/${categoryId}/click`);
  } catch (error) {
    console.error('Error tracking click:', error);
  }
};

export const trackConversion = async (categoryId) => {
  try {
    await API.post(`/analytics/categories/${categoryId}/conversion`);
  } catch (error) {
    console.error('Error tracking conversion:', error);
  }
};