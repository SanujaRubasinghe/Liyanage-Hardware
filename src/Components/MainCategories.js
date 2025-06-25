import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api";
import { toast } from "react-toastify";
import styles from "./MainCategories.module.css";

const MainCategoies = () => {
  const { subcategory } = useParams();
  const [mainCategories, setMainCategories] = useState([])
  const navigate = useNavigate();

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
          Bathware includes a wide range of essential and stylish products designed for modern bathrooms — from sanitaryware and faucets to showers, bathtubs, and accessories. Whether you're upgrading your space or building new, our bathware collection combines functionality, comfort, and design.
        </p>
      </div>

      <div className={styles.miniCategoryContainer}>
        {mainCategories.map((cat, index) => (
          <div
            key={index}
            className={styles.miniCategoryCard}
            onClick={() => navigate(`/categories/${cat.slug}`, {
                state: {
                    primary_cat_id: cat.category_id,
                    slug: cat.slug,
                    name: cat.name
                }
            })}
          >
            <img
              src={`${process.env.REACT_APP_API_BASE_URL}${cat.thumbnail}`}
              alt={cat.name}
              className={styles.miniCategoryImage}
            />
            <div className={styles.miniCategoryTag}>{cat.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainCategoies;
