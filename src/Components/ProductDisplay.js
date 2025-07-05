import React, { useEffect, useState } from "react";
import { useCart } from "./CartContext";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api";
import "./ProductDisplay.css";
import NewArrivals from "./NewArrivals";
import FeatureSection from "./FeatureSection";
import Footer from "./Footer";
import SearchBarN from "./SearchBarN";
import LoadingPage from "./LoadingPage";
import { toast } from "react-toastify";
import { checkConsent } from "../services/checkConsent";

import { Helmet } from "react-helmet";

const ProductDisplay = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isMobileGallery, setIsMobileGallery] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobileGallery(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        try {
          const response = await API.get(`/products/${id}`);
          setProduct(response.data);
        } catch(err) {
          console.error("Error fetching product details: ", err);
        }
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product?.images?.length) {
      setSelectedImage(product.images[0]);
    }
  }, [product]);

  const trackAddToCart = async () => {
    const hasConsent = checkConsent();
    if (!hasConsent) return;

    try {
      await API.post('/analytics/user/cart-action', {
        product_id: product.product_id,
        action: 'add',
        quantity: quantity
      });
    } catch (error) {
      console.log('Cart Tracking failed: ', error);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    trackAddToCart();
    toast.success(`${quantity} ${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    navigate("/buying", {
      state: {
        product: {
          product_id: product.product_id,
          name: product.name,
          sku: product.sku,
          price: product.price,
          quantity,
          image: product.images[0]
        }
      },
    });
  };

  if (!product) {
    return <LoadingPage />;
  }

  return (
    <>
      <Helmet>
        <title>Product Details | New Liyanage Hardware</title>
        <meta name="description" content="View product specifications, features, and availability." />
        <link rel="canonical" href="https://newliyanagehardware.lk/products/:id" />
      </Helmet>
      <SearchBarN />
      <div className="product-container-pd">
        {/* Mobile Gallery View */}
        {isMobileGallery ? (
          <div className="mobile-gallery">
            <div className="main-image-container">
              <img 
                src={`${process.env.REACT_APP_API_BASE_URL}/${selectedImage}`} 
                alt="Selected Product" 
                className="main-image" 
                loading="lazy"
              />
            </div>
            <div className="thumbnail-scroll">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={`${process.env.REACT_APP_API_BASE_URL}/${image}`}
                  alt={`Thumbnail ${index + 1}`}
                  className={`gallery-thumbnail-pd ${selectedImage === image ? 'active' : ''}`}
                  onClick={() => setSelectedImage(image)}
                  loading="lazy"
                />
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="image-gallery">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={`${process.env.REACT_APP_API_BASE_URL}/${image}`}
                  alt={`Thumbnail ${index + 1}`}
                  className={`gallery-thumbnail-pd ${selectedImage === image ? 'active' : ''}`}
                  onClick={() => setSelectedImage(image)}
                  loading="lazy"
                />
              ))}
            </div>
            <div className="main-image-container">
              <img 
                src={`${process.env.REACT_APP_API_BASE_URL}/${selectedImage}`} 
                alt="Selected Product" 
                className="main-image" 
                loading="lazy"
              />
            </div>
          </>
        )}

        <div className="product-details-pd">
          <div className="product-header">
            <h2>{product.name}</h2>
            <span className="sku-pd">SKU: {product.sku}</span>
            <span className="price-pd">Rs. {product.price.toLocaleString()}</span>
          </div>

          <div className="quantity-selector">
            <h4>Quantity</h4>
            <div className="quantity-controls">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span>{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          <div className="actions">
            <button 
              className="add-to-cart-pd" 
              onClick={handleAddToCart}
              aria-label="Add to cart"
            >
              Add to Cart
            </button>
            <button 
              className="buy-now-pd" 
              onClick={handleBuyNow}
              aria-label="Buy now"
            >
              Buy Now
            </button>
          </div>

          {product.description && (
            <div className="product-description">
              <h4>Description</h4>
              <p>{product.description}</p>
            </div>
          )}
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