import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../api";
import "./MiniCategory.css";
import { useCategoryViewTracker } from "../hooks/useCategoryViewTracker"; 
import { trackClick } from "../services/categoryAnalytics";
import ProductCard from './ProductCard';
import { Helmet } from "react-helmet";

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
  const [products, setProducts] = useState([])

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

    const fetchSecondaryProducts = async () => {
      try {
        const response = await API.get(`/products?categoryId=${secondary_cat_id}`)
        setProducts(response.data)
        console.log(response.data)
      } catch (err) {
        toast.error('Failed to fetch products');
      }
    }
    
    if (secondary_cat_id) {
      fetchTertiaryCategories();
      fetchSecondaryProducts()
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
    <>
    <Helmet>
      <title>Product Subcategories | New Liyanage Hardware</title>
      <meta name="description" content="View subcategories and product types within our main categories." />
      <link rel="canonical" href="https://newliyanagehardware.lk/categories/:id" />
    </Helmet>
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
      <div className="miniCategory-container">
        {products.map((product, index) => (
          <ProductCard
            key={index}
            product={product}
          />
        ))}
      </div>
    </div>
    </>
  );
};

export default MiniCategory;
