'use client';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from '../router-compat';
import { toast } from 'react-toastify';
import API from '../api';
import './Subcategories.css';
import SubcategoryCard from './SubcategoryCard';
import { trackClick } from '../services/categoryAnalytics';

const findCategory = (categories, identifier) => categories.find(
  (category) => String(category.category_id) === String(identifier) || category.slug === identifier
);

const Subcategories = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [subcategories, setSubCategories] = useState([]);

  useEffect(() => {
    const fetchSecondaryCategories = async () => {
      try {
        const primaryResponse = await API.get('/categories/primary');
        const primary = findCategory(primaryResponse.data.categories || [], id);
        if (!primary) throw new Error('Primary category not found');

        setCategory(primary);
        const response = await API.get(`/categories/secondary?primary_id=${primary.category_id}`);
        const secondary = response.data.categories || [];
        if (secondary.length === 0) {
          navigate(`/category/${primary.category_id}/products`, { replace: true });
          return;
        }
        setSubCategories(secondary);
      } catch {
        toast.error('Failed to get categories');
      }
    };
    fetchSecondaryCategories();
  }, [id, navigate]);

  return (
    <div className="main">
      <div className="subcategory-header">
        <img src="/images/category/bathware/16.jpg" alt="Product category" className="subcategory-header-image" />
        <h1>{category?.name || 'Product Subcategories'}</h1>
        <p>{category?.description || 'Browse product types within this category.'}</p>
      </div>
      <div className="subcategory-container">
        {subcategories.map((subcategory) => (
          <SubcategoryCard
            key={subcategory.category_id}
            subcategory={subcategory}
            onClick={() => {
              trackClick(subcategory.category_id);
              navigate(`/categories/${id}/${subcategory.slug || subcategory.category_id}`);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Subcategories;
