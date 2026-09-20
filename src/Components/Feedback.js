'use client';
import React, { useState, useEffect, useCallback } from 'react';
import './Feedback.css';
import API from '../api';


const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 6,
    total: 0,
    pages: 1
  });

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const response = await API.get('/feedback/reviews/analytics');
      if (response.status === 200) {
        setAnalytics(response.data);
      } else {
        throw new Error(response.data.message || 'Failed to fetch analytics');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchReviews = useCallback(async () => {
    try {
      setReviewsLoading(true);
      const response = await API.get(`/feedback/reviews?page=${pagination.page}&limit=${pagination.limit}`);
      setReviews(response.data.reviews);
      setPagination(prev => ({
        ...prev,
        total: response.data.total,
        pages: response.data.pages
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setReviewsLoading(false);
    }
  }, [pagination.page, pagination.limit]);

  useEffect(() => {
    fetchAnalytics();
    fetchReviews();
  }, [fetchAnalytics, fetchReviews]);

  const resetForm = () => {
    setRating(0);
    setHover(0);
    setTitle('');
    setContent('');
    setError('');
    setSubmitted(false)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title || !content || rating === 0) {
      setError('Please fill all fields and provide a rating');
      return;
    }

    try {
      setLoading(true);
      const response = await API.post('/feedback/feedbacks', {
        type: 'review',
        title,
        content,
        rating,
      });

      setSubmitted(true);
      fetchAnalytics();
      fetchReviews(); // Refresh reviews after submission

      if (response.status !== 201) {
        throw new Error(response.data.message || 'Failed to submit feedback');
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };



  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  if (loading && !analytics) {
    return (
      <div className="feedback-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <>
    <div className="feedback-container">
      <div className="feedback-wrapper">
        <h1 className="feedback-title">Share Your Feedback</h1>
        
        {!submitted ? (
          <form onSubmit={handleSubmit} className="feedback-form">
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a title for your review"
              />
            </div>
            
            <div className="form-group">
              <label>Your Rating</label>
              <div className="star-rating">
                {[...Array(5)].map((star, index) => {
                  index += 1;
                  return (
                    <button
                      type="button"
                      key={index}
                      className={index <= (hover || rating) ? "star on" : "star off"}
                      onClick={() => setRating(index)}
                      onMouseEnter={() => setHover(index)}
                      onMouseLeave={() => setHover(rating)}
                    >
                      <span className="star-icon">★</span>
                    </button>
                  );
                })}
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="content">Your Review</label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your experience..."
                rows="5"
              ></textarea>
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        ) : (
          <div className="submission-success">
            <div className="success-icon">✓</div>
            <h2>Thank You for Your Feedback!</h2>
            <p>Your review has been submitted successfully.</p>
            <button onClick={resetForm} className="submit-button">
              Submit Another Review
            </button>
          </div>
        )}
        
        {analytics && (
          <div className="analytics-section">
            <h2>Review Analytics</h2>
            <div className="analytics-grid">
              <div className="analytics-card">
                <h3>Average Rating</h3>
                <div className="rating-display">
                  <span className="average-rating">{Number(analytics.averageRating).toFixed(1)}</span>
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`star ${i < Math.round(Number(analytics.averageRating)) ? 'filled' : ''}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="analytics-card">
                <h3>Total Reviews</h3>
                <div className="big-number">{analytics.totalReviews}</div>
              </div>
              
              <div className="analytics-card">
                <h3>Rating Distribution</h3>
                <div className="distribution-bars">
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const total = Number(analytics.totalReviews);
                    const count = Number(analytics.ratingDistribution[stars] || 0);
                    const percentage = total === 0 ? 0 : (count / total) * 100;

                    return (
                      <div key={stars} className="distribution-row">
                        <span className="stars-label">{stars}★</span>
                        <div className="bar-container">
                          <div
                            className="bar"
                            style={{
                              width: `${percentage}%`
                            }}
                          ></div>
                        </div>
                        <span className="percentage">
                          {Math.round(percentage)}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            <div className="reviews-section">
              <h3>Customer Reviews</h3>
              {reviewsLoading ? (
                <div className="loading-spinner small"></div>
              ) : (
                <>
                  <div className="reviews-grid">
                    {reviews.map((review) => (
                      <div key={review.id} className="review-card">
                        <div className="review-header">
                          <div className="review-rating">
                            {Array(review.rating).fill('★').join('')}
                          </div>
                          <div className="review-date">
                            {new Date(review.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <h4 className="review-title">{review.title}</h4>
                        <p className="review-content">{review.content}</p>
                      </div>
                    ))}
                  </div>
                  
                  {pagination.pages > 1 && (
                    <div className="pagination">
                      <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className="pagination-button"
                      >
                        Previous
                      </button>
                      
                      {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                        let pageNum;
                        if (pagination.pages <= 5) {
                          pageNum = i + 1;
                        } else if (pagination.page <= 3) {
                          pageNum = i + 1;
                        } else if (pagination.page >= pagination.pages - 2) {
                          pageNum = pagination.pages - 4 + i;
                        } else {
                          pageNum = pagination.page - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`pagination-button ${pagination.page === pageNum ? 'active' : ''}`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === pagination.pages}
                        className="pagination-button"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default Feedback;
