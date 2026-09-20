'use client';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import API from '../api';
import ProductCard from './ProductCard';
import SearchBarN from "./SearchBarN";
import { useLocation, useParams } from '../router-compat';
import LoadingPage from './LoadingPage';
import ProductFilter from './ProductFilter';

const itemsPerPage = 12;

const ProductPageN = () => {
  const location = useLocation();
  const state = location.state;
  const { catid } = useParams();
  const categoryId = state?.cat_id || catid;
  const categoryName = state?.name;

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
        response = categoryId
          ? await API.get(`/products?categoryId=${categoryId}`)
          : await API.get('/products');

        setAllProducts(response.data);
        setFilteredProducts(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error('Error Loading Products');
      }
    };
    fetchProducts();
  }, [categoryId]);

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
    <div className="bg-gray-50 min-h-screen">
      <SearchBarN />
      
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex flex-col md:flex-row gap-8 lg:gap-12">
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 lg:w-72 shrink-0">
          <ProductFilter
            onFilterChange={setFilters}
            initialFilters={filters}
          />
        </div>
        
        {/* Main Content Area */}
        <main className="flex-1 flex flex-col">
          {/* Optional Promo Banner - Keeping the image logic if present */}
          <div className="w-full h-32 md:h-48 rounded-2xl overflow-hidden mb-8 shadow-sm">
            <img 
              src="/images/category/bathware/161.jpg" 
              alt="Promo Banner" 
              className="w-full h-full object-cover"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>

          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4 border-b border-gray-200 pb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
                {categoryName || 'All Products'}
              </h1>
              <p className="text-sm text-gray-500 mt-2">
                Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
              </p>
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 && !loading ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500">Try adjusting your filters to find what you're looking for.</p>
              <button 
                onClick={() => setFilters({ priceRange: [], brands: [] })}
                className="mt-6 px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center sm:justify-items-stretch">
                {currentProducts.map((product, index) => (
                  <div key={index} className="w-full flex justify-center">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200 ${
                        currentPage === index + 1 
                          ? 'bg-[#a34b4b] text-white shadow-md hover:bg-[#8c3c3c]' 
                          : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                      }`}
                      onClick={() => {
                        setCurrentPage(index + 1);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductPageN;
