import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { trackClick } from '../services/categoryAnalytics';
import './Home.css';
import './Product.css';
import CategoryCard from './CategoryCard';
import { toast } from 'react-toastify';
import API from '../api';
import useTrackPageVisit from '../hooks/useTrackPageVisit';

function Home() {
  // useTrackPageVisit()
  const [mainCategories, setMainCategories] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPrimaryCategories = async () => {
        try {
            const response = await API.get('/categories/primary')
            setMainCategories(response.data.categories)
        } catch (error) {
            toast.error('Failed to get categories')
        }
    }
    fetchPrimaryCategories()
  }, [])

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
    <div className="product-container">
      <h2>
        <span className="blue-text">Our</span>{' '}
        <span className="red-text">Categories</span>
      </h2>
      <div className="product-grid">
        {mainCategories.map((cat,index) => (
          <CategoryCard
            key={index}
            cat={cat}
            onClick={() => handleCategoryClick(cat)}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;
