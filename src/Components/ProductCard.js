import React from "react";
import { useNavigate } from "react-router-dom";
import "./ProductCard.css";

const ProductCard = ({ image, title, partNumber, price, unit }) => {
  const navigate = useNavigate();

  const handleAddToCart = () => {
    // Navigate to the ProductDisplay page with product details
    navigate("/product-display", {
      state: { image, title, partNumber, price, unit }
    });
  };

  return (
    <div className="product-card">
      <img src={image} alt={title} className="product-image" />
      <div className="product-details">
        <h3 className="product-title">{title}</h3>
        <p className="product-part">Part Number: {partNumber}</p>
        <p className="product-price">{price} <span>inc VAT</span></p>
        <p className="product-unit">{unit}</p>
        <div className="product-actions">
      
          <button className="buy-to-cart" onClick={handleAddToCart}>
            Buy now
          </button>
          <button className="add-to-cart1" onClick={handleAddToCart}>
            Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
