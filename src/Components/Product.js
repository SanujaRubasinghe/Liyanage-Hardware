import React from 'react';
import './Product.css'; 

function Product({ name, price, image, onBuyClick }) {
  return (
    <div className="product-card">
      <img src={image} alt={name} className="product-image" />
      <h3>{name}</h3>
      <p className="product-price">{price}</p>
      {/* Button to handle buy action */}
      {/* <button className="buy-button" onClick={onBuyClick}>
        Buy Now
      </button> */}
    </div>
  );
}

export default Product;
