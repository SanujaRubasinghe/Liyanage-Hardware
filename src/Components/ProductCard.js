import React from "react";
import "./ProductCard.css";

const ProductCard = ({ image, title, partNumber, price, unit }) => {
  return (
    <div className="product-card">
      <img src={image} alt={title} className="product-image" />
      <div className="product-details">
        <h3 className="product-title">{title}</h3>
        <p className="product-part">Part Number: {partNumber}</p>
        <p className="product-price">{price} <span>inc VAT</span></p>
        <p className="product-unit">{unit}</p>
        <div className="product-actions">
          <input type="number" defaultValue="1" className="quantity-input" />
          <button className="add-to-cart">Add to cart</button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
