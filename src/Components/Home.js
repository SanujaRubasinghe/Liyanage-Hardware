'use client';
import React, { useEffect, useState } from 'react';
import { useNavigate } from '../router-compat';
import { trackClick } from '../services/categoryAnalytics';
import CategoryCard from './CategoryCard';
import { toast } from 'react-toastify';
import API from '../api';
import { useTrackVisit } from '../hooks/useTrackVisit';

function Home() {
  useTrackVisit(window.location.pathname)
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
    const identifier = cat.slug || cat.category_id;
    navigate(`/categories/${identifier}`, {
      state: {
        primary_cat_id: cat.category_id,
        slug: identifier,
        name: cat.name
      }
    });
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-10 mb-8">
      {/* Section header styled precisely like the screenshot */}
      <div className="text-center mb-8">
        <h2 className="text-[28px] text-[#4d4f53] font-normal tracking-wide">
          Shop by Category
        </h2>
      </div>
      
      {/* 5-column grid on desktop, scrollable on mobile */}
      <div className="flex overflow-x-auto lg:grid lg:grid-cols-5 gap-4 lg:gap-5 pb-4 lg:pb-0 snap-x snap-mandatory lg:snap-none category-scroll-container">
        <style>{`.category-scroll-container::-webkit-scrollbar { display: none; } .category-scroll-container { scrollbar-width: none; -ms-overflow-style: none; }`}</style>
        {mainCategories.map((cat, index) => (
          <div key={index} className="flex-none w-[70vw] sm:w-[40vw] md:w-[30vw] lg:w-auto snap-start lg:flex-auto">
            <CategoryCard
              cat={cat}
              onClick={() => handleCategoryClick(cat)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
