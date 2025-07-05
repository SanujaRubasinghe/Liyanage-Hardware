import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AllProductD.module.css'; // your updated CSS module
import API from '../api';

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

  const handleAddToCart = () => {
    alert('Added to cart!');
  };

  const hasMore = visibleCount < allProducts.length;
  const productsToShow = hasMore
    ? allProducts.slice(0, visibleCount - 1)
    : allProducts.slice(0, visibleCount);

  const handleSeeMore = () => {
    // Check if on mobile for different navigation behavior
    if (window.innerWidth <= 480) {
      // On mobile, you might want to show a loading state or different behavior
      setVisibleCount(allProducts.length);
    } else {
      navigate('/category/construction-materials/products', {
        state: {
          cat_id: 35,
          name: 'Cutting Tools'
        }
      });
    }
  };

  return (
    <div className={styles.productLayout}>
      <div className={styles.productSidebar}>
        <h2>Cutting Tools</h2>
        <img src="/images/cutting_tool_banner.jpg" alt="Worker" />
      </div>

      <div className={styles.products}>
        {products.map((product, idx) => (
          <div className={styles.productCard} key={idx}>
            <img src={`${process.env.REACT_APP_API_BASE_URL}/${product.primary_image}`}  alt={product.name} className={styles.productImage} />
            <div className={styles.productDetails}>
              <h3 className={styles.productTitle}>{product.name}</h3>
              <p className={styles.productPart}>Part Number: {product.sku}</p>
              <p className={styles.productPrice}>
                Rs. {product.price} <span>inc VAT</span>
              </p>
              <p className={styles.productUnit}>{product.unit}</p>
              <div className={styles.productActions}>
                <button className={styles.buyToCart} onClick={handleAddToCart}>
                  Buy now
                </button>
                <button className={styles.addToCart1} onClick={handleAddToCart}>
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
