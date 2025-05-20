import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./Subcategories.css";
import Footer from "./Footer";

const Subcategories = () => {
  const navigate = useNavigate();

  const subcategories = [
    { name: "Category 1", image: "/images/category/bathware/5.jpg", path: "category-1" },
    { name: "Category 2", image: "/images/category/bathware/5.jpg", path: "category-2" },
    { name: "Category 3", image: "/images/category/bathware/5.jpg", path: "category-3" },
    { name: "Category 4", image: "/images/category/bathware/5.jpg", path: "category-4" },
    { name: "Category 5", image: "/images/category/bathware/5.jpg", path: "category-5" },
    { name: "Category 6", image: "/images/category/bathware/5.jpg", path: "category-6" },
    { name: "Category 7", image: "/images/category/bathware/5.jpg", path: "category-7" },
    { name: "Category 8", image: "/images/category/bathware/5.jpg", path: "category-8" },
    { name: "Category 9", image: "/images/category/bathware/5.jpg", path: "category-9" },
    { name: "Category 10", image: "/images/category/bathware/5.jpg", path: "category-10" },
  ];

  const handleSubcategoryClick = (path) => {
    navigate(`/mini-category/${path}`);
  };

  return (
    <div>
      <div className="subcategory-container">
        {subcategories.map((subcategory, index) => (
          <div
            key={index}
            className="subcategory-card"
            onClick={() => handleSubcategoryClick(subcategory.path)}
          >
            <img
              src={subcategory.image}
              alt={subcategory.name}
              className="subcategory-image"
            />
            <div className="subcategory-tag">{subcategory.name}</div>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
};

export default Subcategories;
