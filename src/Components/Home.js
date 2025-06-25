import React, { useEffect, useState } from 'react';
import './Home.css';
import './Product.css';
import Product from './Product';
import { toast } from 'react-toastify';
import API from '../api';
import useTrackPageVisit from '../hooks/useTrackPageVisit';

function Home() {
  // useTrackPageVisit()
  const [mainCategories, setMainCategories] = useState([])

  useEffect(() => {
    const fetchPrimaryCategories = async () => {
        try {
            const response = await API.get('/categories/primary')
            setMainCategories(response.data.categories)
        } catch (error) {
            toast.error('Failed to get categories')
        }
    }
    fetchPrimaryCategories()
  }, [])

  

  const products = [
    { id: 1, image: '/images/c21.jpg' ,name: 'Category 1' },
    { id: 2, image: '/images/c18.jpg' ,name: 'Category 2' },
    { id: 3, image: '/images/c7.jpg' ,name: 'Category 3'},
    { id: 4, image: '/images/c1.jpg' ,name: 'Category 4'},
    { id: 5, image: '/images/c15.jpg' ,name: 'Category 5'},
    { id: 6, image: '/images/c11.jpg' ,name: 'Category 6'},
    { id: 7, image: '/images/c13.jpg' ,name: 'Category 7'},
    { id: 8, image: '/images/c19.jpg' ,name: 'Category 8'},
  ];

  return (
    <div className="product-container">
      <h2>
        <span className="blue-text">Our</span>{' '}
        <span className="red-text">Categories</span>
      </h2>
      <div className="product-grid">
        {mainCategories.map(cat => (
          <Product 
            key={cat.category_id} 
            image={`${process.env.REACT_APP_API_BASE_URL}${cat.thumbnail}`} 
            name={cat.name}
            state={{category_id: cat.category_id, slug: cat.slug, name: cat.name}}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;
