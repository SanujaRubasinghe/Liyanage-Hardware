import React, { useState, useEffect, useRef, useCallback } from "react";
import { FaSearch, FaTag, FaList, FaTimes } from "react-icons/fa";
import debounce from "lodash/debounce";
import API from "../api";
import { Link, useNavigate } from "react-router-dom";
import { checkConsent } from "../services/checkConsent";
import "./SearchBarN.css";

export default function Searchbarr() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hasConsent, setHasConsent] = useState(false)
  const searchContainerRef = useRef(null);
  const resultsRef = useRef(null);
  const navbarRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {

    setHasConsent(() => checkConsent())

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
      })
    } catch(error) {
      console.log("Failed to track search query: ", error)
    }
  }

  // Debounced search function
  const searchProducts = async (term) => {
    if (!term.trim()) {
      setResults([]);
      return;
    }

    try {
      setIsLoading(true);
      const res = await API.get(`/products/search-products?q=${encodeURIComponent(term)}&limit=5`);
      setResults(res.data);
      setIsLoading(false);
      if (hasConsent) trackSearchQuery(term, res.data.length)
    } catch (err) {
      console.error("Error fetching products:", err);
      setResults([]);
      setIsLoading(false);
      if (hasConsent) trackSearchQuery(term, 0)
    }
  };

  const debouncedSearch = useCallback(
    debounce((term) => {
      searchProducts(term);
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(query);
    return () => debouncedSearch.cancel();
  }, [query, debouncedSearch]);

  useEffect(() => {
    if (resultsRef.current) {
      const availableHeight = window.innerHeight * 0.6;
      resultsRef.current.style.maxHeight = `${availableHeight}px`;
    }
  }, [results]);

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

  // Extract unique categories using slugs
  const uniqueCategories = results.reduce((acc, product) => {
    if (product.slug && !acc.some(cat => cat.slug === product.slug)) {
      acc.push({
        slug: product.slug,
        name: product.category_name,
        category_id: product.category_id
      });
    }
    return acc;
  }, []);

  return (
    <div className="navbar-N" ref={navbarRef}>
      {/* LEFT GROUP */}
      <div className="nav-left">
        <div className="offers-button">OFFERS</div>
      </div>

      {/* RIGHT GROUP */}
      <div className="search-container navbar-search" ref={searchContainerRef}>
        <input
          type="text"
          placeholder="Search for a product"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          className="search-input"
        />
        <FaSearch className="search-icon" />

        {/* SEARCH RESULTS */}
        {isDropdownOpen && query && (
          <ul className="results-list" ref={resultsRef}>
            {isLoading ? (
              <li className="result-item loading">Loading products...</li>
            ) : results.length > 0 ? (
              <>
                {results.map((product) => (
                  <li key={product.product_id} className="result-item">
                    <Link
                      to={`/products/${product.product_id}`}
                      className="result-link"
                      onClick={handleResultClick}
                    >
                      <img
                        src={
                          product.image_url
                            ? `${process.env.REACT_APP_API_BASE_URL}/${product.image_url}`
                            : "/placeholder.jpg"
                        }
                        alt={product.name}
                        className="result-img"
                      />
                      <div className="result-info">
                        <span className="result-name">{product.name}</span>
                        <span className="result-type">{product.category_name}</span>
                        <span className="result-price">
                          Rs.{Number(product.price).toFixed(2)}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
                {/* Render a See More button for each unique category */}
                {uniqueCategories.map((category) => (
                  <li className="see-more-container" key={category.slug}>
                    <button
                      className="see-more-button"
                      onClick={() => {
                        navigate(`/category/${category.slug}/products`, {
                          state: {
                            name: category.name,
                            cat_id: category.category_id
                          }
                        });
                        handleResultClick();
                      }}
                    >
                      See More Results in {category.name}
                    </button>
                  </li>
                ))}
              </>
            ) : (
              <li className="result-item no-results">No products found</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}