import React from "react";
import "./Subcategories.css"; 
import Footer from "./Footer"

const Subcategories = () => {
  
  const subcategories = [
    { name: "Item 1", image: "/images/sample.jpg" },
    { name: "Item 2", image: "/images/sample.jpg" },
    { name: "Item 3", image: "/images/sample.jpg" },
    { name: "Item 4", image: "/images/sample.jpg" },
    { name: "Item 5", image: "/images/sample.jpg" },
    { name: "Item 6", image: "/images/sample.jpg" },
    { name: "Item 7", image: "/images/sample.jpg" },
    { name: "Item 8", image: "/images/sample.jpg" },
    { name: "Item 9", image: "/images/sample.jpg" },
    { name: "Item 10", image: "/images/sample.jpg" },
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
