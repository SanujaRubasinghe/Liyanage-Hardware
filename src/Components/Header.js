import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header-container">
      <img 
        src="/images/1.jpg"  // Update this path to your image
        alt="Website Header"
        className="header-image"
      />
    </header>
  );
};

export default Header;