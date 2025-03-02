import React from "react";
import "./Subcategories.css"; 
import Footer from "./Footer"

const Subcategories = () => {
  
  const subcategories = [
    { name: "Category 1", image: "/images/sample.jpg" },
    { name: "Category 2", image: "/images/sample.jpg" },
    { name: "Category 3", image: "/images/sample.jpg" },
    { name: "Category 4", image: "/images/ball_lock.webp" },
    { name: "Category 5", image: "/images/sample.jpg" },
    { name: "Category 6", image: "/images/sample.jpg" },
    { name: "Category 7", image: "/images/sample.jpg" },
    { name: "Category 8", image: "/images/sample.jpg" },
    { name: "Category 9", image: "/images/sample.jpg" },
    { name: "Category 10", image: "/images/sample.jpg" },
  ];

  return (
    <div>
      <div className="subcategory-container">
      {subcategories.map((subcategory, index) => (
        <div key={index} className="subcategory-card">
          <img
            src={subcategory.image}
            alt={subcategory.name}
            className="subcategory-image"
          />
          <div className="subcategory-tag">{subcategory.name}</div>
        </div>
      ))}
    </div>

    <div>
      <Footer/>
    </div>
    
    </div>
  );
};

export default Subcategories;
