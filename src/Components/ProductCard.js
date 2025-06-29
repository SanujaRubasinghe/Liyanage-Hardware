import React from "react";
import { useNavigate } from "react-router-dom";
import "./ProductCard.css";

const ProductCard = ({id, name, sku, price, images, sizes, colors, unit, prtdid}) => {
  const navigate = useNavigate();

  const handleAddToCart = () => {
    // Navigate to the ProductDisplay page with product details
    navigate("/product-display", {
      state: { prtdid }
    });
  };

  return (
    <div className="product-card">
      <img src={images?.[0] || "/images/messi.webp"} alt={name || "Product"} className="product-image" />
      <div className="product-details">
        <h3 className="product-title">{name}</h3>
        <p className="product-part">Part Number: {sku}</p>
        <p className="product-price">Rs.{price} <span>inc VAT</span></p>
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
