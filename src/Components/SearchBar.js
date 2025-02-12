import React, { useState } from 'react';
import './SearchBar.css'; 

function SearchBar(){
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
   
    console.log('Searching for:', searchQuery);
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSearchSubmit} className="search-form">
        <input
          type="text"
          className="search-input"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <button type="submit" className="search-button">🔍</button>
      </form>
    </div>
  );
};

export default SearchBar;
