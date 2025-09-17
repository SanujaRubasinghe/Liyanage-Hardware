import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './AnnouncementBar.css';
import API from "../api";
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const AnnouncementBar = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  const fetchAnnouncements = useCallback(async () => {
    try {
      const response = await API.get('/content/announcements/active');
      const activeAnnouncements = response.data.filter(announcement => {
        const now = new Date();
        const startDate = announcement.start_date ? new Date(announcement.start_date) : null;
        const endDate = announcement.end_date ? new Date(announcement.end_date) : null;
        
        return announcement.is_active && 
              (!startDate || now >= startDate) && 
              (!endDate || now <= endDate);
      });
      
      setAnnouncements(activeAnnouncements);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => 
      prev === announcements.length - 1 ? 0 : prev + 1
    );
  }, [announcements.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex(prev => 
      prev === 0 ? announcements.length - 1 : prev - 1
    );
  }, [announcements.length]);

  useEffect(() => {
    if (announcements.length > 1) {
      const interval = setInterval(goToNext, 5000);
      return () => clearInterval(interval);
    }
  }, [announcements.length, goToNext]);

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  const handleClose = () => {
    setIsVisible(false);
    // Optional: Store dismissal in localStorage
    localStorage.setItem('announcementDismissed', 'true');
  };

  if (!isVisible || isLoading || announcements.length === 0) return null;

  return (
    <div className={`announcement-bar ${announcements[currentIndex]?.is_urgent ? 'announcement-highlight' : ''}`}>
      <div className="announcement-container">
        {announcements.length > 1 && (
          <button 
            className="announcement-nav announcement-nav-prev"
            onClick={goToPrev}
            aria-label="Previous announcement"
          >
            <FiChevronLeft size={18} />
          </button>
        )}

        <AnimatePresence mode="wait">
          {announcements.map((announcement, index) => (
            index === currentIndex && (
              <motion.div
                key={announcement.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="announcement-slide"
              >
                <div className="announcement-content">
                  {announcement.link ? (
                    <a 
                      href={announcement.link} 
                      className="announcement-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <p className="announcement-text">
                        {announcement.title && <strong>{announcement.title} - </strong>}
                        {announcement.content}
                      </p>
                    </a>
                  ) : (
                    <p className="announcement-text">
                      {announcement.title && <strong>{announcement.title} - </strong>}
                      {announcement.content}
                    </p>
                  )}
                </div>
              </motion.div>
            )
          ))}
        </AnimatePresence>

        {announcements.length > 1 && (
          <button 
            className="announcement-nav announcement-nav-next"
            onClick={goToNext}
            aria-label="Next announcement"
          >
            <FiChevronRight size={18} />
          </button>
        )}

        {announcements.length > 1 && (
          <div className="announcement-dots">
            {announcements.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`dot ${index === currentIndex ? 'active' : ''}`}
                aria-label={`Go to announcement ${index + 1}`}
              />
            ))}
          </div>
        )}

        <button 
          className="announcement-close"
          onClick={handleClose}
          aria-label="Close announcement"
        >
          <FiX size={18} />
        </button>
      </div>
    </div>
  );
};

export default AnnouncementBar;