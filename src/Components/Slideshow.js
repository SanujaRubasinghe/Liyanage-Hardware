import React, { useState } from 'react';
import './Slideshow.css';

const slides = [
  { src: '/images/img1.jpg', caption: 'Caption Text' },
  { src: '/images/img1.jpg', caption: 'Caption Two' },
  { src: '/images/img1.jpg', caption: 'Caption Three' },
];

function Slideshow() {
  const [slideIndex, setSlideIndex] = useState(0);

  const changeSlide = (n) => {
    let newIndex = slideIndex + n;
    if (newIndex >= slides.length) {
      newIndex = 0;
    } else if (newIndex < 0) {
      newIndex = slides.length - 1;
    }
    setSlideIndex(newIndex);
  };

  const goToSlide = (index) => {
    setSlideIndex(index);
  };

  return (
    <div>
      <div className="slideshow-container">
        {slides.map((slide, index) => (
          <div
            className="mySlides fade"
            key={index}
            style={{ display: index === slideIndex ? 'block' : 'none' }}
          >
            <div className="numbertext">
              {index + 1} / {slides.length}
            </div>
            <img src={slide.src} alt={`Slide ${index + 1}`} style={{ width: '100%' }} />
            
          </div>
        ))}
        {/* Replace anchor tags with buttons for accessibility */}
        <button className="prev" onClick={() => changeSlide(-1)}>
          ❮
        </button>
        <button className="next" onClick={() => changeSlide(1)}>
          ❯
        </button>
      </div>
      <br />
      <div style={{ textAlign: 'center' }}>
        {slides.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === slideIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          ></span>
        ))}
      </div>
    </div>
  );
}

export default Slideshow;
