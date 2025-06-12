import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
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

      if (response.status !== 200) {
        throw new Error(response.data.message || 'Failed to submit feedback');
      }

      setSubmitted(true);
      fetchAnalytics(); // Refresh analytics after submission
      resetForm()
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setRating(0);
    setHover(0);
    setTitle('');
    setContent('');
    setSubmitted(false);
    setError('');
  };

  if (loading && !analytics) {
    return (
      <div className="feedback-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
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
                        className={`star ${i < Math.round(analytics.averageRating) ? 'filled' : ''}`}
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
                  {[5, 4, 3, 2, 1].map((stars) => (
                    <div key={stars} className="distribution-row">
                      <span className="stars-label">{stars}★</span>
                      <div className="bar-container">
                        <div
                          className="bar"
                          style={{
                            width: `${(analytics.ratingDistribution[stars] / analytics.totalReviews) * 100}%`
                          }}
                        ></div>
                      </div>
                      <span className="percentage">
                        {Math.round((analytics.ratingDistribution[stars] / analytics.totalReviews) * 100)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="analytics-card">
                <h3>Recent Reviews</h3>
                <ul className="recent-reviews">
                  {analytics.recentReviews.map((review, index) => (
                    <li key={index} className="review-item">
                      <div className="review-header">
                        <span className="review-rating">
                          {Array(review.rating).fill('★').join('')}
                        </span>
                        <span className="review-title">{review.title}</span>
                      </div>
                      <p className="review-content">{review.content.substring(0, 100)}...</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feedback;