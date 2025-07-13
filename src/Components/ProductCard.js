import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ProductCard.module.css";

const ProductCard = ({id, name, sku, price, images, sizes, colors, unit, prtdid}) => {
  const navigate = useNavigate();

  const handleAddToCart = () => {
    // Navigate to the ProductDisplay page with product details
    navigate("/product-display", {
      state: { prtdid }
    });
  };

  return (
    <div className={styles.productCard}>
      <img 
        src={images?.[0] || "/images/messi.webp"} 
        alt={name || "Product"} 
        className={styles.productImage} 
      />
      <div className={styles.productDetails}>
        <h3 className={styles.productTitle}>{name}</h3>
        <p className={styles.productPart}>Part Number: {sku}</p>
        <p className={styles.productPrice}>Rs.{price} <span>inc VAT</span></p>
        <p className={styles.productUnit}>{unit}</p>
        <div className={styles.productActions}>
          <button className={styles.buyToCart} onClick={handleAddToCart}>
            Buy
          </button>
          <button className={styles.addToCart} onClick={handleAddToCart}>
            Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;