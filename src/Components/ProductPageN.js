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
  }
];

const itemsPerPage = 3;

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
      <aside className="filter-panel">
        <div className="filter-group">
          <h4>Range</h4>
          {filters.range.map((item, i) => (
            <label key={i}><input type="checkbox" /> {item}</label>
          ))}
        </div>
        <div className="filter-group">
          <h4>Brand</h4>
          {filters.brand.map((item, i) => (
            <label key={i}><input type="checkbox" /> {item}</label>
          ))}
        </div>
        <div className="filter-group">
          <h4>Fire Rating</h4>
          {filters.fireRating.map((item, i) => (
            <label key={i}><input type="radio" name="fireRating" /> {item}</label>
          ))}
        </div>
      </aside>

      <main className="product-list">
        <div className="banner">
          <img src="#" alt="Promo Banner" /> {/* daya bosa banner eka */}
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
