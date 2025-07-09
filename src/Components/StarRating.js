import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const StarRating = ({ rating, editable = false, onRatingChange }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const handleClick = (newRating) => {
    if (editable && onRatingChange) {
      onRatingChange(newRating);
    }
  };

  return (
    <div className="nlh-star-rating">
      {[...Array(fullStars)].map((_, i) => (
        <span 
          key={`full-${i}`} 
          className={editable ? 'editable' : ''}
          onClick={() => editable && handleClick(i + 1)}
        >
          <FaStar className="nlh-star nlh-full-star" />
        </span>
      ))}
      {hasHalfStar && (
        <span 
          key="half" 
          className={editable ? 'editable' : ''}
          onClick={() => editable && handleClick(fullStars + 0.5)}
        >
          <FaStarHalfAlt className="nlh-star nlh-half-star" />
        </span>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <span 
          key={`empty-${i}`} 
          className={editable ? 'editable' : ''}
          onClick={() => editable && handleClick(fullStars + (hasHalfStar ? 1 : 0) + i + 1)}
        >
          <FaRegStar className="nlh-star nlh-empty-star" />
        </span>
      ))}
      {editable && <span className="nlh-rating-value">{rating.toFixed(1)}</span>}
    </div>
  );
};

export default StarRating;