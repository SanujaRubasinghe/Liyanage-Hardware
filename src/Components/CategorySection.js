import React from "react";
import "./CategorySection.css";

const categories = [
  {
    title: "Architectural Hardware",
    description:
      "Find everything you need for your doors and windows, from locks (digital & traditional) and hinges to handles, stoppers, and signage. Explore sliding & folding systems, smart locks, and more. Shop now and create a secure and stylish entryway for every space!",
    image: "/images/sample.jpg",
  },
  {
    title: "Bathroom Fittings",
    description:
      "From stylish accessories to functional essentials like shower sets & grab bars, find everything to create your dream bathroom. Explore mirrors, racks, mats, dispensers, holders & more! Shop now and transform your bathroom into an oasis of comfort and style.",
    image: "/images/sample.jpg",
  },
  {
    title: "Decorative",
    description:
      "Craft your dream space with M.M. Noorbhoy & Co.'s decorative essentials. Find laminated sheets, boards, panels & more to elevate your furniture, walls & projects. Shop now and transform your space.",
    image: "/images/sample.jpg",
  },
  {
    title: "Furniture Hardware",
    description:
      "Enhance your home with M.M. Noorbhoy & Co.'s Furniture Hardware essentials. From bed lifts & wardrobes to cabinet fittings & more, find everything to transform your furniture & space. Shop Now!",
    image: "/images/sample.jpg",
  },
  {
    title: "Furniture Hardware",
    description:
      "Enhance your home with M.M. Noorbhoy & Co.'s Furniture Hardware essentials. From bed lifts & wardrobes to cabinet fittings & more, find everything to transform your furniture & space. Shop Now!",
    image: "/images/sample.jpg",
  },
  {
    title: "Furniture Hardware",
    description:
      "Enhance your home with M.M. Noorbhoy & Co.'s Furniture Hardware essentials. From bed lifts & wardrobes to cabinet fittings & more, find everything to transform your furniture & space. Shop Now!",
    image: "/images/sample.jpg",
  },
];




const CategorySection = () => {
  console.log("CategorySection component rendered");
  return (
    
    <div className="category-container">
      
      {categories.map((category, index) => (
        <div key={index} className="category-card" style={{ backgroundImage: `url(${category.image})` }}>
          <div className="category-overlay">
            <h2>{category.title}</h2>
            <p>{category.description}</p>
            <button className="shop-btn">Shop now</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategorySection;
