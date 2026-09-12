import React, { useState, useEffect, useRef } from "react";
import ProductCard from "./ProductCard";
import "./NewArrivals.css"; 
import PromotionalBanner from "./PromotionalBanner";
import API from "../api";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await API.get('/products/new-arrivals');
        setProducts(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProducts();
  }, []);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="product-list-wrapper">
      <div className="product-list-container">
        <div className="product-list-sidebar">
          <h2>New Arrivals</h2>
          <PromotionalBanner location={'home-page-new-arrivals'} />
        </div>

        <div className="product-scroll-wrapper">
          <button
            className="scroll-arrow scroll-arrow-left"
            onClick={() => handleScroll('left')}
            aria-label="Scroll left"
          >
            <i className="fas fa-chevron-left"></i>
          </button>

          <div className="product-list-grid" ref={scrollRef}>
            {products.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>

          <button
            className="scroll-arrow scroll-arrow-right"
            onClick={() => handleScroll('right')}
            aria-label="Scroll right"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductList;