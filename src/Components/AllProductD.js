import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AllProductD.module.css';

const allProducts = [
  { image: '/images/leo1.webp', name: 'Adhesive: Chemifix General Purpose (20kg) – Fevicol', sku: 'SKU-001', price: '24,688.00', unit: '20kg' },
  { image: '/images/leo1.webp', name: 'Adhesive: Chemifix General Purpose (10kg) – Fevicol', sku: 'SKU-002', price: '12,608.00', unit: '10kg' },
  { image: '/images/leo1.webp', name: 'Adhesive: Chemifix General Purpose (4kg) – Fevicol', sku: 'SKU-003', price: '5,272.00', unit: '4kg' },
  { image: '/images/leo1.webp', name: 'SH Synthetic Resin Adhesive (5kg) – Fevicol', sku: 'SKU-004', price: '6,420.00', unit: '5kg' },
  { image: '/images/leo1.webp', name: 'SH Synthetic Resin Adhesive (2.5kg) – Fevicol', sku: 'SKU-005', price: '3,348.00', unit: '2.5kg' },
  { image: '/images/leo1.webp', name: 'Woodworking Glue (1kg) – Fevicol', sku: 'SKU-006', price: '1,250.00', unit: '1kg' },
  { image: '/images/leo1.webp', name: 'Waterproof Adhesive (500g) – Fevicol', sku: 'SKU-007', price: '875.00', unit: '500g' },
  { image: '/images/leo1.webp', name: 'Carpenter Glue (2kg) – Fevicol', sku: 'SKU-008', price: '2,100.00', unit: '2kg' },
  { image: '/images/leo1.webp', name: 'Multi-Purpose Adhesive (1kg) – Fevicol', sku: 'SKU-009', price: '1,450.00', unit: '1kg' },
];

const ProductPageN = () => {
  const [visibleCount, setVisibleCount] = useState(8);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const navigate = useNavigate();

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
    setVisibleCount(prev => Math.min(prev + itemsPerPage, allProducts.length));
  };

  const handleSeeMore = () => {
    // Check if on mobile for different navigation behavior
    if (window.innerWidth <= 480) {
      // On mobile, you might want to show a loading state or different behavior
      setVisibleCount(allProducts.length);
    } else {
      navigate('/product');
    }
  };

  const hasMore = visibleCount < allProducts.length;
  const productsToShow = hasMore
    ? allProducts.slice(0, visibleCount - 1)
    : allProducts.slice(0, visibleCount);

  return (
    <div className={styles.productLayout}>
      <div className={styles.productSidebar}>
        <h2>Building & Construction</h2>
        <img 
          src="/images/worker.png" 
          alt="Construction worker with tools and materials" 
          loading="lazy"
        />
      </div>

      <div className={styles.products}>
        {productsToShow.map((product, idx) => (
          <div className={styles.productCard} key={`${product.sku}-${idx}`}>
            <img 
              src={product.image} 
              alt={`${product.name} - ${product.unit} package`}
              className={styles.productImage}
              loading="lazy"
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
                  onClick={() => handleAddToCart(product.name, 'buy')}
                  aria-label={`Buy ${product.name} now`}
                >
                  Buy now
                </button>
                <button 
                  className={styles.addToCart1} 
                  onClick={() => handleAddToCart(product.name, 'details')}
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