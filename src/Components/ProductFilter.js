import React, { useState, useEffect, useMemo } from 'react';
import { debounce } from 'lodash';
import API from '../api';
import './ProductFilter.css';

const ProductFilter = ({ onFilterChange, initialFilters }) => {
  const [selectedFilters, setSelectedFilters] = useState({
    priceRange: [],
    brands: [],
    ...initialFilters
  });

  const [availableBrands, setAvailableBrands] = useState([]);

  // Debounce the filter updates to prevent too many re-renders
  const debouncedFilterUpdate = useMemo(
    () => debounce(onFilterChange, 300),
    [onFilterChange]
  );

  // Call the debounced update when filters change
  useEffect(() => {
    debouncedFilterUpdate(selectedFilters);
    return () => debouncedFilterUpdate.cancel();
  }, [selectedFilters, debouncedFilterUpdate]);

  // Fetch available brands on mount
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

  const priceRanges = [
    { label: 'Under Rs.500', min: 0, max: 500 },
    { label: 'Rs.500 - Rs.1000', min: 500, max: 1000 },
    { label: 'Rs.1000 - Rs.20000', min: 1000, max: 20000 },
    { label: 'Over Rs.20000', min: 20000, max: null }
  ];

  return (
    <aside className="product-filters__panel">
      <h3 className="product-filters__title">Filter Products</h3>

      <div className="product-filters__group">
        <h4 className="product-filters__title">Price Range</h4>
        {priceRanges.map((range, i) => (
          <label key={i} className="product-filters__option">
            <input
              type="checkbox"
              checked={selectedFilters.priceRange.some(r => r.label === range.label)}
              onChange={(e) => handlePriceChange(range, e.target.checked)}
            />
            {range.label}
          </label>
        ))}
      </div>

      <div className="product-filters__group">
        <h4 className="product-filters__title">Brand</h4>
        {availableBrands.map((brand, i) => (
          <label key={i} className="product-filters__option">
            <input
              type="checkbox"
              checked={selectedFilters.brands.includes(brand)}
              onChange={(e) => handleBrandChange(brand, e.target.checked)}
            />
            {brand}
          </label>
        ))}
      </div>

      <button className="product-filters__clear-button" onClick={clearFilters}>
        Clear Filters
      </button>
    </aside>
  );
};

export default ProductFilter;