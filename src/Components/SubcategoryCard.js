// SubcategoryCard.js
import React from "react";
import { useCategoryViewTracker } from "../hooks/useCategoryViewTracker";
import { getImageUrl } from "../utils/imageUrl";

const SubcategoryCard = ({ subcategory, onClick }) => {
  const viewRef = useCategoryViewTracker(subcategory?.category_id);

  return (
    <div
      ref={viewRef}
      className="subcategory-card"
      onClick={onClick}
    >
      <img
        src={getImageUrl(subcategory?.thumbnail)}
        alt={subcategory?.name || 'Subcategory'}
        className="subcategory-image"
        onError={(e) => { e.target.src = '/images/Sample.jpg'; }}
      />
      <div className="subcategory-tag">{subcategory?.name}</div>
    </div>
  );
};

export default SubcategoryCard;
