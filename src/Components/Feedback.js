import React, { useState } from 'react';
import './Feedback.css';

const Feedback = () => {
  // Updated initial feedback with additional fields: avatar, rating, comment, and date.
  const [feedbackList, setFeedbackList] = useState([
    { 
      username: 'AlexD', 
      avatar: 'https://i.pravatar.cc/50?img=1',
      rating: 5,
      comment: 'Amazing quality and fast shipping. Love the product!', 
      date: 'Mar 10, 2025'
    },
    { 
      username: 'MariaS', 
      avatar: 'https://i.pravatar.cc/50?img=2',
      rating: 4,
      comment: 'Great customer service and excellent packaging.', 
      date: 'Mar 09, 2025'
    },
    { 
      username: 'JohnK', 
      avatar: 'https://i.pravatar.cc/50?img=3',
      rating: 5,
      comment: 'Product as described. Highly recommend this store.', 
      date: 'Mar 08, 2025'
    },
    { 
      username: 'SophieW', 
      avatar: 'https://i.pravatar.cc/50?img=4',
      rating: 5,
      comment: 'Received my order quickly and the quality is top-notch.', 
      date: 'Mar 07, 2025'
    },
    { 
      username: 'MichaelB', 
      avatar: 'https://i.pravatar.cc/50?img=5',
      rating: 4,
      comment: 'Affordable prices and superb quality. I will definitely buy again.', 
      date: 'Mar 06, 2025'
    },
    { 
      username: 'NinaP', 
      avatar: 'https://i.pravatar.cc/50?img=6',
      rating: 5,
      comment: 'The online shopping experience was seamless and secure.', 
      date: 'Mar 05, 2025'
    },
    { 
      username: 'ChrisL', 
      avatar: 'https://i.pravatar.cc/50?img=7',
      rating: 4,
      comment: 'Exceeded my expectations. Very impressed with the service.', 
      date: 'Mar 04, 2025'
    },
    { 
      username: 'LaraG', 
      avatar: 'https://i.pravatar.cc/50?img=8',
      rating: 5,
      comment: 'Fast delivery and the product quality is exceptional.', 
      date: 'Mar 03, 2025'
    },
    { 
      username: 'DanielR', 
      avatar: 'https://i.pravatar.cc/50?img=9',
      rating: 3,
      comment: 'I had a minor issue but the support team resolved it quickly.', 
      date: 'Mar 02, 2025'
    },
    { 
      username: 'EmmaJ', 
      avatar: 'https://i.pravatar.cc/50?img=10',
      rating: 5,
      comment: 'Absolutely satisfied with my purchase. Five stars!', 
      date: 'Mar 01, 2025'
    },
  ]);
  
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(5);

  const handleFeedbackChange = (event) => {
    setFeedback(event.target.value);
  };

  const handleRatingChange = (event) => {
    setRating(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (feedback.trim()) {
      const newUser = `User${feedbackList.length + 1}`;
      const newFeedback = {
        username: newUser,
        avatar: `https://i.pravatar.cc/50?u=${newUser}`,
        rating: parseInt(rating, 10),
        comment: feedback,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      };
      setFeedbackList([...feedbackList, newFeedback]);
      setFeedback('');
      setRating(5);
    }
  };

  // Helper function to render star icons based on rating
  const renderStars = (rating) => {
    let stars = [];
    for (let i = 0; i < rating; i++) {
      stars.push(<span key={i} className="star">⭐</span>);
    }
    return stars;
  };

  return (
    <div className="feedback-container">
      <h2>Share Your Feedback</h2>
      
      <form className="feedback-form" onSubmit={handleSubmit}>
        <label htmlFor="rating">Rating:</label>
        <select 
          id="rating" 
          className="rating-select"
          value={rating} 
          onChange={handleRatingChange}
          required
        >
          <option value="1">1 Star</option>
          <option value="2">2 Stars</option>
          <option value="3">3 Stars</option>
          <option value="4">4 Stars</option>
          <option value="5">5 Stars</option>
        </select>

        <textarea
          className="feedback-input"
          placeholder="Enter your comment..."
          value={feedback}
          onChange={handleFeedbackChange}
          required
        />
        <button type="submit" className="submit-btn">Submit Feedback</button>
      </form>

      <div className="feedback-list">
        <h3>User Reviews</h3>
        <div className="feedback-grid">
          {feedbackList.map((item, index) => (
            <div className="feedback-card" key={index}>
              <div className="card-header">
                <img src={item.avatar} alt={item.username} className="profile-photo"/>
                <div className="user-info">
                  <h4>{item.username}</h4>
                  <div className="rating">{renderStars(item.rating)}</div>
                </div>
              </div>
              <p className="card-comment">{item.comment}</p>
              <span className="feedback-date">{item.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Feedback;
