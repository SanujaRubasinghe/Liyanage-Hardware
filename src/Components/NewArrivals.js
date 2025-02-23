import React from "react";
import ProductCard from "./ProductCard";
import "./NewArrivals.css"; 

const products = [
  {
    image: '/images/sample.jpg',
    title: "Product 1",
    partNumber: "A2H322AB(3)",
    price: "Rs.2000",
    unit: "Pack Of 3",
  },
  {
    image: '/images/sample.jpg',
    title: "Product 2",
    partNumber: "70256",
    price: "Rs.2000",
    unit: "Each",
  },
  {
    image: '/images/sample.jpg',
    title: "Product 3",
    partNumber: "BUR35KIT82",
    price: "Rs.2000",
    unit: "Pair",
  },
  {
    image: '/images/sample.jpg',
    title: "Product 4",
    partNumber: "RS2018-AT",
    price: "Rs.2000",
    unit: "Pair",
  },
];

const ProductList = () => {
    return (
      <div className="new-arrivals-container">
        <h2 className="highlight-gray">
          <span className="blue-text">New</span>{' '}
          <span className="red-text">Arrivals</span>
        </h2>
  
        <div className="new-left-image">
          <img src="/images/o5.png" alt="Side visual" />
        </div>
  
        <div className="new-product-grid">
          {products.map((product, index) => (
            <ProductCard key={index} {...product} />
          ))}
        </div>
      </div>
    );
  };
  

export default ProductList;
