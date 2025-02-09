import React, { useState, useEffect } from 'react';
import './Home.css'; 
import './Product.css'; 
import Product from './Product'; 

function Home() {
    const images = [
        '/images/img1.jpg', 
        '/images/img2.jpg',
        '/images/img3.jpg',
    ];

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Automatically change image every 1.7 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) =>
                prevIndex === images.length - 1 ? 0 : prevIndex + 1
            );
        }, 1700); // Change image every 1.7 seconds

        return () => clearInterval(interval); // Cleanup the interval on component unmount
    }, [images.length]);

    // Handle Buy Now button click
    const handleBuyClick = (productName) => {
        alert(`You clicked "Buy Now" for ${productName}`);
    };

    const products = [
        { name: 'Product 1', price: '$10', image: '/images/product1.jpg' },
        { name: 'Product 2', price: '$15', image: '/images/product2.jpg' },
        { name: 'Product 3', price: '$20', image: '/images/product3.jpg' },
        { name: 'Product 4', price: '$25', image: '/images/product4.jpg' },
        { name: 'Product 5', price: '$30', image: '/images/product5.jpg' },
    ];

    return (
        <div>
            <div className="carousel-container">
                <div className="carousel" style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}>
                    {images.map((image, index) => (
                        <div key={index} className="carousel-image">
                            <img src={image} alt={`Slide ${index}`} />
                        </div>
                    ))}
                </div>
                
                <button className="carousel-button prev" onClick={() => setCurrentImageIndex((prevIndex) => prevIndex === 0 ? images.length - 1 : prevIndex - 1)}>&#8592;</button>
                <button className="carousel-button next" onClick={() => setCurrentImageIndex((prevIndex) => prevIndex === images.length - 1 ? 0 : prevIndex + 1)}>&#8594;</button>
            </div>

            
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