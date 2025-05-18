import React, { useState, useEffect } from "react";
import { hammers } from "./hammers";
import "./SearchBarN.css";

export default function Searchbarr() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (query.trim() === "") {
        setResults([]);
      } else {
        const lower = query.toLowerCase();
        setResults(
          hammers.filter(h =>
            h.name.toLowerCase().includes(lower) ||
            h.type.toLowerCase().includes(lower)
          )
        );
      }
    }, 200);

    return () => clearTimeout(handler);
  }, [query]);

  return (
    <div className="search-container">
      
      {/* Search Bar and Results Section */}
      <div className="search-section">
        <input
          type="text"
          placeholder="Search for a hammer…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="search-input"
        />

        {results.length > 0 && (
          <ul className="results-list">
            {results.map(h => (
              <li key={h.id} className="result-item">
                <img src={h.image} alt={h.name} className="result-img" />
                <div className="result-info">
                  <h4 className="result-name">{h.name}</h4>
                  <span className="result-type">{h.type}</span>
                  <span className="result-price">${h.price.toFixed(2)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}