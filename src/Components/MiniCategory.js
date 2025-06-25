import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../api";
import "./MiniCategory.css";
import { useCategoryViewTracker } from "../hooks/useCategoryViewTracker"; // Import the hook
import { trackClick } from "../services/categoryAnalytics";

// Create a separate card component to use the hook properly
const MiniCategoryCard = ({ miniCategory, onClick }) => {
  const viewRef = useCategoryViewTracker(miniCategory.category_id);
  
  return (
    <div
      ref={viewRef}
      className="miniCategory-card"
      onClick={onClick}
    >
      <img
        src={`${process.env.REACT_APP_API_BASE_URL}${miniCategory.thumbnail}`}
        alt={miniCategory.name}
        className="miniCategory-image"
      />
      <div className="miniCategory-tag">{miniCategory.name}</div>
    </div>
  );
};

const MiniCategory = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { secondary_cat_id, name, slug, description = "" } = location.state || {};
  const [miniCategories, setMiniCategories] = useState([]);

  useEffect(() => {
    const fetchTertiaryCategories = async () => {
      try {
        const response = await API.get(`/categories/tertiary?secondary_id=${secondary_cat_id}`);
        if (response.data.categories.length === 0) {
          navigate(`/category/${slug}/products`, {
            state: {
              cat_id: secondary_cat_id,
              name: name
            }
          });
          return;
        }
        setMiniCategories(response.data.categories);
      } catch (error) {
        toast.error('Failed to fetch categories');
      }
    };
    
    if (secondary_cat_id) {
      fetchTertiaryCategories();
    }
  }, [secondary_cat_id, navigate, slug, name]);

  const handleCardClick = (miniCategory) => {
    trackClick(miniCategory.category_id)
    navigate(`/category/${miniCategory.slug}/products`, {
      state: {
        cat_id: miniCategory.category_id,
        name: miniCategory.name,
      }
    });
  };

  return (
    <div className="miniCategory-main">
      <div className="miniCategory-header">
        <img
          src="/images/category/bathware/16.jpg"
          alt="Architectural Hardware"
          className="miniCategory-header-image"
        />
        <h1>{name}</h1>
        <p>{description}</p>
      </div>

      <div className="miniCategory-container">
        {miniCategories.map((miniCategory) => (
          <MiniCategoryCard
            key={miniCategory.category_id}
            miniCategory={miniCategory}
            onClick={() => handleCardClick(miniCategory)}
          />
        ))}
      </div>
    </div>
  );
};

export default MiniCategory;
