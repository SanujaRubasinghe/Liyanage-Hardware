// Slideshow.jsx
import React, { useState, useEffect } from 'react';
import styles from './Slideshow.module.css';

const slides = [
  { src: '/images/slide2.png' },
  { src: '/images/slider1.png' },
  { src: '/images/img4.jpg' },
];

export default function Slideshow() {
  const [slideIndex, setSlideIndex] = useState(0);

  const changeSlide = (n) => {
    setSlideIndex((prev) => {
      let idx = prev + n;
      if (idx < 0) idx = slides.length - 1;
      if (idx >= slides.length) idx = 0;
      return idx;
    });
  };

  useEffect(() => {
    const timer = setInterval(() => changeSlide(1), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`${styles.slide} ${i === slideIndex ? styles.active : ''}`}
          >
            <img src={slide.src} alt={`Slide ${i + 1}`} />
          </div>
        ))}

        <button
          className={styles.prevButton}
          aria-label="Previous slide"
          onClick={() => changeSlide(-1)}
        >
          ‹
        </button>
        <button
          className={styles.nextButton}
          aria-label="Next slide"
          onClick={() => changeSlide(1)}
        >
          ›
        </button>
      </div>

      <div className={styles.dots}>
        {slides.map((_, i) => (
          <span
            key={i}
            className={`${styles.dot} ${i === slideIndex ? styles.dotActive : ''}`}
            onClick={() => setSlideIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}
