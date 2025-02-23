import React from "react";
import "./Subcategories.css"; 
import Footer from "./Footer"

const Subcategories = () => {
  
  const subcategories = [
    { name: "BALL", image: "/images/sample.jpg" },
    { name: "DIGITAL", image: "/images/sample.jpg" },
    { name: "DOOR", image: "/images/sample.jpg" },
    { name: "LOCKS", image: "/images/ball_lock.webp" },
    { name: "ACCESSORIES", image: "/images/sample.jpg" },
    { name: "CLOSERS", image: "/images/sample.jpg" },
    { name: "CYLINDERS", image: "/images/sample.jpg" },
    { name: "HINGES", image: "/images/sample.jpg" },
    { name: "KNOBS", image: "/images/sample.jpg" },
    { name: "DOOR SEALS", image: "/images/sample.jpg" },
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
