import React, { useState } from "react";
import "./ProductDisplay.css";

const ProductDisplay = () => {
  const product = {
    name: "Mcoco Plastic Plant for Indoor and Outdoor Rice White Color",
    sku: "MCO/PP/RW/P444",
    price: "Rs 4,100.02 LKR",
    images: [
      "/images/product1.jpg",
      "/images/product2.jpg",
      "/images/product3.jpg",
      "/images/product4.jpg",
    ],
    sizes: ["155mm", "220mm", "340mm"],
    colors: ["White", "Black", "Gray"],
  };

  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="product-container-pd">
      
      <div className="image-gallery">
        {product.images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Product ${index + 1}`}
            className="gallery-thumbnail-pd"
          />
        ))}
      </div>

      
      <div className="product-details-pd">
        <h2>{product.name}</h2>
        <span className="sku-pd">SKU: {product.sku}</span>
        <span className="price-pd">{product.price}</span>

       
        <div className="size-selection-pd">
          <h4>Size</h4>
          {product.sizes.map((size) => (
            <button
              key={size}
              className={selectedSize === size ? "selected" : ""}
              onClick={() => setSelectedSize(size)}
            >
              {size}
            </button>
          ))}
        </div>

        <div className="color-selection">
          <h4>Color</h4>
          {product.colors.map((color) => (
            <button
              key={color}
              className={selectedColor === color ? "selected" : ""}
              onClick={() => setSelectedColor(color)}
            >
              {color}
            </button>
          ))}
        </div>

        <div className="quantity-selector">
          <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
          <span>{quantity}</span>
          <button onClick={() => setQuantity(quantity + 1)}>+</button>
        </div>

        
        <div className="actions">
          <button className="add-to-cart-pd">Add to Cart</button>
          <button className="buy-now-pd">Buy it Now</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDisplay;
