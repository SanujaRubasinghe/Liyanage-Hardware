// SubcategoryCard.js
import React from "react";
import { useCategoryViewTracker } from "../hooks/useCategoryViewTracker";

const SubcategoryCard = ({ subcategory, onClick }) => {
  const viewRef = useCategoryViewTracker(subcategory.category_id);

  return (
    <div
      ref={viewRef}
      className="subcategory-card"
      onClick={onClick}
    >
      <img
        src={`${process.env.REACT_APP_API_BASE_URL}${subcategory.thumbnail}`}
        alt={subcategory.name}
        className="subcategory-image"
      />
      <div className="subcategory-tag">{subcategory.name}</div>
    </div>
  );
};

export default SubcategoryCard;
