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
      <div className="product-list-wrapper">
        <div className="product-list-container">
          <h2 className="product-list-title">
            <span className="product-list-title-red">New</span>{' '}
            <span className="product-list-title-red">Arrivals</span>
          </h2>
    
          {/* <div className="product-list-left-image">
            <img src="/images/o5.png" alt="Side visual" />
          </div> */}
          <PromotionalBanner location={'home-page-new-arrivals'} />
    
          <div className="product-list-grid">
            {products.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
        </div>
      </div>
    );
  };

export default ProductList;