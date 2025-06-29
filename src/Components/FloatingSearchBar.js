// src/Components/FloatingSearchBar.jsx
import React from 'react';
import './FloatingSearchBar.css';
import { FaSearch } from 'react-icons/fa';

function FloatingSearchBar() {
  const handleClick = () => {
    const input = document.getElementById('main-search-input');
    if (input) {
      input.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => input.focus(), 500); // Slight delay to allow scroll
    }
  };

  return (
    <button className="floating-search-icon" onClick={handleClick}>
      <FaSearch />
    </button>
  );
}

export default FloatingSearchBar;
