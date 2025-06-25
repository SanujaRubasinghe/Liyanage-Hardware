// CategoryCard.js
import React from 'react';
import { useCategoryViewTracker } from '../hooks/useCategoryViewTracker';
import styles from './MainCategories.module.css';

const CategoryCard = ({ cat, onClick }) => {
  const viewRef = useCategoryViewTracker(cat.category_id);
  
  return (
    <div
      ref={viewRef}
      className={styles.miniCategoryCard}
      onClick={onClick}
    >
      <img
        src={`${process.env.REACT_APP_API_BASE_URL}${cat.thumbnail}`}
        alt={cat.name}
        className={styles.miniCategoryImage}
      />
      <div className={styles.miniCategoryTag}>{cat.name}</div>
    </div>
  );
};

export default CategoryCard;
