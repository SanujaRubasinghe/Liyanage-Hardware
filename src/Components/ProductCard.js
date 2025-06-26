import React from "react";
import { useNavigate } from "react-router-dom";
import { useProductViewTracker } from "../hooks/useProductViewTracker";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const navigate = useNavigate()
  const viewRef = useProductViewTracker(product?.product_id);

  const handleBuyNow = () => {
    navigate("/buying", {
      state: {product: {
        product_id: product.product_id,
        name: product.name,
        sku: product.sku,
        price: product.price,
        // selectedSize,
        // selectedColor,
        quantity: 1,
        image: product.primary_image
      }},
    });
  }

  const handleDetails = (productId) => {
    navigate(`/products/${productId}`)
  }

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
          <button className="buy-to-cart" onClick={handleBuyNow}>Buy now</button>
          <button className="add-to-cart1" onClick={() => handleDetails(product.product_id)}>Details</button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;