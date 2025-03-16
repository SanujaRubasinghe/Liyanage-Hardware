import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./MiniCategory.css";

const MiniCategory = () => {
  const { subcategory } = useParams(); // Get subcategory from URL
  const navigate = useNavigate();

  const miniCategories = [
    { name: "Ball Locks", image: "/images/sample.jpg", path: "/ball-locks" },
    { name: "Digital Locks", image: "/images/sample.jpg", path: "/digital-locks" },
    { name: "Door Accessories", image: "/images/sample.jpg", path: "/door-accessories" },
    { name: "Door Closers", image: "/images/sample.jpg", path: "/door-closers" },
    { name: "Door Cylinders", image: "/images/sample.jpg", path: "/door-cylinders" },
    { name: "Door Hinges", image: "/images/sample.jpg", path: "/door-hinges" },
    { name: "Door Knobs", image: "/images/sample.jpg", path: "/door-knobs" },
    { name: "Door Seals", image: "/images/sample.jpg", path: "/door-seals" },
  ];

  // Safely handle subcategory for replace
  const formattedSubcategory = subcategory ? subcategory.replace("-", " ") : "Category not found";

  return (
    <div className="miniCategory-main">
      <div className="miniCategory-header">
        <img
          src="/images/sample.jpg"
          alt="Architectural Hardware"
          className="miniCategory-header-image"
        />
        <h1>{formattedSubcategory}</h1> {/* Display selected category */}
        <p>
          Find everything you need for your doors and windows, from locks (digital & traditional) and hinges to handles, stoppers, and signage. 
          Explore sliding & folding systems, smart locks, and more.
        </p>
      </div>

      <div className="miniCategory-container">
        {miniCategories.map((miniCategory, index) => (
          <div
            key={index}
            className="miniCategory-card"
            onClick={() => navigate(miniCategory.path)}
          >
            <img
              src={miniCategory.image}
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
