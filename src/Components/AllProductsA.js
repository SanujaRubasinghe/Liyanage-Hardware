'use client';
import React, { useState, useEffect } from 'react';
import { useNavigate } from '../router-compat';
import styles from './AllProductD.module.css'; // your updated CSS module
import API from '../api';
import { getImageUrl } from '../utils/imageUrl';

const itemsPerPage = 8;

const AllProductsA = () => {
  const [visibleCount, setVisibleCount] = useState(itemsPerPage);
  const [products, setProducts] = useState([])
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      let response;
      try {
        response = await API.get(`/products?categoryId=35`);
        setProducts(response.data);
      } catch (error) {
        console.log(error)
      }
    }
    fetchProducts()
  }, [])

  const hasMore = visibleCount < products.length;
  const productsToShow = hasMore
    ? products.slice(0, visibleCount - 1)
    : products.slice(0, visibleCount);

  const handleSeeMore = () => {
    // Check if on mobile for different navigation behavior
    if (window.innerWidth <= 480) {
      // On mobile, you might want to show a loading state or different behavior
      setVisibleCount(products.length);
    } else {
      navigate('/category/construction-materials/products', {
        state: {
          cat_id: 35,
          name: 'Cutting Tools'
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

  return (
    <div className={styles.productLayout}>
      <div className={styles.productSidebar}>
        <h2>Cutting Tools</h2>
        <img src="/images/cutting_tool_banner.jpg" alt="Worker" />
      </div>

      <div className={styles.products}>
        {productsToShow.map((product, idx) => (
          <div className={styles.productCard} key={idx}>
            <img 
              src={getImageUrl(product.primary_image)}  
              alt={product.name} 
              className={styles.productImage} 
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
                <button className={styles.buyToCart} onClick={() => handleBuyNow(product)}>
                  Buy now
                </button>
                <button className={styles.addToCart1} onClick={() => handleDetails(product.product_id)}>
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
    </div>
  );
};

export default AllProductsA;
