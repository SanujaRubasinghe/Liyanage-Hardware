import React, { useState, useEffect } from 'react';
import './Home.css'; 
import './Product.css'; 
import Product from './Product';


function Home() {
    const handleBuyClick = (productName) => {}
    
    const products = [
        { name: 'Product 1', price: '$10', image: '/images/10.jpg' },
        { name: 'Product 2', price: '$15', image: '/images/8.jpg' },
        { name: 'Product 3', price: '$20', image: '/images/9.jpg' },
        { name: 'Product 4', price: '$25', image: '/images/12.jpg' },
        { name: 'Product 5', price: '$30', image: '/images/10.jpg' },
        { name: 'Product 5', price: '$30', image: '/images/9.jpg' },
        { name: 'Product 5', price: '$30', image: '/images/8.jpg' },
        { name: 'Product 5', price: '$30', image: '/images/12.jpg' },
        { name: 'Product 5', price: '$30', image: '/images/13.jpg' },
        { name: 'Product 5', price: '$30', image: '/images/14.jpg' },
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