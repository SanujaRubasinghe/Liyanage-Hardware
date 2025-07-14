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
import StarRating from "./StarRating";

const ProductDisplay = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isMobileGallery, setIsMobileGallery] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
    name: "Anonymous"
  });
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

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

  useEffect(() => {
    const fetchReviews = async () => {
      if (id) {
        setIsLoadingReviews(true);
        try {
          const response = await API.get(`products/reviews/${id}`);
          setReviews(response.data);
        } catch(err) {
          console.error("Error fetching reviews: ", err);
        } finally {
          setIsLoadingReviews(false);
        }
      }
    };
    fetchReviews();
  }, [id]);

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

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.comment || !newReview.name) {
      toast.error("Please fill all fields");
      return;
    }

    setIsSubmittingReview(true);
    try {
      const response = await API.post('/products/reviews', {
        product_id: id,
        ...newReview
      });
      setReviews([response.data, ...reviews]);
      setNewReview({
        rating: 5,
        comment: "",
        name: ""
      });
      toast.success("Review submitted successfully!");
    } catch (error) {
      console.error("Error submitting review: ", error);
      toast.error("Failed to submit review");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  if (!product) {
    return <LoadingPage />;
  }

  return (
    <>
      <Helmet>
        <title>{product.name} | New Liyanage Hardware</title>
        <meta name="description" content={product.description.substring(0, 160)} />
        <link rel="canonical" href={`https://newliyanagehardware.lk/products/${id}`} />
      </Helmet>
      <SearchBarN />
      <div className="nlh-product-container">
        {/* Mobile Gallery View */}
        {isMobileGallery ? (
          <div className="nlh-mobile-gallery-container">
            <div className="nlh-main-image-container">
              <img 
                src={`${process.env.REACT_APP_API_BASE_URL}/${selectedImage}`} 
                alt={product.name} 
                className="nlh-main-image" 
                loading="lazy"
              />
            </div>
            <div className="nlh-mobile-thumbnails">
              {product.images.map((image, index) => (
                <div 
                  key={index}
                  className={`nlh-mobile-thumbnail ${selectedImage === image ? 'active' : ''}`}
                  onClick={() => setSelectedImage(image)}
                >
                  <img
                    src={`${process.env.REACT_APP_API_BASE_URL}/${image}`}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="nlh-image-gallery">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={`${process.env.REACT_APP_API_BASE_URL}/${image}`}
                  alt={`${product.name} - ${index + 1}`}
                  className={`nlh-gallery-thumbnail ${selectedImage === image ? 'active' : ''}`}
                  onClick={() => setSelectedImage(image)}
                  loading="lazy"
                />
              ))}
            </div>
            <div className="nlh-main-image-container">
              <img 
                src={`${process.env.REACT_APP_API_BASE_URL}/${selectedImage}`} 
                alt={product.name} 
                className="nlh-main-image" 
                loading="lazy"
              />
            </div>
          </>
        )}

        <div className="nlh-product-details">
          <div className="nlh-product-header">
            <h1 className="nlh-product-title">{product.name}</h1>
            <div className="nlh-rating-badge">
              <StarRating rating={calculateAverageRating()} />
              <span>({reviews.length} reviews)</span>
            </div>
            <span className="nlh-sku">SKU: {product.sku}</span>
            <span className="nlh-price">Rs. {product.price.toLocaleString()}</span>
          </div>

          <div className="nlh-quantity-selector">
            <h4 className="nlh-section-title">Quantity</h4>
            <div className="nlh-quantity-controls">
              <button 
                className="nlh-quantity-btn"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="nlh-quantity-value">{quantity}</span>
              <button 
                className="nlh-quantity-btn"
                onClick={() => setQuantity(quantity + 1)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          <div className="nlh-actions">
            <button 
              className="nlh-add-to-cart" 
              onClick={handleAddToCart}
              aria-label="Add to cart"
            >
              Add to Cart
            </button>
            <button 
              className="nlh-buy-now" 
              onClick={handleBuyNow}
              aria-label="Buy now"
            >
              Buy Now
            </button>
          </div>
          {isMobileGallery && (
            <div className="nlh-mobile-description">
              <h3 className="nlh-section-title">Product Details</h3>
              <p className="nlh-description-text">{product.description}</p>
            </div>
          )}
        </div>

          {isMobileGallery ? (
            <div className="nlh-mobile-reviews-section">
              <h3 className="nlh-section-title">Customer Reviews</h3>
              <div className="nlh-review-form-container">
                <h4 className="nlh-section-title">Write a Review</h4>
                <form onSubmit={handleReviewSubmit} className="nlh-review-form">
                  <div className="nlh-form-group">
                    <label htmlFor="name" className="nlh-form-label">Your Name</label>
                    <input
                      type="text"
                      id="name"
                      className="nlh-form-input"
                      value={newReview.name}
                      onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="nlh-form-group">
                    <label className="nlh-form-label">Your Rating</label>
                    <StarRating 
                      editable={true}
                      rating={newReview.rating}
                      onRatingChange={(rating) => setNewReview({...newReview, rating})}
                    />
                  </div>
                  <div className="nlh-form-group">
                    <label htmlFor="comment" className="nlh-form-label">Your Review</label>
                    <textarea
                      id="comment"
                      className="nlh-form-textarea"
                      value={newReview.comment}
                      onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                      required
                      rows="4"
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="nlh-submit-review"
                    disabled={isSubmittingReview}
                  >
                    {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              </div>
              <div className="nlh-reviews-list">
                <div className="nlh-reviews-list">
                  <h3 className="nlh-section-title">Customer Reviews</h3>
                  {isLoadingReviews ? (
                    <div className="nlh-loading-reviews">Loading reviews...</div>
                  ) : reviews.length === 0 ? (
                    <p className="nlh-no-reviews">No reviews yet. Be the first to review!</p>
                  ) : (
                    reviews.map((review) => (
                      <div key={review.review_id} className="nlh-review-card">
                        <div className="nlh-review-header">
                          <span className="nlh-reviewer-name">{review.name}</span>
                          <StarRating rating={review.rating} />
                          <span className="nlh-review-date">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="nlh-review-comment">{review.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : (
            <>
        <div className="nlh-product-tabs">
          <button 
            className={`nlh-tab-btn ${activeTab === 'description' ? 'active' : ''}`}
            onClick={() => setActiveTab('description')}
          >
            Description
          </button>
          <button 
            className={`nlh-tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews ({reviews.length})
          </button>
        </div>

        <div className="nlh-tab-content">
          {activeTab === 'description' ? (
            <div className="nlh-product-description">
              <h3 className="nlh-section-title">Product Details</h3>
              <p className="nlh-description-text">{product.description}</p>
            </div>
          ) : (
            <div className="nlh-reviews-section">
              <div className="nlh-review-form-container">
                <h3 className="nlh-section-title">Write a Review</h3>
                <form onSubmit={handleReviewSubmit} className="nlh-review-form">
                  <div className="nlh-form-group">
                    <label htmlFor="name" className="nlh-form-label">Your Name</label>
                    <input
                      type="text"
                      id="name"
                      className="nlh-form-input"
                      value={newReview.name || "Anonymous"}
                      onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="nlh-form-group">
                    <label className="nlh-form-label">Your Rating</label>
                    <StarRating 
                      editable={true}
                      rating={newReview.rating}
                      onRatingChange={(rating) => setNewReview({...newReview, rating})}
                    />
                  </div>
                  <div className="nlh-form-group">
                    <label htmlFor="comment" className="nlh-form-label">Your Review</label>
                    <textarea
                      id="comment"
                      className="nlh-form-textarea"
                      value={newReview.comment}
                      onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                      required
                      rows="4"
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="nlh-submit-review"
                    disabled={isSubmittingReview}
                  >
                    {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              </div>

              <div className="nlh-reviews-list">
                <h3 className="nlh-section-title">Customer Reviews</h3>
                {isLoadingReviews ? (
                  <div className="nlh-loading-reviews">Loading reviews...</div>
                ) : reviews.length === 0 ? (
                  <p className="nlh-no-reviews">No reviews yet. Be the first to review!</p>
                ) : (
                  reviews.map((review) => (
                    <div key={review.review_id} className="nlh-review-card">
                      <div className="nlh-review-header">
                        <span className="nlh-reviewer-name">{review.name}</span>
                        <StarRating rating={review.rating} />
                        <span className="nlh-review-date">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="nlh-review-comment">{review.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        </>
          )}
      </div> 


      <div className="nlh-new-arrivals-wrapper">
        <NewArrivals />
      </div>
      <FeatureSection />
      <Footer />
    </>
  );
};

export default ProductDisplay;