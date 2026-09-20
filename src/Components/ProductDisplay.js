'use client';
import React, { useEffect, useState } from "react";
import { useCart } from "./CartContext";
import { useNavigate, useParams } from "../router-compat";
import API from "../api";
import { getImageUrl } from "../utils/imageUrl";
import NewArrivals from "./NewArrivals";
import FeatureSection from "./FeatureSection";
import SearchBarN from "./SearchBarN";
import LoadingPage from "./LoadingPage";
import { toast } from "react-toastify";
import { checkConsent } from "../services/checkConsent";
import StarRating from "./StarRating";
import CategorySections from "./CategorySections";

const ProductDisplay = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
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
    <div className="bg-gray-50 min-h-screen pb-12">
      <SearchBarN />
      
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-6 lg:mt-10">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-12">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 p-6 lg:p-10">
            
            {/* Left: Product Images */}
            <div className="flex flex-col-reverse lg:flex-row gap-4 lg:gap-6 mb-8 lg:mb-0">
              {/* Thumbnails */}
              <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto lg:w-24 shrink-0 pb-2 lg:pb-0" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <style>{`.flex::-webkit-scrollbar { display: none; }`}</style>
                {product.images?.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(image)}
                    className={`flex-none w-20 h-20 lg:w-24 lg:h-24 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                      selectedImage === image ? 'border-[#a34b4b] shadow-md' : 'border-gray-200 hover:border-gray-300 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={getImageUrl(image)}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="w-full h-full object-contain bg-gray-50"
                      loading="lazy"
                      onError={(e) => { e.target.src = '/images/Sample.jpg'; }}
                    />
                  </button>
                ))}
              </div>
              
              {/* Main Image */}
              <div className="flex-1 bg-gray-50 rounded-2xl overflow-hidden border border-gray-200 flex items-center justify-center aspect-square md:aspect-[4/3] lg:aspect-square relative">
                <img 
                  src={getImageUrl(selectedImage)} 
                  alt={product.name} 
                  className="w-full h-full object-contain p-4" 
                  loading="lazy"
                  onError={(e) => { e.target.src = '/images/Sample.jpg'; }}
                />
              </div>
            </div>

            {/* Right: Product Details */}
            <div className="flex flex-col">
              <div className="mb-2">
                 <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">{product.brand || 'Liyanage Hardware'}</p>
                 <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight leading-tight mb-3">
                   {product.name}
                 </h1>
                 <p className="text-sm text-gray-500 uppercase tracking-widest mb-4">SKU: {product.sku}</p>
              </div>

              <div className="flex items-center gap-2 mb-6">
                <StarRating rating={calculateAverageRating()} />
                <span className="text-sm font-medium text-gray-600">({reviews.length} reviews)</span>
              </div>

              <div className="mb-8">
                <div className="flex items-end gap-2 mb-1">
                  <span className="text-3xl font-extrabold text-[#333333]">
                    Rs {Number(product.price).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                  </span>
                  <span className="text-sm text-gray-400 font-medium tracking-wide uppercase mb-1">inc. VAT</span>
                </div>
                {product.unit && <p className="text-sm text-gray-500">Unit: {product.unit}</p>}
              </div>

              <div className="mb-8 border-t border-b border-gray-100 py-6">
                <div className="flex items-center gap-6">
                  <span className="text-gray-700 font-medium">Quantity</span>
                  <div className="flex items-center bg-gray-50 border border-gray-200 rounded-full h-10 w-32">
                    <button 
                      className="flex-1 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="flex-1 text-center font-semibold text-gray-900">{quantity}</span>
                    <button 
                      className="flex-1 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
                      onClick={() => setQuantity(quantity + 1)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-auto">
                {product.stock_quantity > 0 || product.stock_status === 'in_stock' ? (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button 
                      className="flex-1 bg-white border-2 border-gray-900 text-gray-900 py-3 px-6 rounded-full font-bold text-sm hover:bg-gray-900 hover:text-white transition-all duration-300 uppercase tracking-wide" 
                      onClick={handleAddToCart}
                    >
                      Add to Cart
                    </button>
                    <button 
                      className="flex-1 bg-[#a34b4b] border-2 border-[#a34b4b] text-white py-3 px-6 rounded-full font-bold text-sm hover:bg-[#8c3c3c] hover:border-[#8c3c3c] transition-all duration-300 uppercase tracking-wide shadow-sm hover:shadow" 
                      onClick={handleBuyNow}
                    >
                      Buy Now
                    </button>
                  </div>
                ) : (
                  <div className="w-full bg-red-50 text-red-600 text-center py-4 rounded-full font-bold text-sm uppercase tracking-wide border border-red-100">
                    Out of Stock
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Bottom Tabs: Description & Reviews */}
          <div className="border-t border-gray-200 bg-gray-50/50">
            <div className="flex border-b border-gray-200 px-6 lg:px-10">
              <button 
                className={`py-4 px-6 font-semibold text-sm transition-all duration-200 uppercase tracking-wider ${
                  activeTab === 'description' 
                    ? 'text-[#a34b4b] border-b-2 border-[#a34b4b]' 
                    : 'text-gray-500 hover:text-gray-800'
                }`}
                onClick={() => setActiveTab('description')}
              >
                Description
              </button>
              <button 
                className={`py-4 px-6 font-semibold text-sm transition-all duration-200 uppercase tracking-wider ${
                  activeTab === 'reviews' 
                    ? 'text-[#a34b4b] border-b-2 border-[#a34b4b]' 
                    : 'text-gray-500 hover:text-gray-800'
                }`}
                onClick={() => setActiveTab('reviews')}
              >
                Reviews ({reviews.length})
              </button>
            </div>

            <div className="p-6 lg:p-10 min-h-[300px]">
              {activeTab === 'description' ? (
                <div className="prose max-w-4xl text-gray-600 leading-relaxed">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Product Details</h3>
                  <div className="whitespace-pre-line">{product.description || 'No description available for this product.'}</div>
                </div>
              ) : (
                <div className="max-w-4xl grid md:grid-cols-2 gap-10">
                  {/* Write a Review */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Write a Review</h3>
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">Your Name</label>
                        <input
                          type="text"
                          id="name"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a34b4b] focus:border-[#a34b4b] transition-shadow outline-none"
                          value={newReview.name}
                          onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Your Rating</label>
                        <StarRating 
                          editable={true}
                          rating={newReview.rating}
                          onRatingChange={(rating) => setNewReview({...newReview, rating})}
                        />
                      </div>
                      <div>
                        <label htmlFor="comment" className="block text-sm font-semibold text-gray-700 mb-1">Your Review</label>
                        <textarea
                          id="comment"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a34b4b] focus:border-[#a34b4b] transition-shadow outline-none resize-y min-h-[120px]"
                          value={newReview.comment}
                          onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                          required
                        />
                      </div>
                      <button 
                        type="submit" 
                        className="bg-[#a34b4b] text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-[#8c3c3c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isSubmittingReview}
                      >
                        {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                      </button>
                    </form>
                  </div>

                  {/* Review List */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Customer Reviews</h3>
                    {isLoadingReviews ? (
                      <div className="text-gray-500 animate-pulse">Loading reviews...</div>
                    ) : reviews.length === 0 ? (
                      <div className="text-gray-500 bg-white p-6 rounded-xl border border-gray-100 text-center">
                        <p>No reviews yet.</p>
                        <p className="text-sm mt-1">Be the first to share your thoughts!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {reviews.map((review) => (
                          <div key={review.review_id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <span className="font-bold text-gray-900 block">{review.name}</span>
                                <StarRating rating={review.rating} />
                              </div>
                              <span className="text-xs text-gray-500 font-medium">
                                {new Date(review.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm mt-3 leading-relaxed">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Recommended Categories / Features */}
        <div className="mt-16">
          <CategorySections />
        </div>
        <div className="mt-8">
          <FeatureSection />
        </div>
      </div>
    </div>
  );
};

export default ProductDisplay;
