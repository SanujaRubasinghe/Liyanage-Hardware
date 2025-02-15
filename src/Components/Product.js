import React from 'react';
import './Product.css';

function Product({ image }) {
  return (
    <div className="product-card-c">
      <img className="product-image-c" src={image} alt="Product" />
    </div>
  );
}

export default Product;
