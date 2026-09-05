import React from 'react';
import { useCart } from './CartContext';
import { useNavigate, Link } from 'react-router-dom';
import './ShoppingCart.css';

const ShoppingCart = () => {
  const { cartItems, updateQuantity, removeItem } = useCart();
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal;
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate("/buying", {
      state: {
        cartItems: cartItems.map(item => ({
          product_id: item.product_id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.images[0],
          delivery_available: item.delivery_available,
          cod_only: item.only_cod,
          colombo_only: item.only_colombo
        }))
      },
    });
  };

  const hasColomboOnlyItems = cartItems.some(item => item.only_colombo);

  return (
    <div className="cart-fullscreen">
      <div className="cart-container">
        <div className="cart-left">
          <div className="cart-header">
            <h2>Your Cart</h2>
            <p>{cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}</p>
          </div>

          {hasColomboOnlyItems && (
            <div className="colombo-warning-message">
              ⚠️ Some items in your cart are <strong>only deliverable within Colombo</strong>. You can still proceed, but delivery may be restricted based on your address.
            </div>
          )}

          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <p>Your cart is empty</p>
              <Link to="/products" className='continue-shopping'>← Continue Shopping</Link>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cartItems.map(item => (
                  <div className={`cart-item ${item.only_colombo ? 'colombo-only-highlight' : ''}`} key={item.product_id}>
                    <img 
                      src={`${process.env.REACT_APP_API_BASE_URL}/${item.images[0]}`} 
                      alt={item.name} 
                      loading="lazy"
                    />
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      <p className="item-sku">{item.sku}</p>
                      {Boolean(item.only_colombo) && (
                        <p className="colombo-only-text">📍 Delivery within Colombo only</p>
                      )}
                      <p className="item-price-mobile">Rs. {item.price * item.quantity}</p>
                      <div className="item-actions">
                        <div className="item-quantity">
                          <button 
                            onClick={() => updateQuantity(item.product_id, -1)} 
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span>{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.product_id, 1)} 
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <button 
                          onClick={() => removeItem(item.product_id)} 
                          className="remove-btn"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/products" className='continue-shopping'>← Continue Shopping</Link>
            </>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-right">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>Rs. {subtotal}</span>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>Rs. {total}</span>
            </div>
            <button 
              className="checkout-btn" 
              onClick={handleCheckout}
              aria-label="Proceed to checkout"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;
