import React, { useState, useEffect, useMemo } from 'react';
import { debounce } from 'lodash';
import API from '../api';
import { FiFilter, FiChevronDown, FiChevronUp, FiX } from 'react-icons/fi';

const ProductFilter = ({ onFilterChange, initialFilters }) => {
  const [selectedFilters, setSelectedFilters] = useState({
    priceRange: [],
    inStockOnly: false,
    deliveryAvailable: false,
    sortBy: 'default',
    brands: [],
    ...initialFilters
  });
  const [availableBrands, setAvailableBrands] = useState([]);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState('price'); // default open price

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

  const handleToggleChange = (field, isChecked) => {
    setSelectedFilters(prev => ({ ...prev, [field]: isChecked }));
  };

  const handleSortChange = (e) => {
    setSelectedFilters(prev => ({ ...prev, sortBy: e.target.value }));
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
    setSelectedFilters({ priceRange: [], brands: [], inStockOnly: false, deliveryAvailable: false, sortBy: 'default' });
  };

  const toggleAccordion = (section) => {
    setActiveAccordion(activeAccordion === section ? null : section);
  };

  const priceRanges = [
    { label: 'Under Rs.500', min: 0, max: 500 },
    { label: 'Rs.500 - Rs.1,000', min: 500, max: 1000 },
    { label: 'Rs.1,000 - Rs.5,000', min: 1000, max: 5000 },
    { label: 'Rs.5,000 - Rs.20,000', min: 5000, max: 20000 },
    { label: 'Over Rs.20,000', min: 20000, max: null }
  ];

  return (
    <>
      {/* Mobile Filter Toggle Button */}
      <div className="md:hidden mb-4">
        <button 
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 py-3 rounded-lg font-medium shadow-sm hover:bg-gray-50 transition-colors"
          onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
        >
          <FiFilter className="text-gray-500" />
          <span>{isMobileFiltersOpen ? 'Hide Filters' : 'Filter Products'}</span>
          {isMobileFiltersOpen ? <FiX className="text-gray-500" /> : <FiChevronDown className="text-gray-500" />}
        </button>
      </div>

      {/* Filter Panel */}
      <aside className={`
        fixed inset-0 z-50 bg-white overflow-y-auto w-full h-full p-6 transition-transform duration-300 md:static md:block md:w-64 md:h-auto md:p-0 md:bg-transparent md:z-auto
        ${isMobileFiltersOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <h3 className="text-lg font-bold text-gray-900 tracking-wide uppercase">Filters</h3>
          <button 
            className="md:hidden text-gray-400 hover:text-gray-600 p-2"
            onClick={() => setIsMobileFiltersOpen(false)}
            aria-label="Close filters"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Sort By Filter */}
          <div className="border-b border-gray-200 pb-6">
            <h4 className="text-[15px] font-semibold text-gray-800 mb-4">Sort By</h4>
            <select 
              className="w-full p-2 border border-gray-300 rounded focus:ring-[#a34b4b] focus:border-[#a34b4b] outline-none text-sm text-gray-700"
              value={selectedFilters.sortBy || "default"}
              onChange={handleSortChange}
            >
              <option value="default">Default</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name: A-Z</option>
              <option value="name_desc">Name: Z-A</option>
            </select>
          </div>

          {/* Availability Filter */}
          <div className="border-b border-gray-200 pb-6">
            <h4 className="text-[15px] font-semibold text-gray-800 mb-4">Availability</h4>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-[#a34b4b] bg-gray-100 border-gray-300 rounded focus:ring-[#a34b4b] focus:ring-2 cursor-pointer transition-colors"
                  checked={selectedFilters.inStockOnly || false}
                  onChange={(e) => handleToggleChange("inStockOnly", e.target.checked)}
                />
                <span className="text-[14px] text-gray-600 group-hover:text-gray-900 transition-colors">In Stock Only</span>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-[#a34b4b] bg-gray-100 border-gray-300 rounded focus:ring-[#a34b4b] focus:ring-2 cursor-pointer transition-colors"
                  checked={selectedFilters.deliveryAvailable || false}
                  onChange={(e) => handleToggleChange("deliveryAvailable", e.target.checked)}
                />
                <span className="text-[14px] text-gray-600 group-hover:text-gray-900 transition-colors">Delivery Available</span>
              </label>
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="border-b border-gray-200 pb-6">
            <button 
              className="w-full flex justify-between items-center group"
              onClick={() => toggleAccordion('price')}
              aria-expanded={activeAccordion === 'price'}
            >
              <h4 className="text-[15px] font-semibold text-gray-800">Price Range</h4>
              <span className="text-gray-400 group-hover:text-gray-600 transition-colors">
                {activeAccordion === 'price' ? <FiChevronUp /> : <FiChevronDown />}
              </span>
            </button>
            
            <div className={`mt-4 space-y-3 overflow-hidden transition-all duration-300 ${activeAccordion === 'price' ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
              {priceRanges.map((range, i) => (
                <label key={i} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-[#a34b4b] bg-gray-100 border-gray-300 rounded focus:ring-[#a34b4b] focus:ring-2 cursor-pointer transition-colors"
                    checked={selectedFilters.priceRange.some(r => r.label === range.label)}
                    onChange={(e) => handlePriceChange(range, e.target.checked)}
                  />
                  <span className="text-[14px] text-gray-600 group-hover:text-gray-900 transition-colors">{range.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          {availableBrands.length > 0 && (
            <div className="border-b border-gray-200 pb-6">
              <button 
                className="w-full flex justify-between items-center group"
                onClick={() => toggleAccordion('brand')}
                aria-expanded={activeAccordion === 'brand'}
              >
                <h4 className="text-[15px] font-semibold text-gray-800">Brand</h4>
                <span className="text-gray-400 group-hover:text-gray-600 transition-colors">
                  {activeAccordion === 'brand' ? <FiChevronUp /> : <FiChevronDown />}
                </span>
              </button>
              
              <div className={`mt-4 space-y-3 overflow-hidden transition-all duration-300 ${activeAccordion === 'brand' ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                {availableBrands.map((brand, i) => (
                  <label key={i} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-[#a34b4b] bg-gray-100 border-gray-300 rounded focus:ring-[#a34b4b] focus:ring-2 cursor-pointer transition-colors"
                      checked={selectedFilters.brands.includes(brand)}
                      onChange={(e) => handleBrandChange(brand, e.target.checked)}
                    />
                    <span className="text-[14px] text-gray-600 group-hover:text-gray-900 transition-colors">{brand}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        <button 
          className="w-full mt-8 bg-gray-100 text-gray-600 font-medium py-3 rounded-lg hover:bg-gray-200 hover:text-gray-800 transition-colors duration-200 uppercase text-xs tracking-wider" 
          onClick={clearFilters}
        >
          Clear All Filters
        </button>
        
        {/* Mobile Apply Button */}
        <button 
          className="w-full mt-4 bg-[#a34b4b] text-white font-medium py-3 rounded-lg hover:bg-[#8c3c3c] transition-colors duration-200 uppercase text-xs tracking-wider md:hidden"
          onClick={() => setIsMobileFiltersOpen(false)}
        >
          Apply Filters
        </button>
      </aside>
      
      {/* Overlay for mobile */}
      {isMobileFiltersOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setIsMobileFiltersOpen(false)}
        />
      )}
    </>
  );
};

export default ProductFilter;
