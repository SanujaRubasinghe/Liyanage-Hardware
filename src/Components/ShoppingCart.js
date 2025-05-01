import React from 'react';
import { useCart } from './CartContext';
import './ShoppingCart.css';

const ShoppingCart = () => {
  const { cartItems, updateQuantity, removeItem } = useCart();
  const subtotal = cartItems.reduce((sum, item) => sum + item[0].price * item.quantity, 0);
  const total = subtotal;

  return (
    <div className='cart-fullscreen'>
    <div className="cart-container">
      <div className="cart-left">
        <h2>Shopping Cart</h2>
        <p>{cartItems.length} Items</p>
        <div className="cart-items">
          {cartItems.map(item => (
            <div className="cart-item" key={item.id}>
              <img src={item.image} alt={item.name} />
              <div className="item-details">
                <h4>{item.name}</h4>
                <p>PS4</p>
                <button onClick={() => removeItem(item.id)}>Remove</button>
              </div>
              <div className="item-quantity">
                <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, 1)}>+</button>
              </div>
              <div className="item-price">
                <p>Rs.{item[0].price}</p>
                <p>Rs.{(item[0].price * item.quantity)}</p>
              </div>
            </div>
          ))}
        </div>
        <a href="/" className="continue-shopping">← Continue Shopping</a>
      </div>

      <div className="cart-right">
        <h3>Order Summary</h3>
        <div className="summary-row">
          <span>Items {cartItems.length}</span>
          <span>Rs.{subtotal}</span>
        </div>
        <div className="promo-code">
          <label>Promo Code</label>
          <input type="text" placeholder="Enter your code" />
          <button>Apply</button>
        </div>
        <div className="summary-total">
          <span>Total Cost</span>
          <span>Rs.{total}</span>
        </div>
        <button className="checkout-btn">Checkout</button>
      </div>
    </div>
    </div>
  );
};

export default ShoppingCart;
