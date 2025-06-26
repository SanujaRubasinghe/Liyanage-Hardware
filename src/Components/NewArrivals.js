import React, {useState, useEffect} from "react";
import ProductCard from "./ProductCard";
import "./NewArrivals.css"; 
import PromotionalBanner from "./PromotionalBanner";
import API from "../api";


const ProductList = () => {
  const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await API.get('/products/new-arrivals')
        setProducts(response.data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchProducts()
  }, [])
    return (
      <div className="new-arrivals-container">
        <h2 className="highlight-gray">
          <span className="blue-text">New</span>{' '}
          <span className="red-text">Arrivals</span>
        </h2>
  
        <PromotionalBanner location={'home-page-new-arrivals'} />
  
        <div className="new-product-grid">
          {products.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      </div>
    );
  };
  

export default ProductList;
