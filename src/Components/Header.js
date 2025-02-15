import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header-container-h">
      <img 
        src="/images/n3.png"  // Update this path to your image
        alt="Website Header"
        className="header-image"
      />
    </header>
  );
};

export default Header;