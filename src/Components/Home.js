import React from 'react';
import './Home.css';
import './Product.css';
import Product from './Product';

function Home() {
  const headerTitle = "Categories";

  const products = [
    { id: 1, image: '/images/c17.jpg' },
    { id: 2, image: '/images/c18.jpg' },
    { id: 3, image: '/images/c7.jpg' },
    { id: 4, image: '/images/c1.jpg' },
    { id: 5, image: '/images/c15.jpg' },
    { id: 6, image: '/images/c11.jpg' },
    { id: 7, image: '/images/c13.jpg' },
    { id: 8, image: '/images/c19.jpg' },
  ];

  return (
    <div className="product-container">
      <h2>{headerTitle}</h2>
      <div className="product-grid">
        {products.map(product => (
          <Product 
            key={product.id} 
            image={product.image} 
          />
        ))}
      </div>
    </div>
  );
}

export default Home;
