import React from 'react';
import './Product.css';

function Product({ image, name }) {
  return (
    <div className="product-card-c">
      <img className="product-image-c" src={image} alt="Product" />
      <h3 className="product-name">{name}</h3>
    </div>
  );
}

export default Product;
