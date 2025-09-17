import { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import styles from './BackToTopButton.module.css';

const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Use both window.pageYOffset and document.documentElement.scrollTop for compatibility
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsVisible(scrollTop > 300);
    };

    // Add event listener with passive: true for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    // Try multiple scrolling methods
    try {
      // Method 1: Modern smooth scrolling
      if ('scrollBehavior' in document.documentElement.style) {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        return;
      }
      
      // Method 2: Legacy smooth scrolling
      const scrollStep = -window.scrollY / 15;
      const scrollInterval = setInterval(() => {
        if (window.scrollY > 0) {
          window.scrollBy(0, scrollStep);
        } else {
          clearInterval(scrollInterval);
        }
      }, 15);
    } catch (error) {
      // Method 3: Fallback instant scroll
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0; // For older Safari
    }
  };

  if (!isVisible) return null;

  return (
    <button
      className={styles.buttonContainer}
      onClick={scrollToTop}
      aria-label="Scroll to top"
    >
      <FaArrowUp className={styles.icon} />
    </button>
  );
};

export default BackToTopButton;