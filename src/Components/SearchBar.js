import React, { useState } from 'react';
import './SearchBar.css';

function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  return (
    <div className="banana-stand"> {/* Changed to funny class name */}
      <form onSubmit={handleSearchSubmit} className="search-dance-party">
        <input
          type="text"
          className="search-boogie"
          placeholder="Search Products..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <button type="submit" className="search-disco">🔎</button>
      </form>
      <i className="fa-solid fa-cart-shopping cart-zumba"></i>
    </div>
  );
}

export default SearchBar;