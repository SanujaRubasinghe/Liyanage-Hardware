import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./MiniCategory.css";

const MiniCategory = () => {
  const { subcategory } = useParams(); // Get subcategory from URL
  const navigate = useNavigate();

  const miniCategories = [
    { name: "Hand Showers", image: "/images/category/bathware/1.jpg", path: "/ball-locks" },
    { name: "Sliding Shower Doors", image: "/images/category/bathware/12.jpg", path: "/digital-locks" },
    { name: "Plumbing Fittings", image: "/images/category/bathware/11.jpg", path: "/door-accessories" },
    { name: "Bathtubs & Jacuzzis", image: "/images/category/bathware/4.jpg", path: "/door-closers" },
    { name: "Bib Taps", image: "/images/category/bathware/5.jpg", path: "/door-cylinders" },
    { name: "Overhead Showers", image: "/images/category/bathware/13.jpg", path: "/door-hinges" },
    { name: "Jacuzzi Systems", image: "/images/category/bathware/7.jpg", path: "/door-knobs" },
    { name: "Sanitaryware", image: "/images/category/bathware/8.jpg", path: "/door-seals" },
  ];

  // Safely handle subcategory for replace
  const formattedSubcategory = subcategory ? subcategory.replace("-", " ") : "Category not found";

  return (
    <div className="miniCategory-main">
      <div className="miniCategory-header">
        <img
          src="/images/category/bathware/16.jpg"
          alt="Architectural Hardware"
          className="miniCategory-header-image"
        />
        <h1>{formattedSubcategory}</h1> {/* Display selected category */}
        <p>
          Bathware includes a wide range of essential and stylish products designed for modern bathrooms — from sanitaryware and faucets to showers, bathtubs, and accessories. Whether you're upgrading your space or building new, our bathware collection combines functionality, comfort, and design.
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
