import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../api";
import "./MiniCategory.css";

const MiniCategory = () => {
  const location = useLocation()
  const navigate = useNavigate();

  const {secondary_cat_id, name, slug} = location.state || {}
  const [miniCategories, setMiniCategories] = useState([])

  useEffect(() => {
    const fetchTertiaryCategories = async () => {
      try {
        const response = await API.get(`/categories/tertiary?secondary_id=${secondary_cat_id}`)
        if (response.data.categories.length === 0) {
          navigate(`/category/${slug}/products`, {
            state: {
              cat_id: secondary_cat_id,
              name: name
            }
          })
        }
        setMiniCategories(response.data.categories)
      } catch (error) {
        toast.error('Failed to fetch categories')
      }
    }
    fetchTertiaryCategories()
  }, secondary_cat_id)

  return (
    <div className="miniCategory-main">
      <div className="miniCategory-header">
        <img
          src="/images/category/bathware/16.jpg"
          alt="Architectural Hardware"
          className="miniCategory-header-image"
        />
        <h1>{name}</h1> {/* Display selected category */}
        <p>
          {} {/* take description from the secondary cat as a state variable */}
        </p>
      </div>

      <div className="miniCategory-container">
        {miniCategories.map((miniCategory, index) => (
          <div
            key={index}
            className="miniCategory-card"
            onClick={() => navigate(`/category/${miniCategory.slug}/products`, {
              state: {
                cat_id: miniCategory.category_id,
                name: miniCategory.name,
              }
            })} /* navigate to products page */
          >
            <img
              src={`${process.env.REACT_APP_API_BASE_URL}${miniCategory.thumbnail}`}
              alt={miniCategory.name}
              className="miniCategory-image"
            />
            <div className="miniCategory-tag">{miniCategory.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MiniCategory;
