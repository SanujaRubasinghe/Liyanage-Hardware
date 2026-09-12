'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from '../router-compat';
import styles from './AllProductD.module.css';
import API from '../api';
import { getImageUrl } from '../utils/imageUrl';

const ProductPageN = () => {
  const [visibleCount, setVisibleCount] = useState(8);
  const [products, setProducts] = useState([]);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await API.get(`/products?categoryId=1`);
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

  // Adjust items per page based on screen size
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width <= 480) {
        // Mobile: show fewer items initially
        setVisibleCount(prev => Math.min(prev, 4));
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSeeMore = () => {
    if (window.innerWidth <= 480) {
      setVisibleCount(products.length);
    } else {
      navigate('/categories/building-materials', {
        state: {
          cat_id: 1,
          name: 'Building & Construction'
        }
      });
    }
  };

  const handleBuyNow = (product) => {
    navigate("/buying", {
      state: {
        product: {
          product_id: product.product_id,
          name: product.name,
          sku: product.sku,
          price: product.price,
          quantity: 1,
          image: product.primary_image,
          delivery_available: product.delivery_available,
          cod_only: product.only_cod,
          colombo_only: product.only_colombo
        }
      },
    });
  };

  const handleDetails = (productId) => {
    navigate(`/products/${productId}`);
  };

  const hasMore = visibleCount < products.length;
  const productsToShow = hasMore
    ? products.slice(0, visibleCount - 1)
    : products.slice(0, visibleCount);

  const categoryName = products[0]?.category_name || 'Building & Construction';
  const categoryImage = products[0]?.category_thumbnail 
    ? getImageUrl(products[0].category_thumbnail) 
    : '/images/b_c_image.jpg';

  return (
    <div className={styles.productLayout}>
      <div className={styles.productSidebar}>
        <h2>{categoryName}</h2>
        <img 
          src={categoryImage} 
          alt={categoryName} 
          loading="lazy"
          onError={(e) => { e.target.src = '/images/b_c_image.jpg'; }}
        />
      </div>

      <div className={styles.scrollWrapper}>
        <button
          className={`${styles.scrollArrow} ${styles.scrollArrowLeft}`}
          onClick={() => handleScroll('left')}
          aria-label="Scroll left"
        >
          <i className="fas fa-chevron-left"></i>
        </button>

        <div className={styles.products} ref={scrollRef}>
          {productsToShow.map((product, idx) => (
            <div className={styles.productCard} key={`${product.sku}-${idx}`}>
              <img 
                src={getImageUrl(product.primary_image)} 
                alt={`${product.name} - ${product.unit} package`}
                className={styles.productImage}
                loading="lazy"
                onClick={() => handleDetails(product.product_id)}
                onError={(e) => { e.target.src = '/images/Sample.jpg'; }}
              />
              <div className={styles.productDetails}>
                <h3 className={styles.productTitle}>{product.name}</h3>
                <p className={styles.productPart}>Part Number: {product.sku}</p>
                <p className={styles.productPrice}>
                  Rs. {product.price} <span>inc VAT</span>
                </p>
                <p className={styles.productUnit}>{product.unit}</p>
                <div className={styles.productActions}>
                  <button 
                    className={styles.buyToCart} 
                    onClick={() => handleBuyNow(product)}
                    aria-label={`Buy ${product.name} now`}
                  >
                    Buy now
                  </button>
                  <button 
                    className={styles.addToCart1} 
                    onClick={() => handleDetails(product.product_id)}
                    aria-label={`View details for ${product.name}`}
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}

          {hasMore && (
            <div
              className={styles.seeMoreCard}
              onClick={handleSeeMore}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSeeMore();
                }
              }}
              aria-label="See more products"
            >
              See More
            </div>
          )}
        </div>

        <button
          className={`${styles.scrollArrow} ${styles.scrollArrowRight}`}
          onClick={() => handleScroll('right')}
          aria-label="Scroll right"
        >
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  );
};

export default ProductPageN;