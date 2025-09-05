import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AllProductD.module.css';
import API from '../api';


const ProductPageN = () => {
  const [visibleCount, setVisibleCount] = useState(8);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [products, setProducts] = useState([])
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      let response;
      try {
        response = await API.get(`/products?categoryId=41`);
        setProducts(response.data);
      } catch (error) {
        console.log(error)
      }
    }
    fetchProducts()
  }, [])

  // Adjust items per page based on screen size
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width <= 480) {
        // Mobile: show fewer items initially
        setItemsPerPage(4);
        setVisibleCount(prev => Math.min(prev, 4));
      } else if (width <= 768) {
        // Tablet: moderate number of items
        setItemsPerPage(6);
      } else {
        // Desktop: full number of items
        setItemsPerPage(8);
      }
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAddToCart = (productName, action) => {
    // Enhanced feedback for different screen sizes
    const isMobile = window.innerWidth <= 480;
    const message = isMobile 
      ? `${action === 'buy' ? 'Buying' : 'Added'}: ${productName.substring(0, 30)}...`
      : `${action === 'buy' ? 'Proceeding to buy' : 'Added to cart'}: ${productName}`;
    
    alert(message);
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + itemsPerPage, products.length));
  };

  const handleSeeMore = () => {
    // Check if on mobile for different navigation behavior
    if (window.innerWidth <= 480) {
      // On mobile, you might want to show a loading state or different behavior
      setVisibleCount(products.length);
    } else {
      navigate('/category/construction-materials/products', {
        state: {
          cat_id: 41,
          name: 'Construction Materials'
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

  return (
    <div className={styles.productLayout}>
      <div className={styles.productSidebar}>
        <h2>Building & Construction</h2>
        <img 
          src="/images/b_c_image.jpg" 
          alt="Construction worker with tools and materials" 
          loading="lazy"
        />
      </div>

      <div className={styles.products}>
        {products.map((product, idx) => (
          <div className={styles.productCard} key={`${product.sku}-${idx}`}>
            <img 
              src={`${process.env.REACT_APP_API_BASE_URL}/${product.primary_image}`} 
              alt={`${product.name} - ${product.unit} package`}
              className={styles.productImage}
              loading="lazy"
              onClick={() => handleDetails(product.product_id)}
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
    </div>
  );
};

export default ProductPageN;