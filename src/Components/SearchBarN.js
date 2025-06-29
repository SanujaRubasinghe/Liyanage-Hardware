import React, { useState, useEffect, useRef } from "react";
import { hammers } from "./hammers"; // Import your hammer data
import { FaSearch, FaTag, FaList, FaTimes } from "react-icons/fa";
import "./SearchBarN.css";

export default function Searchbarr() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [openBrand, setOpenBrand] = useState(null);
  const resultsRef = useRef(null);

  const brands = {
    "Aar Kay Vox": ["Category 1", "Category 2", "Category 3"],
    Adonai: ["Category A", "Category B"],
    Albion: ["Option X", "Option Y", "Option Z"],
    Allegrini: ["Sub 1", "Sub 2"],
    Amerock: ["Group A", "Group B"],
    "Assa Abloy": ["Type 1", "Type 2"],
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!query.trim()) {
        setResults([]);
      } else {
        const lower = query.toLowerCase();
        setResults(
          hammers.filter(
            (h) =>
              h.name.toLowerCase().includes(lower) ||
              h.type.toLowerCase().includes(lower)
          )
        );
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (resultsRef.current) {
      const availableHeight = window.innerHeight * 0.6;
      resultsRef.current.style.maxHeight = `${availableHeight}px`;
    }
  }, [results, showSearch]);

  const toggleBrand = (brand) => {
    setOpenBrand((prev) => (prev === brand ? null : brand));
  };

  return (
    <>
      {/* DESKTOP NAVBAR — NO CHANGES REQUIRED */}
      <div className="navbar-N">
        <div className="nav-left">
          <div className="offers-button">OFFERS</div>
          <div className="category-placeholder">CATEGORY ▼</div>
        </div>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search for a hammer"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
          />
          <FaSearch className="search-icon" />
        </div>
      </div>

      {/* ======= BOTTOM-TAB BAR (MOBILE) ======= */}
      <div className="bottom-tab-bar">
        <button onClick={() => setShowSearch(true)} aria-label="Search">
          <FaSearch />
        </button>
        <button onClick={() => setShowCategories(true)} aria-label="Categories">
          <FaList />
        </button>
        <button onClick={() => alert("Offers Clicked")} aria-label="Offers">
          <FaTag />
        </button>
      </div>

      {/* ======= FULLSCREEN SEARCH ======= */}
      {showSearch && (
        <div className="overlay">
          <div className="overlay-header">
            <button onClick={() => setShowSearch(false)}>
              <FaTimes />
            </button>
            <h2>Search</h2>
          </div>
          <div className="overlay-body">
            <input
              autoFocus
              type="text"
              placeholder="Type to search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="overlay-input"
            />
            {results.length > 0 && (
              <ul className="results-list" ref={resultsRef}>
                {results.map((h) => (
                  <li key={h.id} className="result-item">
                    <img
                      src={h.image}
                      alt={h.name}
                      className="result-img"
                      loading="lazy"
                    />
                    <div className="result-info">
                      <div className="result-name">{h.name}</div>
                      <div className="result-type">{h.type}</div>
                      <div className="result-price">Rs.{h.price.toFixed(2)}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* ======= FULLSCREEN CATEGORIES ======= */}
      {showCategories && (
        <div className="overlay">
          <div className="overlay-header">
            <button onClick={() => setShowCategories(false)}>
              <FaTimes />
            </button>
            <h2>Categories</h2>
          </div>
          <div className="overlay-body">
            {Object.entries(brands).map(([brand, subs]) => (
              <div key={brand} className="accordion">
                <div
                  className="accordion-header"
                  onClick={() => toggleBrand(brand)}
                >
                  {brand}
                  <span>{openBrand === brand ? "▾" : "▸"}</span>
                </div>
                {openBrand === brand && (
                  <div className="accordion-content">
                    {subs.map((sub) => (
                      <div key={sub} className="sub-item">
                        {sub}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
