'use client';
import React, { useState, useEffect, useRef, useMemo } from "react";
import { FaSearch } from "react-icons/fa";
import debounce from "lodash/debounce";
import API from "../api";
import { Link, useNavigate } from "../router-compat";
import { getImageUrl } from "../utils/imageUrl";
import { checkConsent } from "../services/checkConsent";

export default function SearchBarN() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hasConsent, setHasConsent] = useState(false);
  const searchContainerRef = useRef(null);
  const inputRef = useRef(null);
  const resultsRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    setHasConsent(() => checkConsent());

    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const trackSearchQuery = async (searchQuery, resultsCount) => {
    try {
      await API.post('/analytics/user/track-search', {
        query: searchQuery,
        results_count: resultsCount
      });
    } catch(error) {
      console.log("Failed to track search query: ", error);
    }
  };

  const debouncedSearch = useMemo(
    () =>
      debounce(async (term) => {
        if (!term.trim()) {
          setResults([]);
          return;
        }

        try {
          setIsLoading(true);
          const res = await API.get(`/products/search-products?q=${encodeURIComponent(term)}&limit=5`);
          setResults(res.data);
          setIsLoading(false);
          if (hasConsent) trackSearchQuery(term, res.data.length);
        } catch (err) {
          console.error("Error fetching products:", err);
          setResults([]);
          setIsLoading(false);
          if (hasConsent) trackSearchQuery(term, 0);
        }
      }, 300),
    [hasConsent]
  );

  useEffect(() => {
    debouncedSearch(query);
    return () => debouncedSearch.cancel();
  }, [query, debouncedSearch]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setIsDropdownOpen(true);
  };

  const handleInputFocus = () => {
    setIsDropdownOpen(true);
  };

  const handleResultClick = () => {
    setIsDropdownOpen(false);
    setQuery("");
  };

  const uniqueCategories = results.reduce((acc, product) => {
    if (product.category_id) {
      const catSlug = product.category_slug || product.slug || product.category_id;
      if (catSlug && !acc.some(cat => cat.slug === catSlug)) {
        acc.push({
          slug: catSlug,
          name: product.category_name,
          category_id: product.category_id
        });
      }
    }
    return acc;
  }, []);

  return (
    <div className="flex justify-center items-center bg-[#333333] text-white py-2.5 px-6 relative z-[90] shadow-md sm:py-2 sm:px-4 w-full">
      <div className="flex items-center mr-6 sm:mr-3">
        <Link 
          to="/products" 
          className="bg-gradient-to-br from-[#cc0000] to-[#aa0000] text-white px-4 py-2 rounded-full font-bold text-sm tracking-wide shadow-md transition-all hover:-translate-y-[1px] hover:shadow-lg hover:from-[#e60000] hover:to-[#cc0000] sm:px-3 sm:py-1.5 sm:text-xs"
        >
          OFFERS
        </Link>
      </div>

      <div className="relative flex-1 max-w-[550px] sm:max-w-full" ref={searchContainerRef}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for a product..."
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          className="w-full py-2.5 pl-4 pr-10 rounded-full border border-gray-300 text-sm text-gray-800 outline-none shadow-inner transition-all focus:border-[#cc0000] focus:ring-4 focus:ring-[#cc0000]/15 sm:py-2 sm:text-xs"
        />
        <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-[#cc0000] text-base pointer-events-none" />

        {isDropdownOpen && query && (
          <ul className="absolute top-full left-0 right-0 mt-2 max-h-[60vh] overflow-y-auto bg-white rounded-xl shadow-2xl z-[1000] py-2 border border-gray-100 list-none" ref={resultsRef}>
            {isLoading ? (
              <li className="text-gray-500 p-4 text-center text-sm">Loading products...</li>
            ) : results.length > 0 ? (
              <>
                {results.map((product) => (
                  <li key={product.product_id} className="border-b border-gray-100 last:border-b-0">
                    <Link
                      to={`/products/${product.product_id}`}
                      className="flex items-center p-3 hover:bg-red-50 transition-colors"
                      onClick={handleResultClick}
                    >
                      <img
                        src={getImageUrl(product.image_url)}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-md mr-3 border border-gray-100 shrink-0"
                        onError={(e) => { e.target.src = '/images/Sample.jpg'; }}
                      />
                      <div className="flex flex-col flex-1">
                        <span className="font-semibold text-sm text-gray-800 mb-0.5">{product.name}</span>
                        <span className="text-xs text-gray-500 mb-0.5">{product.category_name}</span>
                        <span className="text-sm font-bold text-[#cc0000]">
                          Rs.{Number(product.price).toFixed(2)}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
                {uniqueCategories.map((category) => (
                  <li className="p-0" key={category.slug}>
                    <button
                      className="w-full p-3 bg-gray-50 border-none text-[#cc0000] text-sm font-semibold text-center cursor-pointer transition-colors hover:bg-red-50"
                      onClick={() => {
                        navigate(`/category/${category.category_id}`);
                        handleResultClick();
                      }}
                    >
                      See More Results in {category.name}
                    </button>
                  </li>
                ))}
              </>
            ) : (
              <li className="text-gray-500 p-4 text-center text-sm">No products found</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}