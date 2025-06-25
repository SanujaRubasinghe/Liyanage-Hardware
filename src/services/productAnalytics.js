import API from "../api";

// services/tracking.js
export const trackProductView = async (productId) => {
  try {
    await API.post('/analytics/user/product-view', {product_id: productId})
  } catch (error) {
    console.error('Tracking failed:', error);
  }
};
