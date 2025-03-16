import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import API from "../api"
import "./ProductList.css"; 

const ProductList = () => {

  const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const {data} = await API.get("/products/")
        setProducts(data)
      } catch (error) {
        console.error("Error fetching products: ", error)
      }
    }

    fetchProducts()
  }, [])

  return (
    <div className="Pcontainer">

      <h2 className="highlight-gray">
        <span className="blue-text">Our</span>{' '}
        <span className="red-text">Products</span>
      </h2>

      {/* Left side image */}
      <div className="Pleft-image">
        <img src="/images/o5.png" alt="Side visual" />
      </div>
      {/* Right side products grid */}
      <div className="Pproduct-grid">
        {products.map((product, index) => (
          <ProductCard key={index} {...product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
