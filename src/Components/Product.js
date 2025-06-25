import React from 'react';
import { useNavigate } from "react-router-dom";
import './Product.css';

function Product({ image, name, state }) {

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/categories/${state.slug}`, {
      state: {
          primary_cat_id: state.category_id,
          slug: state.slug,
          name: state.name
      }
    })
  };

  return (
    <div 
    className="product-card-c" 
    onClick={handleClick} 
    style={{ cursor: "pointer" }}
  >
      <img className="product-image-c" src={image} alt="Product" />
      <h3 className="product-name">{name}</h3>
    </div>
  );
}

export default Product;
