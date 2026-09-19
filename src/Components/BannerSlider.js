'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './BannerSlider.css';
import API from '../api';
import { getImageUrl } from '../utils/imageUrl';

const imageCache = {};

const DEFAULT_FALLBACK_BANNERS = [
  {
    id: 'default-hero-banner',
    name: 'Main Hero Banner',
    images: [
      { image_url: '/images/slider1.png' },
      { image_url: '/images/slide2.png' },
      { image_url: '/images/slide3.jpeg' },
      { image_url: '/images/slider4.jpeg' }
    ]
  }
];

const BannerSlider = ({onLoad}) => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1: forward, -1: backward
  const [isLoading, setIsLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(0)

  useEffect(() => {
    if (banners.length > 0 && imagesLoaded >= banners.length) {
      setIsLoading(false)
      onLoad()
    }
  }, [banners.length, imagesLoaded, onLoad])

  useEffect(() => {
    const preloadImages = (urls) => {
      urls.forEach(url => {
        if (!imageCache[url]) {
          const img = new Image();
          img.src = url;
          img.onload = () => setImagesLoaded(prev => prev + 1);
          imageCache[url] = img;
        }
      });
    };

    const fetchBanners = async () => {
      try {
        const response = await API.get('/content/banners/active');
        const validBanners = response.data.filter(b => b.images && b.images.length > 0);
        if (validBanners.length > 0) {
          setBanners(validBanners);
          const allImageUrls = validBanners.flatMap(banner =>
            banner.images.map(img => getImageUrl(img.image_url))
          );
          preloadImages(allImageUrls);
        } else {
          setBanners(DEFAULT_FALLBACK_BANNERS);
          const fallbackUrls = DEFAULT_FALLBACK_BANNERS[0].images.map(img => getImageUrl(img.image_url));
          preloadImages(fallbackUrls);
        }
      } catch (err) {
        console.error('Error loading banners:', err);
        setBanners(DEFAULT_FALLBACK_BANNERS);
        const fallbackUrls = DEFAULT_FALLBACK_BANNERS[0].images.map(img => getImageUrl(img.image_url));
        preloadImages(fallbackUrls);
      } finally {
        setIsLoading(false);
        onLoad();
      }
    };

    fetchBanners();
    return () => {
      setIsLoading(false)
      onLoad()
    }
  }, [onLoad]);

  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setDirection(1);
        setCurrentIndex((prevIndex) =>
          prevIndex === banners.length - 1 ? 0 : prevIndex + 1
        );
      }, 8000); // rotate every 8s

      return () => clearInterval(interval);
    }
  }, [banners, currentIndex]);

  const goToSlide = (index) => {
    if (index === currentIndex) return;
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const goToPrevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const goToNextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
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
          <BannerImageSlider images={currentBanner.images} />
        </motion.div>
      </AnimatePresence>

      {/* Navigation arrows */}
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
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
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
  const [loadedImages, setLoadedImages] = useState({});

  const imageUrls = useMemo(() =>
    images.map(img => getImageUrl(img.image_url)),
    [images]
  );

  useEffect(() => {
    const preload = (url) => {
      if (!loadedImages[url]) {
        const img = new Image();
        img.src = url;
        img.onload = () => setLoadedImages(prev => ({ ...prev, [url]: true }));

      }
    };

    preload(imageUrls[currentImageIndex]);

    if (images.length > 1) {
      const interval = setInterval(() => {
        setDirection(1);
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [currentImageIndex, imageUrls, images.length, loadedImages]);

  if (images.length === 0) return null;

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
              alt="Banner"
              className="banner-loaded-image"
            />
          ) : (
            <div className="banner-image-placeholder" />
          )}
        </motion.div>
      </AnimatePresence>

      {images.length > 1 && (
        <div className="slider-dots">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > currentImageIndex ? 1 : -1);
                setCurrentImageIndex(i);
              }}
              className={`slider-dot ${i === currentImageIndex ? 'active' : ''}`}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BannerSlider;
