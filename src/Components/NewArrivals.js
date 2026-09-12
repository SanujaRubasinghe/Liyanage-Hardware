import React, { useState, useEffect, useRef } from "react";
import ProductCard from "./ProductCard";
import "./NewArrivals.css"; 
import PromotionalBanner from "./PromotionalBanner";
import API from "../api";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [rowConfig, setRowConfig] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchRowAndProducts = async () => {
      try {
        const rowsRes = await API.get('/content/homepage-rows');
        const rConfig = rowsRes.data?.find(r => r.location === 'home-row-1' || r.location === 'home-page-new-arrivals') || rowsRes.data?.[0];
        setRowConfig(rConfig);

        const categoryId = rConfig?.category_id || 'new_arrivals';
        let prodRes;
        if (categoryId === 'new_arrivals') {
          prodRes = await API.get('/products/new-arrivals');
        } else {
          prodRes = await API.get(`/products?categoryId=${categoryId}`);
        }
        setProducts(prodRes.data || []);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRowAndProducts();
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
      <h2 className="product-list-title">
        <span className="product-list-title-red">{rowConfig?.name || 'New Arrivals'}</span>
      </h2>

      <div className="product-list-container">
        <div className="product-list-sidebar">
          <PromotionalBanner location={rowConfig?.location || 'home-page-new-arrivals'} />
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