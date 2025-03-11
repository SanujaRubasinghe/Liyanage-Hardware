import React, { useState } from 'react';
import './Feedback.css';

const Feedback = () => {
  const [feedback, setFeedback] = useState('');
  const [feedbackList, setFeedbackList] = useState([
    { username: 'User1', feedback: 'Great service! Highly recommend.' },
    { username: 'User2', feedback: 'The experience was amazing. Will come again.' },
    { username: 'User3', feedback: 'A very helpful platform with good support.' },
  ]);

  const handleFeedbackChange = (event) => {
    setFeedback(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (feedback) {
      // Add new feedback with a username (for example, User4)
      setFeedbackList([...feedbackList, { username: `User${feedbackList.length + 1}`, feedback }]);
      setFeedback(''); // Clear feedback input after submission
    }
  };

  return (
    <div className="feedback-container">
      <h2>Give Your Feedback</h2>
      
      <form onSubmit={handleSubmit} className="feedback-form">
        <textarea
          value={feedback}
          onChange={handleFeedbackChange}
          placeholder="Write your feedback here..."
          rows="5"
          className="feedback-input"
        />
        <button type="submit" className="submit-btn">Submit</button>
      </form>

      <div className="feedback-list">
        <h3>Other Feedbacks</h3>
        {feedbackList.length > 0 ? (
          <div className="feedback-cards">
            {feedbackList.map((item, index) => (
              <div key={index} className="feedback-card">
                <div className="feedback-card-header">
                  <h4>{item.username}</h4>
                </div>
                <p className="feedback-card-body">{item.feedback}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No feedback available.</p>
        )}
      </div>
    </div>
  );
};

export default Feedback;
