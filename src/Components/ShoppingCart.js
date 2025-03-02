import React from 'react';
import { useCart } from './CartContext'; // Import useCart from CartContext
import './ShoppingCart.css';

const ShoppingCart = () => {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity } = useCart(); // Get cart state and functions from context

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div className="shopping-container">
      <div className="product-list">
        {cart.map((item) => (
          <div key={item.id} className="product">
            <img src={item.image} alt={item.name} className="product-img" />
            <h3>{item.name}</h3>
            <p>Size: {item.size}</p>
            <p>Color: {item.color}</p>
            <p>
              <strong>Rs. {item.price.toFixed(2)}</strong>
            </p>
            <div className="cart-controls">
              <button onClick={() => decreaseQuantity(item.id)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => increaseQuantity(item.id)}>+</button>
              <button onClick={() => removeFromCart(item.id)} className="remove-btn">
                ×
              </button>
            </div>
          </div>
        ))}
      </div>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="cart-total">
          <h3>Subtotal: Rs. {calculateTotal().toFixed(2)}</h3>
          <button className="checkout-btn">Checkout</button>
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;
