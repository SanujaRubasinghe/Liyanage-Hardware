import React, { useState } from 'react';
import styles from './ProductPageN.module.css';

const filters = {
  range: ['1130B.', '3934', '9870', '996', 'Acoustic', 'AR1998'],
  brand: ['Briton', 'DORMA', 'Exidor', 'Fireco', 'GEZE', 'Rutland'],
  fireRating: ['30', '60', '120'],
};

const allProducts = [
    {
        image: '/images/p11.jpg',
        name: 'GEZE TS4000E',
        sku: 'TS4000E-01',
        price: 4500,
        unit: 'per item',
    },
    {
        image: '/images/p11.jpg',
        name: 'Exidor 9870',
        sku: '9870-02',
        price: 5200,
        unit: 'each',
    },
    {
        image: '/images/p11.jpg',
        name: 'GEZE TS4000EFS',
        sku: 'TS4000EFS-03',
        price: 6000,
        unit: 'each',
    },
    {
        image: '/images/p11.jpg',
        name: 'Dorma TS83',
        sku: 'TS83-04',
        price: 4999,
        unit: 'each',
    },
    {
        image: '/images/p11.jpg',
        name: 'Briton 996',
        sku: '996-BR',
        price: 3200,
        unit: 'pack',
    },
    {
        image: '/images/p11.jpg',
        name: 'Fireco Acoustic',
        sku: 'FIRECO-AC',
        price: 7100,
        unit: 'each',
    },
    {
        image: '/images/p11.jpg',
        name: 'SecureLock Pro',
        sku: 'SLP-001',
        price: 4500,
        unit: 'each'
    },
    {
        image: '/images/p11.jpg',
        name: 'EcoLight Bulb',
        sku: 'ELB-002',
        price: 1200,
        unit: 'pack'
    },
    {
        image: '/images/p11.jpg',
        name: 'SmartThermostat',
        sku: 'STH-003',
        price: 8900,
        unit: 'each'
    },
    {
        image: '/images/p11.jpg',
        name: 'UltraClean Filter',
        sku: 'UCF-004',
        price: 2800,
        unit: 'pack'
    },
    {
        image: '/images/p11.jpg',
        name: 'PowerSurge Protector',
        sku: 'PSP-005',
        price: 3500,
        unit: 'each'
    },
    {
        image: '/images/p11.jpg',
        name: 'FlexiHose 50ft',
        sku: 'FH-006',
        price: 2200,
        unit: 'each'
    },
    {
        image: '/images/p11.jpg',
        name: 'QuickCharge Adapter',
        sku: 'QCA-007',
        price: 1800,
        unit: 'pack'
    },
    {
        image: '/images/p11.jpg',
        name: 'SafeGuard Alarm',
        sku: 'SGA-008',
        price: 6700,
        unit: 'each'
    },
    {
        image: '/images/p11.jpg',
        name: 'CoolBreeze Fan',
        sku: 'CBF-009',
        price: 4100,
        unit: 'each'
    }
];

const itemsPerPage = 12;

const ProductPageN = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filtersVisible, setFiltersVisible] = useState(false);

  const handleAddToCart = () => {
    alert('Added to cart!');
  };

  const toggleFilters = () => {
    setFiltersVisible(!filtersVisible);
  };

  const totalPages = Math.ceil(allProducts.length / itemsPerPage);
  const currentProducts = allProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className={styles.pageContainer}>
        <div className={styles.filtersContainer}>
            {/* This button will only be visible on tablet/mobile screens */}
            <button className={styles.filterToggleButton} onClick={toggleFilters}>
                {filtersVisible ? 'Hide Filters' : 'Show Filters'}
            </button>
            
            <aside className={`${styles.productFiltersPanel} ${!filtersVisible ? styles.hiddenOnMobile : ''}`}>
                <h3 className={styles.productFiltersTitle}>Filter Products</h3>

                <div className={styles.productFiltersGroup}>
                <h4 className={styles.productFiltersTitle}>Range</h4>
                {filters.range.map((item, i) => (
                    <label key={i} className={styles.productFiltersOption}>
                    <input type="checkbox" /> {item}
                    </label>
                ))}
                </div>

                <div className={styles.productFiltersGroup}>
                <h4 className={styles.productFiltersTitle}>Brand</h4>
                {filters.brand.map((item, i) => (
                    <label key={i} className={styles.productFiltersOption}>
                    <input type="checkbox" /> {item}
                    </label>
                ))}
                </div>

                <div className={styles.productFiltersGroup}>
                <h4 className={styles.productFiltersTitle}>Fire Rating</h4>
                {filters.fireRating.map((item, i) => (
                    <label key={i} className={styles.productFiltersOption}>
                    <input type="radio" name="fireRating" /> {item}
                    </label>
                ))}
                </div>

                <button className={styles.productFiltersClearButton}>Clear Filters</button>
            </aside>
        </div>
      
      <main className={styles.productList}>
        <div className={styles.banner}>
          <img src="/images/category/bathware/161.jpg" alt="Promo Banner" />
        </div>

        <div className={styles.products}>
          {currentProducts.map((product, index) => (
            <div className={styles.productCard} key={index}>
              <img src={product.image} alt={product.name} className={styles.productImage} />
              <div className={styles.productDetails}>
                <h3 className={styles.productTitle}>{product.name}</h3>
                <p className={styles.productPart}>Part Number: {product.sku}</p>
                <p className={styles.productPrice}>Rs.{product.price} <span>inc VAT</span></p>
                <p className={styles.productUnit}>{product.unit}</p>
                <div className={styles.productActions}>
                  <button className={styles.buyToCart} onClick={handleAddToCart}>Buy now</button>
                  <button className={styles.addToCart1} onClick={handleAddToCart}>Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.pagination}>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              className={`${styles.pageBtn} ${currentPage === index + 1 ? styles.active : ''}`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ProductPageN;