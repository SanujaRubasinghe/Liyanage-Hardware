import React, { useState, useEffect } from 'react';
import './Home.css'; // Import the CSS file

function Home() {
  const images = [
    '/images/img1.jpg', // Image paths from the public folder
    '/images/img2.jpg',
    '/images/img3.jpg',
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Automatically change image every 1.7 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 1700); // Change image every 1.7 seconds

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, [images.length]);

  // Function to handle next image
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Function to handle previous image
  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="carousel-container">
      <div className="carousel" style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}>
        {images.map((image, index) => (
          <div key={index} className="carousel-image">
            <img src={image} alt={`Slide ${index}`} />
          </div>
        ))}
      </div>
      {/* Prev and Next buttons */}
      <button className="carousel-button prev" onClick={prevImage}>&#8592;</button>
      <button className="carousel-button next" onClick={nextImage}>&#8594;</button>
    </div>
  );
}

export default Home;
