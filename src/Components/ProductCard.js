import React from "react";
import { useNavigate } from "react-router-dom";
import { useProductViewTracker } from "../hooks/useProductViewTracker";
import "./ProductCard.css";

const ProductCard = (product) => {
  const navigate = useNavigate();
  const viewRef = useProductViewTracker(product.product_id)

  const handleAddToCart = () => {
    // Navigate to the ProductDisplay page with product details
    navigate("/product-display", {
      state: {id : product.product_id}
    });
  };

  return (
    <div className="product-card" ref={viewRef}>
      <img src={`${process.env.REACT_APP_API_BASE_URL}/${product.primary_image}` || "/placeholder.jpg"} alt={product.name || "Product"} className="product-image" />
      <div className="product-details">
        <h3 className="product-title">{product.name}</h3>
        <p className="product-part">Part Number: {product.sku}</p>
        <p className="product-price">Rs.{product.price} <span>inc VAT</span></p>
        {/* <p className="product-unit">{unit}</p> */}
        <div className="product-actions">
      
          <button className="buy-to-cart" onClick={handleAddToCart}>
            Buy
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
