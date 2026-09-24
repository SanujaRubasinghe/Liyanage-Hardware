'use client';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from '../router-compat';
import { toast } from 'react-toastify';
import API from '../api';
import { getImageUrl } from '../utils/imageUrl';
import './MiniCategory.css';
import { useCategoryViewTracker } from '../hooks/useCategoryViewTracker';
import { trackClick } from '../services/categoryAnalytics';
import ProductCard from './ProductCard';

const findCategory = (categories, identifier) => categories.find(
  (category) => String(category.category_id) === String(identifier) || category.slug === identifier
);

const MiniCategoryCard = ({ miniCategory, onClick }) => {
  const viewRef = useCategoryViewTracker(miniCategory.category_id);
  return (
    <div ref={viewRef} className="miniCategory-card" onClick={onClick}>
      <img
        src={getImageUrl(miniCategory.thumbnail)}
        alt={miniCategory.name}
        className="miniCategory-image"
        onError={(event) => { event.currentTarget.src = '/images/Sample.jpg'; }}
      />
      <div className="miniCategory-tag">{miniCategory.name}</div>
    </div>
  );
};

const MiniCategory = () => {
  const navigate = useNavigate();
  const { id, subcat } = useParams();
  const [category, setCategory] = useState(null);
  const [miniCategories, setMiniCategories] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const primaryResponse = await API.get('/categories/primary');
        const primary = findCategory(primaryResponse.data.categories || [], id);
        if (!primary) throw new Error('Primary category not found');

        const secondaryResponse = await API.get(`/categories/secondary?primary_id=${primary.category_id}`);
        const secondary = findCategory(secondaryResponse.data.categories || [], subcat);
        if (!secondary) throw new Error('Secondary category not found');

        setCategory(secondary);
        const [tertiaryResponse, productResponse] = await Promise.all([
          API.get(`/categories/tertiary?secondary_id=${secondary.category_id}`),
          API.get(`/products?categoryId=${secondary.category_id}`),
        ]);
        const tertiary = tertiaryResponse.data.categories || [];
        if (tertiary.length === 0) {
          navigate(`/category/${secondary.category_id}/products`, { replace: true });
          return;
        }
        setMiniCategories(tertiary);
        setProducts(productResponse.data || []);
      } catch {
        toast.error('Failed to fetch categories');
      }
    };
    fetchCategory();
  }, [id, subcat, navigate]);

  return (
    <div className="miniCategory-main">
      <div className="miniCategory-header">
        <img src="/images/category/bathware/16.jpg" alt="Product category" className="miniCategory-header-image" />
        <h1>{category?.name || 'Product Subcategories'}</h1>
        <p>{category?.description || 'Browse products and subcategories.'}</p>
      </div>
      <div className="miniCategory-container">
        {miniCategories.map((miniCategory) => (
          <MiniCategoryCard
            key={miniCategory.category_id}
            miniCategory={miniCategory}
            onClick={() => {
              trackClick(miniCategory.category_id);
              navigate(`/category/${miniCategory.category_id}/products`);
            }}
          />
        ))}
      </div>
      <div className="miniCategory-container">
        {products.map((product) => <ProductCard key={product.product_id} product={product} />)}
      </div>
    </div>
  );
};

export default MiniCategory;
