import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import "./SearchBarN.css";

const SearchBarN = () => {
  const [showBrands, setShowBrands] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);

  // Define brands with subcategories
  const brands = {
    "Aar Kay Vox": ["Category 1", "Category 2", "Category 3"],
    "Adonai": ["Category A", "Category B"],
    "Albion": ["Option X", "Option Y", "Option Z"],
    "Allegrini": ["Sub 1", "Sub 2"],
    "Amerock": ["Group A", "Group B"],
    "Assa Abloy": ["Type 1", "Type 2"],
  };

  return (
    <div className="navbar-N">
      <div className="menu-item">SHOP BY BRANDS ▼</div>

    
      <div
        className="dropdown-wrapper"
        onMouseEnter={() => setShowBrands(true)}
        onMouseLeave={() => setShowBrands(false)}
      >
        <div className="menu-item">CATEGORY ▼</div>

        {/* First Level Dropdown (Brands) */}
        {showBrands && (
          <div className="dropdown">
            {Object.keys(brands).map((brand, index) => (
              <div
                key={index}
                className="dropdown-item"
                onClick={() => setSelectedBrand(brand)}
              >
                {brand} <span className="arrow">›</span>
              </div>
            ))}
          </div>
        )}

        {/* Second Level Dropdown (Subcategories) */}
        {selectedBrand && (
          <div
            className="sub-dropdown"
            onMouseEnter={() => setSelectedBrand(selectedBrand)}
            onMouseLeave={() => setSelectedBrand(null)}
          >
            {brands[selectedBrand].map((subcategory, index) => (
              <div key={index} className="sub-dropdown-item">
                {subcategory}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="search-container">
        <input type="text" placeholder="Search..." />
        <FaSearch className="search-icon" />
      </div>
    </div>
  );
};

export default SearchBarN;
