import React, { useState, useEffect, useRef, useCallback } from "react";
import { FaSearch } from "react-icons/fa";
import debounce from "lodash/debounce";
import axios from "axios";
import "./SearchBarN.css";
import API from "../api";
import { Link } from "react-router-dom";

export default function Searchbarr() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showBrands, setShowBrands] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const resultsRef = useRef(null);
  const navbarRef = useRef(null);

  const brands = {
    "Aar Kay Vox": ["Category 1", "Category 2", "Category 3"],
    Adonai: ["Category A", "Category B"],
    Albion: ["Option X", "Option Y", "Option Z"],
    Allegrini: ["Sub 1", "Sub 2"],
    Amerock: ["Group A", "Group B"],
    "Assa Abloy": ["Type 1", "Type 2"],
  };

  // Debounced search function
  const searchProducts = async (term) => {
    if (!term.trim()) {
      setResults([]);
      return;
    }

    try {
      const res = await API.get(`/products/search-products?q=${encodeURIComponent(term)}`);
      setResults(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
      setResults([]);
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
    return debouncedSearch.cancel;
  }, [query, debouncedSearch]);

  useEffect(() => {
    if (resultsRef.current && navbarRef.current) {
      const navRect = navbarRef.current.getBoundingClientRect();
      const available = window.innerHeight - (navRect.bottom + 10);
      resultsRef.current.style.maxHeight = `${available}px`;
    }
  }, [results]);

  return (
    <div className="navbar-N" ref={navbarRef}>
      {/* LEFT GROUP */}
      <div className="nav-left">
        <div className="offers-button">OFFERS</div>

        <div
          className="dropdown-wrapper"
          onMouseEnter={() => setShowBrands(true)}
          onMouseLeave={() => {
            setShowBrands(false);
            setSelectedBrand(null);
          }}
        >
          <div className="menu-item">CATEGORY ▼</div>
          {showBrands && (
            <div className="dropdown">
              {Object.keys(brands).map((brand) => (
                <div
                  key={brand}
                  className="dropdown-item"
                  onClick={() => setSelectedBrand(brand)}
                >
                  {brand} <span className="arrow">›</span>
                </div>
              ))}
            </div>
          )}
          {selectedBrand && (
            <div
              className="sub-dropdown"
              onMouseEnter={() => setSelectedBrand(selectedBrand)}
              onMouseLeave={() => setSelectedBrand(null)}
            >
              {brands[selectedBrand].map((sub, i) => (
                <div key={i} className="sub-dropdown-item">
                  {sub}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT GROUP */}
      <div className="search-container navbar-search">
        <input
          type="text"
          placeholder="Search for a product"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
        <FaSearch className="search-icon" />
      </div>

      {results.length > 0 && (
        <ul className="results-list" ref={resultsRef}>
          {results.map((p) => (
            <li key={p.id} className="result-item">
              <Link 
                to="/product"
                state={{id: p.id}} 
                className="result-link"
              >
                <img src={`${process.env.REACT_APP_API_BASE_URL}/${p.image}`} alt={p.name} className="result-img" />
                <div className="result-info">
                  <span className="result-name">{p.name}</span>
                  <span className="result-type">{p.brand}</span>
                  <span className="result-price">Rs.{p.price}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
