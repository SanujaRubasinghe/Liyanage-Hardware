import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { toast } from "react-toastify";
import { trackClick } from "../services/categoryAnalytics";
import styles from "./MainCategories.module.css";
import CategoryCard from "./CategoryCard"; // Import the new component

const MainCategoies = () => {
  const [mainCategories, setMainCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPrimaryCategories = async () => {
      try {
        const response = await API.get('/categories/primary');
        setMainCategories(response.data.categories);
      } catch (error) {
        toast.error('Failed to get categories');
      }
    };
    fetchPrimaryCategories();
  }, []);

  const handleCategoryClick = (cat) => {
    trackClick(cat.category_id);
    navigate(`/categories/${cat.slug}`, {
      state: {
        primary_cat_id: cat.category_id,
        slug: cat.slug,
        name: cat.name
      }
    });
  };

  return (
    <div className={styles.miniCategoryMain}>
      <div className={styles.miniCategoryHeader}>
        <img
          src="/images/category/bathware/16.jpg"
          alt="Architectural Hardware"
          className={styles.miniCategoryHeaderImage}
        />
        <h1>{}</h1>
        <p>
          Bathware includes a wide range of essential and stylish products designed for modern bathrooms...
        </p>
      </div>

      <div className={styles.miniCategoryContainer}>
        {mainCategories.map((cat, index) => (
          <CategoryCard
            key={index}
            cat={cat}
            onClick={() => handleCategoryClick(cat)}
          />
        ))}
      </div>
    </div>
  );
};

export default MainCategoies;
