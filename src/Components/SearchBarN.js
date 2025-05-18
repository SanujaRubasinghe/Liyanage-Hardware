import React, { useState, useEffect, useRef } from "react";
import { hammers } from "./hammers";
import { FaSearch } from "react-icons/fa";
import "./SearchBarN.css";

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

  // debounce & filter
  useEffect(() => {
    const handler = setTimeout(() => {
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
    }, 200);
    return () => clearTimeout(handler);
  }, [query]);

  // dynamically cap dropdown height
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
          placeholder="Search for a hammer"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
        <FaSearch className="search-icon" />
      </div>

      {results.length > 0 && (
        <ul className="results-list" ref={resultsRef}>
          {results.map((h) => (
            <li key={h.id} className="result-item">
              <img src={h.image} alt={h.name} className="result-img" />
              <div className="result-info">
                <span className="result-name">{h.name}</span>
                <span className="result-type">{h.type}</span>
                <span className="result-price">Rs.{h.price.toFixed(2)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
