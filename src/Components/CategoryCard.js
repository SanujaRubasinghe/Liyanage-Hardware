// CategoryCard.js
import React from 'react';
import { useCategoryViewTracker } from '../hooks/useCategoryViewTracker';
import styles from './MainCategories.module.css';
import { getImageUrl } from '../utils/imageUrl';

const CategoryCard = ({ cat, onClick }) => {
  const viewRef = useCategoryViewTracker(cat?.category_id);
  
  return (
    <div
      ref={viewRef}
      className={styles.miniCategoryCard}
      onClick={onClick}
    >
      <img
        src={getImageUrl(cat?.thumbnail)}
        alt={cat?.name || 'Category'}
        className={styles.miniCategoryImage}
        onError={(e) => { e.target.src = '/images/Sample.jpg'; }}
      />
      <div className={styles.miniCategoryTag}>{cat?.name}</div>
    </div>
  );
};

export default CategoryCard;
