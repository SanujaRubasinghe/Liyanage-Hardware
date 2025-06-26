import React from "react";
import { useNavigate } from "react-router-dom";
import { useProductViewTracker } from "../hooks/useProductViewTracker";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart, handleDetails }) => {
  const viewRef = useProductViewTracker(product?.product_id);

  // Return null or a loading skeleton if product is undefined
  if (!product) {
    return null; // or return a loading placeholder
  }

  return (
    <div className="product-card" ref={viewRef}>
      <img 
        src={`${process.env.REACT_APP_API_BASE_URL}/${product.primary_image}`} 
        alt={product.name} 
        className="product-image" 
      />
      <div className="product-details">
        <h3 className="product-title">{product.name}</h3>
        <p className="product-part">Part Number: {product.sku}</p>
        <p className="product-price">Rs.{product.price} <span>inc VAT</span></p>
        <p className="product-unit">{product.unit}</p>
        <div className="product-actions">
          <button className="buy-to-cart" onClick={handleAddToCart}>Buy now</button>
          <button className="add-to-cart1" onClick={handleDetails}>Details</button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;