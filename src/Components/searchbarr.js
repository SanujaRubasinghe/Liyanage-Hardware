import React, { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash";
import API from "../api";
import "./SearchBarN.css";

export default function Searchbarr() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const fetchResults = async (searchTerm) => {
    try {
      if (!searchTerm.trim()) {
        setResults([])
        return
      }
      const res = await API.get(`/products/search-products?q=${encodeURIComponent(searchTerm)}`)
      setResults(res.data)
    } catch (err) {
      console.error('Error fetching products: ', err)
      setResults([])
    }
  }

   const debouncedSearch = useCallback(
    debounce((term) => {
      fetchResults(term);
    }, 300),
    [] // memoize once
  );

  useEffect(() => {
    debouncedSearch(query);
    // Cancel debounce on unmount
    return debouncedSearch.cancel;
  }, [query, debouncedSearch]);

  return (
    <div className="search-container">
      
      {/* Search Bar and Results Section */}
      <div className="search-section">
        <input
          type="text"
          placeholder="Search for a product…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="search-input"
        />

        {results.length > 0 && (
          <ul className="results-list">
            {results.map(p => (
              <li key={p.product_id} className="result-item">
                <img src={`${process.env.REACT_APP_API_BASE_URL}/${p.image_url}`} alt={p.name} className="result-img" />
                <div className="result-info">
                  <h4 className="result-name">{p.name}</h4>
                  <span className="result-type">{p.brand}</span>
                  <span className="result-price">Rs.{p.price.toLocaleString()}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}