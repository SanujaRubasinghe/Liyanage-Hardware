import React from 'react';
import './PromoCards.css';

const PromoCards = () => {
  return (
    <div className="promo-container">
      <div className="promo-card red-card">
        <h2>New Liyanage<br /><strong>New Prices</strong></h2>
        <p>Get what you need for <span className="highlight">less</span></p>
        <button>Shop now & save!</button>
      </div>

      <div className="promo-card yellow-card">
        {/* <h3>It pays to refer</h3>
        <p><strong>Get 20% OFF</strong><br />for you and your friend.</p> */}
        <button>See offers</button>
      </div>

      <div className="promo-card orange-card">
        {/* <h3>Want more from a trade account?</h3>
        <p>Get <strong>Xtra</strong> with <strong>TradeXtra</strong><br />exclusive to the trade.</p> */}
        <button>Find out more</button>
      </div>
    </div>
  );
};

export default PromoCards;
