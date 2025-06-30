import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import API from '../api';
import './ProductPageN.css';
import ProductCard from './ProductCard';
import { useNavigate, useLocation } from 'react-router-dom';
import LoadingPage from './LoadingPage';
import ProductFilter from './ProductFilter';

import { Helmet } from 'react-helmet';

const itemsPerPage = 12;

const ProductPageN = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state;

  const [currentPage, setCurrentPage] = useState(1);
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    priceRange: [],
    brands: []
  });

  useEffect(() => {
    const fetchProducts = async () => {
      let response;
      try {
        if (!state) {
          response = await API.get('/products');
        } else {
          response = await API.get(`/products?categoryId=${state.cat_id}`);
        }
        setAllProducts(response.data);
        setFilteredProducts(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error('Error Loading Products');
      }
    };
    fetchProducts();
  }, [state]);

  useEffect(() => {
    const applyFilters = () => {
      let result = [...allProducts];
      
      // Apply price filters
      if (filters.priceRange.length > 0) {
        result = result.filter(product => {
          return filters.priceRange.some(range => {
            if (range.max === null) return product.price >= range.min;
            return product.price >= range.min && product.price <= range.max;
          });
        });
      }
      
      // Apply brand filters
      if (filters.brands.length > 0) {
        result = result.filter(product => 
          filters.brands.includes(product.brand)
        );
      }
      
      setFilteredProducts(result);
      setCurrentPage(1); // Reset to first page when filters change
    };

    applyFilters();
  }, [filters, allProducts]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <>
    <Helmet>
      <title>Our Products | New Liyanage Hardware</title>
      <meta name="description" content="Browse our wide range of hardware products and tools available at New Liyanage Hardware." />
      <link rel="canonical" href="https://newliyanagehardware.lk/products" />
      <meta property="og:title" content="Products" />
      <meta property="og:description" content="Find tools, building materials, and accessories." />
      <meta property="og:url" content="https://newliyanagehardware.lk/products" />
    </Helmet>
    
    <div className="page-container">
      <ProductFilter
        onFilterChange={setFilters}
        initialFilters={filters}
      />
      
      <main className="product-list">
        <div className="banner">
          <img src="/images/category/bathware/161.jpg" alt="Promo Banner" />
        </div>

        {filteredProducts.length === 0 && !loading && (
          <div className="no-products-message">
            <h3>No products match your filters</h3>
            <p>Try adjusting your filter criteria.</p>
          </div>
        )}
        
        {filteredProducts.length > 0 && (
          <>
            <h1>{state ? `Category: ${state.name}` : 'All Products'}</h1>
            
            <div className="products">
              {currentProducts.map((product, index) => (
                <ProductCard
                  key={index}
                  product={product}
                />
              ))}
            </div>

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
    </>
  );
};

export default ProductPageN;