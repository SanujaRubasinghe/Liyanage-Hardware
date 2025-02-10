import React, { useState, useEffect } from 'react';
import './Home.css'; 
import './Product.css'; 
import Product from './Product';


function Home() {
    const handleBuyClick = (productName) => {}
    
    const products = [
        { name: '', price: '', image: '/images/10.jpg' },
        { name: '', price: '', image: '/images/8.jpg' },
        { name: '', price: '', image: '/images/9.jpg' },
        { name: '', price: '', image: '/images/12.jpg' },
        { name: '', price: '', image: '/images/10.jpg' },
      
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