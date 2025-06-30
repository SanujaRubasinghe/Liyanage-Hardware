import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../api";
import "./Subcategories.css";
import Footer from "./Footer";
import SubcategoryCard from "./SubcategoryCard";
import { trackClick } from "../services/categoryAnalytics";

import { Helmet } from "react-helmet";


const Subcategories = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { primary_cat_id, slug, name } = location.state || {};
  const [subcategories, setSubCategories] = useState([]);

  useEffect(() => {
    const fetchSecondaryCategories = async () => {
      try {
        const response = await API.get(`/categories/secondary?primary_id=${primary_cat_id}`);
        if (response.data.categories.length === 0) {
          navigate(`/category/${slug}/products`, {
            state: {
              cat_id: primary_cat_id,
              name: name
            }
          });
        }
        setSubCategories(response.data.categories);
      } catch (error) {
        toast.error('Failed to get categories');
      }
    };
    fetchSecondaryCategories();
  }, [primary_cat_id, navigate, slug, name]);

  const handleSubcategoryClick = (path, cat_id, cat_name, slug) => {
    navigate(`${path}`, {
      state: {
        secondary_cat_id: cat_id,
        name: cat_name,
        slug: slug
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
    <div>
      <div className="subcategory-header">
        <img
          src="/images/category/bathware/16.jpg"
          alt="Architectural Hardware"
          className="subcategory-header-image"
        />
        <h1>{}</h1>
        <p>
          Bathware includes a wide range of essential and stylish products designed for modern bathrooms...
        </p>
      </div>
      <div className="subcategory-container">
        {subcategories.map((subcategory, index) => (
          <SubcategoryCard
            key={subcategory.category_id}
            subcategory={subcategory}
            onClick={() => {
              trackClick(subcategory.category_id)
              handleSubcategoryClick(
                `/categories/${id}/${subcategory.slug}`,
                subcategory.category_id,
                subcategory.name,
                subcategory.slug
              )}
            }
          />
        ))}
      </div>
      <Footer />
    </div>
    </>
  );
};

export default Subcategories;
