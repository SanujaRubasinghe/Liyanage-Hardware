import React, { useState, useEffect } from 'react';
import './Home.css'; 
import './Product.css'; 
import Product from './Product';


function Home() {
    const handleBuyClick = (productName) => {}
    
    const products = [
        { name: '', price: '', image: '/images/c17.jpg' },
        { name: '', price: '', image: '/images/c18.jpg' },
        { name: '', price: '', image: '/images/c7.jpg' },
        { name: '', price: '', image: '/images/c1.jpg' },
        { name: '', price: '', image: '/images/c15.jpg' },
        { name: '', price: '', image: '/images/c11.jpg' },
        { name: '', price: '', image: '/images/c13.jpg' },
        { name: '', price: '', image: '/images/c19.jpg' },
      
    ];

    return (
        <div>
            
            <div className="product-grid">
                {products.map((product, index) => (
                    <Product 
                        key={index}
                        name={product.name}
                        price={product.price}
                        image={product.image}
                        onBuyClick={() => handleBuyClick(product.name)} // Pass handleBuyClick as a prop
                    />
                ))}
            </div>
        </div>
    );
}

export default Home;