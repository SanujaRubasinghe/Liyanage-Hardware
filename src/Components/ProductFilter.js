import React, { useState } from 'react';
import './ProductFilter.css'

const ProductFilter = ({ onFilter }) => {
    const [category, setCategory] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [deliveryArea, setDeliveryArea] = useState('');

    const handleFilter = () => {
        onFilter({ category, minPrice, maxPrice, deliveryArea });
    };

    return (
        <div className="filterContainer">
            <input 
                type="text" 
                placeholder="Delivery Area" 
                value={deliveryArea} 
                onChange={(e) => setDeliveryArea(e.target.value)} 
                className="filterInput"
            />
            <input 
                type="text" 
                placeholder="Category" 
                value={category} 
                onChange={(e) => setCategory(e.target.value)} 
                className="filterInput"
            />
            <input 
                type="number" 
                placeholder="Min Price" 
                value={minPrice} 
                onChange={(e) => setMinPrice(e.target.value)} 
                className="filterInput"
            />
            <input 
                type="number" 
                placeholder="Max Price" 
                value={maxPrice} 
                onChange={(e) => setMaxPrice(e.target.value)} 
                className="filterInput"
            />
            <button 
                onClick={handleFilter} 
                className="filterBtn"
            >
                Apply Filter
            </button>
        </div>
    );
};

export default ProductFilter;
