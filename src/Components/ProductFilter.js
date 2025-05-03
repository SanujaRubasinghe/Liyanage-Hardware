import React, { useState } from 'react';
import API from '../api';
import './ProductFilter.css'

const ProductFilter = ({ setProducts }) => {
    const [filters, setFilters] = useState({
        category: '',
        minPrice: '',
        maxPrice: '',
        deliveryArea: '',
    });


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const fetchProducts = async (filters) => {
        try {
            const response = await API.post('/product/filter', filters);
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleFilter = () => {
        fetchProducts(filters);
    };

    const handleReset = () => {
        const resetFilters = {
            category: '',
            minPrice: '',
            maxPrice: '',
            deliveryArea: '',
        };
        setFilters(resetFilters);
        fetchProducts(resetFilters); // Fetch all products
    };

    return (
        <div className="filterContainer">
            <input 
                type="text" 
                placeholder="Delivery Area" 
                value={filters.deliveryArea} 
                onChange={handleChange} 
                className="filterInput"
            />
            <input 
                type="text" 
                placeholder="Category" 
                value={filters.category} 
                onChange={handleChange} 
                className="filterInput"
            />
            <input 
                type="number" 
                placeholder="Min Price" 
                value={filters.minPrice} 
                onChange={handleChange} 
                className="filterInput"
            />
            <input 
                type="number" 
                placeholder="Max Price" 
                value={filters.maxPrice} 
                onChange={handleChange} 
                className="filterInput"
            />
            <button 
                onClick={handleFilter} 
                className="filterBtn"
            >
                Apply Filter
            </button>
            <button onClick={handleReset}>Reset Filter</button>
        </div>
    );
};

export default ProductFilter;
