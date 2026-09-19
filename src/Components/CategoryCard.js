// CategoryCard.js
import React from 'react';
import { useCategoryViewTracker } from '../hooks/useCategoryViewTracker';
import { getImageUrl } from '../utils/imageUrl';

// Map slugs to our new local images
const categoryImages = {
  'building-materials': '/images/categories/building_materials.jpg',
  'tools-hardware': '/images/categories/tools_hardware.jpg',
  'paint-supplies': '/images/categories/paint_supplies.jpg',
  'electrical': '/images/categories/electrical.jpg',
  'plumbing': '/images/categories/plumbing.jpg',
  'roofing-timber': '/images/categories/roofing_timber.jpg',
  'safety-ppe': '/images/categories/safety_ppe.jpg'
};

const CategoryCard = ({ cat, onClick }) => {
  const viewRef = useCategoryViewTracker(cat?.category_id);
  
  // Use our local image if available, else fallback to API thumbnail
  const imageSrc = categoryImages[cat?.slug] || getImageUrl(cat?.thumbnail) || '/images/Sample.jpg';
  
  return (
    <div
      ref={viewRef}
      onClick={onClick}
      className="group relative cursor-pointer overflow-hidden rounded-[4px] bg-gray-200 aspect-[3/4] shadow-md hover:shadow-xl transition-all duration-300 w-full border border-gray-200"
    >
      {/* Background Image */}
      <img
        src={imageSrc}
        alt={cat?.name || 'Category'}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        onError={(e) => { e.target.src = '/images/Sample.jpg'; }}
      />
      
      {/* Gradient Overlay for text readability (matches the dark bottom in the screenshot) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 p-5 flex flex-col justify-end text-left">
        <h3 className="text-white font-bold text-lg leading-tight mb-2 drop-shadow-md">
          {cat?.name}
        </h3>
        {cat?.description && (
          <p className="text-gray-200 text-xs sm:text-sm line-clamp-3 leading-snug drop-shadow-sm opacity-90 group-hover:opacity-100 transition-opacity">
            {cat.description}
          </p>
        )}
      </div>
    </div>
  );
};

export default CategoryCard;
