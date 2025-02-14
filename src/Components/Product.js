import React from 'react';
import './Product.css';

function Product({ image }) {
  return (
    <div className="product-card">
      <img className="product-image" src={image} alt="Product" />
    </div>
  );
}

export default Product;
