import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './AnnouncementBar.css';
import API from "../api"

const AnnouncementBar = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
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
    };

    fetchAnnouncements();
  }, []);

  useEffect(() => {
    if (announcements.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === announcements.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000); // Rotate every 5 seconds
      return () => clearInterval(interval);
    }
  }, [announcements]);

  if (isLoading) return null;
  if (announcements.length === 0) return null;

  return (
    <div className="announcement-bar">
        <div className="announcement-container">
            <AnimatePresence mode="wait">
            {announcements.map((announcement, index) => (
                index === currentIndex && (
                <motion.div
                    key={announcement.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="announcement-slide"
                >
                    <p className="announcement-text">
                    {announcement.title} - {announcement.content}
                    </p>
                </motion.div>
                )
            ))}
            </AnimatePresence>

            {announcements.length > 1 && (
            <div className="announcement-dots">
                {announcements.map((_, index) => (
                <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`dot ${index === currentIndex ? 'active' : ''}`}
                    aria-label={`Go to announcement ${index + 1}`}
                />
                ))}
            </div>
            )}
        </div>
    </div>
  );
};

export default AnnouncementBar;