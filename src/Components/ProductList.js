import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import ProductFilter from "./ProductFilter";
import LoadingPage from "./LoadingPage";
import API from "../api"
import "./ProductList.css"; 

const ProductList = () => {

  const [products, setProducts] = useState([])
  const [filters, setFilters] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const {data} = await API.get("/products/")
        setProducts(data) 
        setLoading(false)
      } catch (error) {
        console.error("Error fetching products: ", error)
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    const fetchFilteredProducts = async (filters) => {
      try {
        const response = await API.post("/products/filter", filters)
        setProducts(response.data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching products: ", error)
        setLoading(false)
      }
    }
    fetchFilteredProducts(filters)
  }, [filters])

  return (
    <>
    {loading ? (<LoadingPage />) : 
      (
        <div className="Pcontainer">
      <ProductFilter onFilter={setFilters} />
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
      )
    }
    
    </>
  );
};

export default ProductList;
