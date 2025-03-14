import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import API from "../api"
import "./ProductList.css"; 

// const products = [
//   {
//     image: '/images/sample.jpg',
//     title: "Product 1",
//     partNumber: "A2H322AB(3)",
//     price: "Rs.2000",
//     unit: "Pack Of 3",
//   },
//   {
//     image: '/images/sample.jpg',
//     title: "Product 2",
//     partNumber: "70256",
//     price: "Rs.2000",
//     unit: "Each",
//   },
//   {
//     image: '/images/sample.jpg',
//     title: "Product 3",
//     partNumber: "BUR35KIT82",
//     price: "Rs.2000",
//     unit: "Pair",
//   },
//   {
//     image: '/images/sample.jpg',
//     title: "Product 4",
//     partNumber: "RS2018-AT",
//     price: "Rs.2000",
//     unit: "Pair",
//   },
// ];

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
