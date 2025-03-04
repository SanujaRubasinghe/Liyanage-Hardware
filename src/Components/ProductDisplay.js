import React, { useState } from "react";
import { useCart } from "./CartContext"; // Import useCart hook
import { useNavigate } from "react-router-dom";
import "./ProductDisplay.css";
import NewArrivals from "./NewArrivals";
import FeatureSection from "./FeatureSection";
import Footer from "./Footer";

const ProductDisplay = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart(); // Destructure addToCart from useCart

  const product = {
    id: 1, // Ensure each product has a unique id
    name: "Mcoco Plastic Plant for Indoor and Outdoor Rice White Color",
    sku: "MCO/PP/RW/P444",
    price: 4100,
    images: ["/images/P1.jpg", "/images/P1.jpg", "/images/P1.jpg"],
    sizes: ["155mm", "220mm", "340mm"],
    colors: ["White", "Black", "Gray"],
  };

  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(product.images[0]);

  const handleAddToCart = () => {
    addToCart({
      ...product,
      selectedSize,
      selectedColor,
      quantity,
    });
  };

  const handleBuyNow = () => {
    navigate("/buying", {
      state: {
        productName: product.name,
        productSku: product.sku,
        productPrice: product.price,
        selectedSize,
        selectedColor,
        quantity,
      },
    });
  };

  return (
    <>
      <div className="product-container-pd">
        <div className="image-gallery">
          {product.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Thumbnail ${index + 1}`}
              className="gallery-thumbnail-pd"
              onClick={() => setSelectedImage(image)}
            />
          ))}
        </div>

        <div className="main-image-container">
          <img src={selectedImage} alt="Selected Product" className="main-image" />
        </div>

        <div className="product-details-pd">
          <h2>{product.name}</h2>
          <span className="sku-pd">SKU: {product.sku}</span>
          <span className="price-pd">Rs. {product.price.toLocaleString()}</span>

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
            <button className="add-to-cart-pd" onClick={handleAddToCart}>
              Add to Cart
            </button>
            <button className="buy-now-pd" onClick={handleBuyNow}>
              Buy it Now
            </button>
          </div>
        </div>
      </div>

      <div className="new-arrivals-wrapper">
        <NewArrivals />
      </div>
      <FeatureSection />
      <Footer />
    </>
  );
};

export default ProductDisplay;
