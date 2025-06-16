import React, { useState } from 'react';
import './ProductPageN.css';

const filters = {
  range: ['1130B.', '3934', '9870', '996', 'Acoustic', 'AR1998'],
  brand: ['Briton', 'DORMA', 'Exidor', 'Fireco', 'GEZE', 'Rutland'],
  fireRating: ['30', '60', '120'],
};

const allProducts = [
  {
    image: '/images/product1.png',
    name: 'GEZE TS4000E',
    sku: 'TS4000E-01',
    price: 4500,
    unit: 'per item',
  },
  {
    image: '/images/product2.png',
    name: 'Exidor 9870',
    sku: '9870-02',
    price: 5200,
    unit: 'each',
  },
  {
    image: '/images/product3.png',
    name: 'GEZE TS4000EFS',
    sku: 'TS4000EFS-03',
    price: 6000,
    unit: 'each',
  },
  {
    image: '/images/product4.png',
    name: 'Dorma TS83',
    sku: 'TS83-04',
    price: 4999,
    unit: 'each',
  },
  {
    image: '/images/product5.png',
    name: 'Briton 996',
    sku: '996-BR',
    price: 3200,
    unit: 'pack',
  },
  {
    image: '/images/product6.png',
    name: 'Fireco Acoustic',
    sku: 'FIRECO-AC',
    price: 7100,
    unit: 'each',
  },

  {
image: '/images/product1.png',
name: 'SecureLock Pro',
sku: 'SLP-001',
price: 4500,
unit: 'each'
},
{
image: '/images/product2.png',
name: 'EcoLight Bulb',
sku: 'ELB-002',
price: 1200,
unit: 'pack'
},
{
image: '/images/product3.png',
name: 'SmartThermostat',
sku: 'STH-003',
price: 8900,
unit: 'each'
},
{
image: '/images/product4.png',
name: 'UltraClean Filter',
sku: 'UCF-004',
price: 2800,
unit: 'pack'
},
{
image: '/images/product5.png',
name: 'PowerSurge Protector',
sku: 'PSP-005',
price: 3500,
unit: 'each'
},
{
image: '/images/product6.png',
name: 'FlexiHose 50ft',
sku: 'FH-006',
price: 2200,
unit: 'each'
},
{
image: '/images/product7.png',
name: 'QuickCharge Adapter',
sku: 'QCA-007',
price: 1800,
unit: 'pack'
},
{
image: '/images/product8.png',
name: 'SafeGuard Alarm',
sku: 'SGA-008',
price: 6700,
unit: 'each'
},
{
image: '/images/product9.png',
name: 'CoolBreeze Fan',
sku: 'CBF-009',
price: 4100,
unit: 'each'
},
{
image: '/images/product10.png',
name: 'DuraMat Set',
sku: 'DMS-010',
price: 1500,
unit: 'pack'
}
];

const itemsPerPage = 12;

const ProductPageN = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const handleAddToCart = () => {
    alert('Added to cart!');
  };

  const totalPages = Math.ceil(allProducts.length / itemsPerPage);
  const currentProducts = allProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="page-container">
      <aside className="product-filters__panel">
  <h3 className="product-filters__title">Filter Products</h3>

  <div className="product-filters__group">
    <h4 className="product-filters__title">Range</h4>
    {filters.range.map((item, i) => (
      <label key={i} className="product-filters__option">
        <input type="checkbox" /> {item}
      </label>
    ))}
  </div>

  <div className="product-filters__group">
    <h4 className="product-filters__title">Brand</h4>
    {filters.brand.map((item, i) => (
      <label key={i} className="product-filters__option">
        <input type="checkbox" /> {item}
      </label>
    ))}
  </div>

  <div className="product-filters__group">
    <h4 className="product-filters__title">Fire Rating</h4>
    {filters.fireRating.map((item, i) => (
      <label key={i} className="product-filters__option">
        <input type="radio" name="fireRating" /> {item}
      </label>
    ))}
  </div>

  <button className="product-filters__clear-button">Clear Filters</button>
</aside>
    

      <main className="product-list">
        <div className="banner">
          <img src="/images/panaromaMessi.jpg" alt="Promo Banner" /> {/* daya bosa banner eka */}
        </div>

        <div className="products">
          {currentProducts.map((product, index) => (
            <div className="product-card" key={index}>
              <img src={product.image} alt={product.name} className="product-image" />
              <div className="product-details">
                <h3 className="product-title">{product.name}</h3>
                <p className="product-part">Part Number: {product.sku}</p>
                <p className="product-price">Rs.{product.price} <span>inc VAT</span></p>
                <p className="product-unit">{product.unit}</p>
                <div className="product-actions">
                  <button className="buy-to-cart" onClick={handleAddToCart}>Buy now</button>
                  <button className="add-to-cart1" onClick={handleAddToCart}>Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              className={`page-btn ${currentPage === index + 1 ? 'active' : ''}`}
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
