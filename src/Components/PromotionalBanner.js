import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import API from '../api';
import './PromotionalBanner.css'

const PromotionalBanner = ({ location }) => {
  const [banner, setBanner] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        setIsLoading(true);
        const response = await API.get(`/content/promotional-banners/location/${location}`);
        setBanner(response.data);
        setError(null);
      } catch (err) {
        setError('Banner not available');
        console.error('Error fetching promotional banner:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBanner();
  }, [location]);

  if (isLoading) {
    return (
      <div className="skeleton-loader"></div>
    );
  }

  if (error || !banner || !banner.current_image) {
    return null; // Or return a placeholder if you prefer
  }

  return (
    <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="banner-card"
        >
          <img
          src={`${process.env.REACT_APP_API_BASE_URL}${banner.current_image.image_url}`}
          alt={banner.current_image.alt_text || banner.name}
          className="banner-image"
          />
          {banner.description && (
          <div className="banner-description-overlay">
              <p className="banner-description-text">{banner.description}</p>
          </div>
          )}
    </motion.div>
  );
};

export default PromotionalBanner;