import React, { useState, useEffect } from "react";
import { hammers } from "../data/hammers";
import "./SearchBar.css";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  // Optional: simple debounce to reduce filtering on every keystroke
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
    }, 200); // 200ms debounce

    return () => clearTimeout(handler);
  }, [query]);

  return (
    <div className="search-container">
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
                <h4>{h.name}</h4>
                <p>Type: {h.type}</p>
                <p>Price: ${h.price.toFixed(2)}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
