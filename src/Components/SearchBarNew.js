import React from "react";
import "./SearchBarNew.css";
import { FaSearch, FaUser, FaShoppingBag } from "react-icons/fa";

const SearchBarNew = () => {
  return (
    <div className="search-bar-container">
      <div className="search-section">
        <select className="product-dropdown">
          <option>All Product Types</option>
        </select>
        <input type="text" placeholder="Search for products" className="search-input" />
        <button className="search-button">
          <FaSearch /> Search
        </button>
      </div>

      <div className="user-info">
        <div className="contact">
          <span className="phone"></span>
          <span className="email"></span>
        </div>
        <div className="icons">
          <FaUser className="icon" />
          <div className="cart">
            <FaShoppingBag className="icon-s" />
            <span className="cart-count-s"></span>
            <span className="cart-price-s"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBarNew;
