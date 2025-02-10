// Testh.js
import React, { useState, useRef, useEffect, useCallback } from 'react';
import './Testh.css';

function Home() {
  // Carousel images (ensure these images exist or adjust the URLs)
  const images = [
    '/images/img1.jpg',
    '/images/messi2.jpg', 
    '/images/messi.webp',
  ];

  // Dummy products array for the product grid
  const products = [
    { id: 1, name: "Product 1", price: "$10", image: "/images/product1.jpg" },
    { id: 2, name: "Product 2", price: "$20", image: "/images/product2.jpg" },
    { id: 3, name: "Product 3", price: "$30", image: "/images/product3.jpg" },
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const intervalRef = useRef(null);

  // startSlideshow is memoized so it can be safely included in useEffect's dependency array
  const startSlideshow = useCallback(() => {
    intervalRef.current = setInterval(() => {
      setCurrentImageIndex(prevIndex =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // change slide every 5 seconds
  }, [images.length]);

  useEffect(() => {
    startSlideshow();
    return () => clearInterval(intervalRef.current);
  }, [startSlideshow]);

  // Function to move to the next slide
  const nextSlide = () => {
    setCurrentImageIndex(prevIndex =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Function to move to the previous slide
  const prevSlide = () => {
    setCurrentImageIndex(prevIndex =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div>
      {/* Carousel Section */}
      <div className="carousel-container">
        <div
          className="carousel"
          style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
        >
          {images.map((src, index) => (
            <div className="carousel-image" key={index}>
              <img src={src} alt={`Slide ${index + 1}`} />
            </div>
          ))}
        </div>
        <button className="carousel-button prev" onClick={prevSlide}>
          &lt;
        </button>
        <button className="carousel-button next" onClick={nextSlide}>
          &gt;
        </button>
      </div>

      {/* Product Grid Section */}
      <div className="product-grid">
        {products.map(product => (
          <div key={product.id}>
            <img
              src={product.image}
              alt={product.name}
              style={{ width: '100%', borderRadius: '10px' }}
            />
            <h2>{product.name}</h2>
            <p>{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
