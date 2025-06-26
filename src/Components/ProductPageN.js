import React, { useEffect, useState } from 'react';
import {toast} from 'react-toastify'
import API from '../api';
import './ProductPageN.css';
import ProductCard from './ProductCard';
import { useNavigate, useLocation} from 'react-router-dom';
import LoadingPage from './LoadingPage';


const filters = {
  range: ['1130B.', '3934', '9870', '996', 'Acoustic', 'AR1998'],
  brand: ['Briton', 'DORMA', 'Exidor', 'Fireco', 'GEZE', 'Rutland'],
  fireRating: ['30', '60', '120'],
};

const itemsPerPage = 12;

const ProductPageN = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const state = location.state

  const [currentPage, setCurrentPage] = useState(1);
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      let response
      try {
        if (!state) {
          response = await API.get('/products')
        } else {
          response = await API.get(`/products?categoryId=${state.cat_id}`)
        }
        setAllProducts(response.data)
        setLoading(false)
      } catch (error) {
        setLoading(false)
        toast.error('Error Loading Products')
      }
    }
    fetchProducts()
  }, [])

  const handleAddToCart = () => {
    alert('Added to cart!');
  };

  const handleDetails = (productId) => {
    navigate(`/products/${productId}`)
  }

  const totalPages = Math.ceil(allProducts.length / itemsPerPage);
  const currentProducts = allProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return <LoadingPage />
  }

  return (
    <div className="page-container">
      <aside className="product-filters__panel">
        <h3 className="product-filters__title">Filter Products</h3>

        <div className="product-filters__group">
          <h4 className="product-filters__title">Range</h4>
          {filters.range.map((item, i) => (
            <label key={i} className="product-filters__option">
              <input type="checkbox" /> {item}
            </label>
          ))}
        </div>

        <div className="product-filters__group">
          <h4 className="product-filters__title">Brand</h4>
          {filters.brand.map((item, i) => (
            <label key={i} className="product-filters__option">
              <input type="checkbox" /> {item}
            </label>
          ))}
        </div>

        <div className="product-filters__group">
          <h4 className="product-filters__title">Fire Rating</h4>
          {filters.fireRating.map((item, i) => (
            <label key={i} className="product-filters__option">
              <input type="radio" name="fireRating" /> {item}
            </label>
          ))}
        </div>

        <button className="product-filters__clear-button">Clear Filters</button>
      </aside>
      

      <main className="product-list">
        <div className="banner">
          <img src="/images/panaromaMessi.jpg" alt="Promo Banner" /> {/* daya bosa banner eka */}
        </div>

        {allProducts.length === 0 && !loading && (
          <div className="no-products-message">
            <h3>No products available</h3>
            <p>We couldn't find any products in this category.</p>
          </div>
        )}
        {allProducts.length > 0 && (<>
        <h1>{state ? `Category: ${state.name}` : 'All Products'}</h1>
        
        <div className="products">
          {currentProducts.map((product, index) => (
            <ProductCard
              key={index}
              product={product}
              handleAddToCart={handleAddToCart}
              handleDetails={() => handleDetails(product.product_id)}
            />
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              className={`page-btn ${currentPage === index + 1 ? 'active' : ''}`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </>
        )}
      </main>
    </div>
  );
};

export default ProductPageN;
