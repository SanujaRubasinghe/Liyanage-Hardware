import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import ConfirmationModal from './ConfirmationModal';
import API from "../api";
import './Feedback.css';

const Feedback = () => {
  const { user } = useAuthContext();

  // Initialize formData with safe default for userName
  const [formData, setFormData] = useState({
    rating: "",
    profilePicture: 'test.jpg',
    comment: "",
    userName: user ? user.username || "" : ""  // safer access
  });

  const [feedbackList, setFeedbackList] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // Update formData userName if user changes after initial load
  useEffect(() => {
    if(user) {
      setFormData(prev => ({ ...prev, userName: user.username || "" }));
    }
  }, [user]);

  const handleFeedbackChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFeedback(value);
  };

  const handleRatingChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setRating(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/feedback/create-review", formData);
      if (res.status === 201) {
        setShowModal(true);
        setModalMessage(res.data.message);
        // Reset form
        setFeedback('');
        setRating('');
        setFormData(prev => ({
          ...prev,
          rating: "",
          comment: ""
        }));
      }
    } catch (err) {
      console.error("Error adding new review: ", err);
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

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await API.get("/feedback/get-all-reviews");
        setFeedbackList(data);
      } catch (err) {
        console.error("Error fetching reviews: ", err);
      }
    };
    fetchReviews();
  }, [showModal]); // Refresh list after modal closes (new review added)

  return (
    <div className="feedback-container">
      <h2>Share Your Feedback</h2>

      <form className="feedback-form" onSubmit={handleSubmit}>
        <label htmlFor="rating"></label>
        <select
          id="rating"
          name="rating"
          className="rating-select"
          value={rating}
          onChange={handleRatingChange}
          required
        >
          <option value=''>Select Rating</option>
          <option value="1">1 Star</option>
          <option value="2">2 Stars</option>
          <option value="3">3 Stars</option>
          <option value="4">4 Stars</option>
          <option value="5">5 Stars</option>
        </select>

        <textarea
          className="feedback-input"
          name="comment"
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
          {(feedbackList || []).map((item, index) => (
            <div className="feedback-card" key={index}>
              <div className="card-header">
                <img
                  src={item.profile_picture_url || 'default-profile.jpg'}
                  alt={item.user_name || 'User'}
                  className="profile-photo"
                />
                <div className="user-info">
                  <h4>{item.user_name || 'Anonymous'}</h4>
                  <div className="rating">{renderStars(item.rating)}</div>
                </div>
              </div>
              <p className="card-comment">{item.comment}</p>
              <span className="feedback-date">{new Date(item.created_at).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      <ConfirmationModal
        isOpen={showModal}
        message={modalMessage}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};

export default Feedback;
