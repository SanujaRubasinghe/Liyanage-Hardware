import React from 'react';
import './Home.css';
import './Product.css';
import Product from './Product';

function Home() {
  const products = [
    { id: 1, image: '/images/c21.jpg' ,name: 'Laptops' },
    { id: 2, image: '/images/c18.jpg' ,name: 'Laptops' },
    { id: 3, image: '/images/c7.jpg' ,name: 'Laptops'},
    { id: 4, image: '/images/c1.jpg' ,name: 'Laptops'},
    { id: 5, image: '/images/c15.jpg' ,name: 'Laptops'},
    { id: 6, image: '/images/c11.jpg' ,name: 'Laptops'},
    { id: 7, image: '/images/c13.jpg' ,name: 'Laptops'},
    { id: 8, image: '/images/c19.jpg' ,name: 'Laptops'},
  ];

  return (
    <div className="product-container">
      <h2>
        <span className="blue-text">Our</span>{' '}
        <span className="red-text">Categories</span>
      </h2>
      <div className="product-grid">
        {products.map(product => (
          <Product 
            key={product.id} 
            image={product.image} 
            name={product.name}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;
