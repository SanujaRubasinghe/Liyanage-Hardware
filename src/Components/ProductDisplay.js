import React, { useEffect, useState } from "react";
import { useCart } from "./CartContext"; // Import useCart hook
import { useNavigate, useLocation, useParams } from "react-router-dom";
import API from "../api"
import "./ProductDisplay.css";
import NewArrivals from "./NewArrivals";
import FeatureSection from "./FeatureSection";
import Footer from "./Footer";
import LoadingPage from "./LoadingPage"

const ProductDisplay = () => {
  
  const navigate = useNavigate();
  const location = useLocation()
  const { id } = location.state || {}
  const { addToCart } = useCart(); 

  const [product, setProduct] = useState(null)
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  
  
  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        try {
          const response = await API.get(`/products/${id}`)
          setProduct(response.data)
        } catch(err) {
          console.error("Error fetching product details: ", err)
        }
      }
    }
    fetchProduct()
  }, [id])

  useEffect(() => {
    if (product) {
      // setSelectedSize(product[0].sizes[0] || "")
      // setSelectedColor(product[0].colors[0] || "")
      setSelectedImage(product.images[0] || "")
    }
  }, [product])

  if (!product) {
    return <LoadingPage />
  }

  const handleAddToCart = () => {
    addToCart({
      ...product,product
    });
  };

  const handleBuyNow = () => {
    navigate("/buying", {
      state: {
        productId: product.product_id,
        productName: product.name,
        productSku: product.sku,
        productPrice: product.price,
        // selectedSize,
        // selectedColor,
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
              src={`${process.env.REACT_APP_API_BASE_URL}/${image}`}
              alt={`Thumbnail ${index + 1}`}
              className="gallery-thumbnail-pd"
              onClick={() => setSelectedImage(image)}
            />
          ))}
        </div>

        <div className="main-image-container">
          <img src={`${process.env.REACT_APP_API_BASE_URL}/${selectedImage}`} alt="Selected Product" className="main-image" />
        </div>

        <div className="product-details-pd">
          <h2>{product.name}</h2>
          <span className="sku-pd">SKU: {product.sku}</span>
          <span className="price-pd">Rs. {product.price.toLocaleString()}</span>

          {/* <div className="size-selection-pd">
            <h4>Size</h4>
            {product[0].sizes.map((size) => (
              <button
                key={size}
                className={selectedSize === size ? "selected" : ""}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div> */}

          {/* <div className="color-selection">
            <h4>Color</h4>
            {product[0].colors.map((color) => (
              <button
                key={color}
                className={selectedColor === color ? "selected" : ""}
                onClick={() => setSelectedColor(color)}
              >
                {color}
              </button>
            ))}
          </div> */}

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
