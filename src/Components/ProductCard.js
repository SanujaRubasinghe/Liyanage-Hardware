import React from "react";
import { useNavigate } from "react-router-dom";
import { useProductViewTracker } from "../hooks/useProductViewTracker";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const viewRef = useProductViewTracker(product?.product_id);

  const handleBuyNow = () => {
    navigate("/buying", {
      state: {
        product: {
          product_id: product.product_id,
          name: product.name,
          sku: product.sku,
          price: product.price,
          quantity: 1,
          image: product.primary_image
        }
      },
    });
  };

  const handleDetails = (productId) => {
    navigate(`/products/${productId}`);
  };

  if (!product) {
    return (
      <div className="product-card skeleton">
        <div className="product-image-skeleton"></div>
        <div className="product-details-skeleton">
          <div className="skeleton-line"></div>
          <div className="skeleton-line short"></div>
          <div className="skeleton-line shorter"></div>
          <div className="skeleton-buttons">
            <div className="skeleton-button"></div>
            <div className="skeleton-button"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-card" ref={viewRef}>
      <div className="product-image-container">
        <img 
          src={`${process.env.REACT_APP_API_BASE_URL}/${product.primary_image}`} 
          alt={product.name} 
          className="product-image" 
          loading="lazy"
        />
      </div>
      <div className="product-details">
        <h3 className="product-title">{product.name}</h3>
        <p className="product-part">Part: {product.sku}</p>
        <p className="product-price">Rs.{product.price} <span>inc VAT</span></p>
        <p className="product-unit">{product.unit}</p>
        <div className="product-actions">
          <button className="buy-now-btn" onClick={handleBuyNow}>Buy now</button>
          <button className="details-btn" onClick={() => handleDetails(product.product_id)}>Details</button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;