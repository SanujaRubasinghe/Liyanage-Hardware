import React, { useState, useEffect, useMemo } from 'react';
import { debounce } from 'lodash';
import API from '../api';
import './ProductFilter.css';
import { FiFilter, FiChevronDown, FiChevronUp, FiX } from 'react-icons/fi';

const ProductFilter = ({ onFilterChange, initialFilters }) => {
  const [selectedFilters, setSelectedFilters] = useState({
    priceRange: [],
    brands: [],
    ...initialFilters
  });
  const [availableBrands, setAvailableBrands] = useState([]);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState(null);

  // Debounce the filter updates
  const debouncedFilterUpdate = useMemo(
    () => debounce(onFilterChange, 300),
    [onFilterChange]
  );

  useEffect(() => {
    debouncedFilterUpdate(selectedFilters);
    return () => debouncedFilterUpdate.cancel();
  }, [selectedFilters, debouncedFilterUpdate]);

  // Fetch available brands
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await API.get('/products/brands');
        setAvailableBrands(response.data);
      } catch (error) {
        console.error('Error fetching brands:', error);
      }
    };
    fetchBrands();
  }, []);

  const handlePriceChange = (range, isChecked) => {
    setSelectedFilters(prev => {
      const newPriceRanges = isChecked
        ? [...prev.priceRange, range]
        : prev.priceRange.filter(r => r.label !== range.label);
      return { ...prev, priceRange: newPriceRanges };
    });
  };

  const handleBrandChange = (brand, isChecked) => {
    setSelectedFilters(prev => {
      const newBrands = isChecked
        ? [...prev.brands, brand]
        : prev.brands.filter(b => b !== brand);
      return { ...prev, brands: newBrands };
    });
  };

  const clearFilters = () => {
    setSelectedFilters({ priceRange: [], brands: [] });
  };

  const toggleAccordion = (section) => {
    setActiveAccordion(activeAccordion === section ? null : section);
  };

  const priceRanges = [
    { label: 'Under Rs.500', min: 0, max: 500 },
    { label: 'Rs.500 - Rs.1000', min: 500, max: 1000 },
    { label: 'Rs.1000 - Rs.20000', min: 1000, max: 20000 },
    { label: 'Over Rs.20000', min: 20000, max: null }
  ];

  return (
    <>
      {/* Mobile Filter Toggle Button */}
      <button 
        className="mobile-filter-toggle"
        onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
      >
        <FiFilter />
        <span>{isMobileFiltersOpen ? 'Hide Filters' : 'Show Filters'}</span>
        {isMobileFiltersOpen ? <FiX /> : <FiChevronDown />}
      </button>

      {/* Filter Panel */}
      <aside className={`product-filters__panel ${isMobileFiltersOpen ? 'mobile-open' : ''}`}>
        <div className="product-filters__header">
          <h3 className="product-filters__title">Filter Products</h3>
          <button 
            className="product-filters__close-button"
            onClick={() => setIsMobileFiltersOpen(false)}
            aria-label="Close filters"
          >
            <FiX />
          </button>
        </div>

        {/* Price Range Filter */}
        <div className="product-filters__group">
          <button 
            className="product-filters__group-header"
            onClick={() => toggleAccordion('price')}
            aria-expanded={activeAccordion === 'price'}
          >
            <h4>Price Range</h4>
            {activeAccordion === 'price' ? <FiChevronUp /> : <FiChevronDown />}
          </button>
          <div className={`product-filters__group-content ${activeAccordion === 'price' ? 'open' : ''}`}>
            {priceRanges.map((range, i) => (
              <label key={i} className="product-filters__option">
                <input
                  type="checkbox"
                  checked={selectedFilters.priceRange.some(r => r.label === range.label)}
                  onChange={(e) => handlePriceChange(range, e.target.checked)}
                />
                <span className="product-filters__option-label">{range.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Brand Filter */}
        <div className="product-filters__group">
          <button 
            className="product-filters__group-header"
            onClick={() => toggleAccordion('brand')}
            aria-expanded={activeAccordion === 'brand'}
          >
            <h4>Brand</h4>
            {activeAccordion === 'brand' ? <FiChevronUp /> : <FiChevronDown />}
          </button>
          <div className={`product-filters__group-content ${activeAccordion === 'brand' ? 'open' : ''}`}>
            {availableBrands.map((brand, i) => (
              <label key={i} className="product-filters__option">
                <input
                  type="checkbox"
                  checked={selectedFilters.brands.includes(brand)}
                  onChange={(e) => handleBrandChange(brand, e.target.checked)}
                />
                <span className="product-filters__option-label">{brand}</span>
              </label>
            ))}
          </div>
        </div>

        <button className="product-filters__clear-button" onClick={clearFilters}>
          Clear Filters
        </button>
      </aside>
    </>
  );
};

export default ProductFilter;