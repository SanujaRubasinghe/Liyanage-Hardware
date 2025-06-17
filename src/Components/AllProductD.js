import React, { useState } from 'react';
import './ProductPageN.css';

const allProducts = [
  {
    image: '/images/product1.png',
    name: 'Adhesive: Chemifix General Purpose (20kg) – Fevicol',
    sku: 'SKU-001',
    price: '24,688.00',
    unit: '20kg',
  },
  {
    image: '/images/product2.png',
    name: 'Adhesive: Chemifix General Purpose (10kg) – Fevicol',
    sku: 'SKU-002',
    price: '12,608.00',
    unit: '10kg',
  },
  {
    image: '/images/product3.png',
    name: 'Adhesive: Chemifix General Purpose (4kg) – Fevicol',
    sku: 'SKU-003',
    price: '5,272.00',
    unit: '4kg',
  },
  {
    image: '/images/product4.png',
    name: 'SH Synthetic Resin Adhesive (5kg) – Fevicol',
    sku: 'SKU-004',
    price: '6,420.00',
    unit: '5kg',
  },
  {
    image: '/images/product5.png',
    name: 'SH Synthetic Resin Adhesive (2.5kg) – Fevicol',
    sku: 'SKU-005',
    price: '3,348.00',
    unit: '2.5kg',
  },
  // Add more if needed...
];

const itemsPerPage = 6;

const ProductPageN = () => {
  const [visibleCount, setVisibleCount] = useState(itemsPerPage);

  const handleAddToCart = () => {
    alert('Added to cart!');
  };

  const handleSeeMore = () => {
    setVisibleCount((prev) => prev + itemsPerPage);
  };

  return (
    <div className="product-layout">
      <div className="product-sidebar">
        <h2>Building & Construction</h2>
        <img src="/images/worker.png" alt="Worker" />
      </div>

      <div className="products">
        {allProducts.slice(0, visibleCount).map((product, index) => (
          <div className="product-card" key={index}>
            <img src={product.image} alt={product.name} className="product-image" />
            <div className="product-details">
              <h3 className="product-title">{product.name}</h3>
              <p className="product-part">Part Number: {product.sku}</p>
              <p className="product-price">Rs. {product.price} <span>inc VAT</span></p>
              <p className="product-unit">{product.unit}</p>
              <div className="product-actions">
                <button className="buy-to-cart" onClick={handleAddToCart}>Buy now</button>
                <button className="add-to-cart1" onClick={handleAddToCart}>Details</button>
              </div>
            </div>
          </div>
        ))}

        {visibleCount < allProducts.length && (
          <div className="see-more-container">
            <button className="see-more-btn" onClick={handleSeeMore}>See More</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPageN;
