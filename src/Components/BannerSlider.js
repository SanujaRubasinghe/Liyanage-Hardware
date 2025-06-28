import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './BannerSlider.css'
import API from '../api';

const imageCache = {}

const BannerSlider = () => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward
  const [isLoading, setIsLoading] = useState(true);

  const preloadImages = (urls) => {
    urls.forEach(url => {
      if (!imageCache[url]) {
        imageCache[url] = new Image();
        imageCache[url].src = url;
      }
    });
  };

  useEffect(() => {
    const fetchActiveBanners = async () => {
      try {
        const response = await API.get('/content/banners/active');
        const bannersWithImages = await Promise.all(
          response.data.map(async banner => {
            const imagesResponse = await API.get(`/content/banners/${banner.id}/active-images`);
            return {
              ...banner,
              images: imagesResponse.data
            };
          })
        );
        
        const validBanners = bannersWithImages.filter(banner => banner.images.length > 0);
        setBanners(validBanners);

        const allImageUrls = validBanners.flatMap(banner => 
          banner.images.map(img => `${process.env.REACT_APP_API_BASE_URL}${img.image_url}`)
        );
        preloadImages(allImageUrls);
      } catch (error) {
        console.error('Error fetching banners:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActiveBanners();
  }, []);

  useEffect(() => {
    if (banners.length > 0) {
      const currentBanner = banners[currentIndex];
      if (currentBanner && currentBanner.images.length > 1) {
        const interval = setInterval(() => {
          setDirection(1);
          setCurrentIndex((prevIndex) => 
            prevIndex === banners.length - 1 ? 0 : prevIndex + 1
          );
        }, 8000); // Rotate banners every 8 seconds
        return () => clearInterval(interval);
      }
    }
  }, [banners, currentIndex]);

  const goToSlide = (index, newDirection) => {
    setDirection(newDirection);
    setCurrentIndex(index);
  };

  const goToPrevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? banners.length - 1 : currentIndex - 1;
    setDirection(-1);
    setCurrentIndex(newIndex);
  };

  const goToNextSlide = () => {
    const isLastSlide = currentIndex === banners.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setDirection(1);
    setCurrentIndex(newIndex);
  };

  if (isLoading) return <div className="h-64 bg-gray-100 animate-pulse"></div>;
  if (banners.length === 0) return null;

  const currentBanner = banners[currentIndex];

  return (
    <div className="banner-slider-wrapper">
  <AnimatePresence custom={direction} mode="wait">
    <motion.div
      key={currentIndex}
      custom={direction}
      initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
      transition={{ duration: 0.5 }}
      className="banner-slide"
    >
      {/* Banner Image */}
      <BannerImageSlider images={currentBanner.images} />
    </motion.div>
  </AnimatePresence>

  {/* Navigation Arrows */}
  {banners.length > 1 && (
    <>
      <button onClick={goToPrevSlide} className="banner-arrow banner-arrow-left" aria-label="Previous banner">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button onClick={goToNextSlide} className="banner-arrow banner-arrow-right" aria-label="Next banner">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </>
  )}

  {/* Dots */}
  {banners.length > 1 && (
    <div className="banner-dots">
      {banners.map((banner, index) => (
        <button
          key={banner.id}
          onClick={() => goToSlide(index, index > currentIndex ? 1 : -1)}
          className={`banner-dot ${index === currentIndex ? 'active' : ''}`}
          aria-label={`Go to banner ${index + 1}`}
        />
      ))}
    </div>
  )}
</div>

  );
};

const BannerImageSlider = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [loadedImages, setLoadedImages] = useState({})

  const imageUrls = useMemo(() => 
    images.map(img => `${process.env.REACT_APP_API_BASE_URL}${img.image_url}`),
    [images]
  );

  useEffect(() => {
    if (images.length > 1) {
      const nextIndex = (currentImageIndex + 1) % images.length;
      if (!loadedImages[imageUrls[nextIndex]]) {
        const img = new Image();
        img.src = imageUrls[nextIndex];
        img.onload = () => {
          setLoadedImages(prev => ({ ...prev, [imageUrls[nextIndex]]: true }));
        };
      }

      const interval = setInterval(() => {
        setDirection(1);
        setCurrentImageIndex(prev => (prev + 1) % images.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [images.length, currentImageIndex, imageUrls, loadedImages]);

  if (images.length === 0) return null;

  const currentImage = images[currentImageIndex];
  const fullImageUrl = imageUrls[currentImageIndex];

  return (
    <div className="image-slider-container">
        <AnimatePresence custom={direction} mode="wait">
            <motion.div
            key={currentImageIndex}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -50 : 50 }}
            transition={{ duration: 0.5 }}
            className="image-slide"
            >
             {loadedImages[fullImageUrl] ? (
              <img
                src={fullImageUrl}
                alt={currentImage.alt_text || 'Promotional banner'}
                className="banner-loaded-image"
              />
            ) : (
              <div className="banner-image-placeholder">
                {/* Optional: Add a loading spinner or skeleton here */}
              </div>
            )}
            </motion.div>
        </AnimatePresence>

        {images.length > 1 && (
            <div className="slider-dots">
            {images.map((_, index) => (
                <button
                key={index}
                onClick={() => {
                    setDirection(index > currentImageIndex ? 1 : -1);
                    setCurrentImageIndex(index);
                }}
                className={`slider-dot ${index === currentImageIndex ? 'active' : ''}`}
                aria-label={`Go to image ${index + 1}`}
                />
            ))}
            </div>
        )}
    </div>
  );
};

export default BannerSlider;