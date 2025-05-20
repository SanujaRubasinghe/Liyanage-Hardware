import React from "react";
import "./AboutUsNew.css";

const AboutUsNew = () => (
  <div className="aboutus-container">
    {/* Hero Section */}
    <div className="hero-section">
      <div className="hero-overlay">
        <h1>
          OUR SIMPLE, NO FRILLS,<br />
          APPROACH MEANS BIG SAVINGS<br />
          ON BUILDING MATERIALS
        </h1>
      </div>
    </div>

    {/* About Us Section */}
    <section className="about-section">
      <div className="about-text">
        <h2>ABOUT US</h2>
        <p>
          <b>Contractors' Warehouse</b> opened in 1983 to serve a growing need for home improvement products. Over the years, we've grown to become a California destination for building materials and supplies serving new construction, remodeling, and home improvements projects for contractors, tradesmen and DIY customers. With 14 store locations across California, we focus on providing a wide selection of in-stock products at great prices, to ensure you can start building today. We were previously known as HD Supply HIS.
        </p>
        <div className="supplier-partner">
          <span>INTERESTED IN BECOMING A SUPPLIER PARTNER?</span>
          <button>LEARN MORE</button>
        </div>
      </div>
      <div className="about-image">
        <img src="/images/view.jpg" alt="About Us" />
      </div>
    </section>

    {/* Top 5 Reasons */}
    <section className="reasons-section">
      <h2>
        TOP 5 REASONS <span>TO SHOP WITH US</span>
      </h2>
      <div className="reasons-list">
        <div>
          <span>01</span>
          <h3>LOWEST PRICES</h3>
          <p>We buy direct and operate efficiently with a no-frills approach, then we share the savings with you.</p>
        </div>
        <div>
          <span>02</span>
          <h3>IN STOCK, TODAY!</h3>
          <p>With our massive in-store selection of supplies and materials, you can start and complete your home improvement projects today.</p>
        </div>
        <div>
          <span>03</span>
          <h3>WE CARE</h3>
          <p>Our managers and associates want to get to know you, to understand your project needs, and earn your business.</p>
        </div>
        <div>
          <span>04</span>
          <h3>PRODUCTS YOU WANT</h3>
          <p>We listen to our customers and source the products needed for your projects to meet local codes and regulations.</p>
        </div>
        <div>
          <span>05</span>
          <h3>WE REWARD YOU</h3>
          <p>Our CBC program rewards our loyal customers with quarterly cash rebates, special discounts, and more great benefits!</p>
        </div>
      </div>
    </section>

    {/* Features Grid */}
    <section className="features-grid">
      <div>
        <h4>CUSTOMERS FIRST</h4>
        <img src="/images/A.jpg" alt="Customers First" />
      </div>
      <div>
        <h4>DELIVERY</h4>
        <img src="/images/B.jpg" alt="Delivery" />
      </div>
      <div>
        <h4>SPECIAL ORDERS</h4>
        <img src="/images/C.jpg" alt="Special Orders" />
      </div>
      <div>
        <h4>WILL CALL</h4>
        <img src="/images/D.jpg" alt="Will Call" />
      </div>
      <div>
        <h4>CBC PROGRAM</h4>
         <img src="/images/E.jpg" alt="Will Call" />
      </div>
      <div>
        <h4>EMPLOYMENT</h4>
        <img src="/images/F.jpg" alt="Will Call" />
        
      </div>
      <div>
        <h4>MILITARY DISCOUNT</h4>
        <img src="/images/G.jpg" alt="Military Discount" />
      </div>
      <div>
        <h4>PRICE MATCH</h4>
        <img src="/images/H.jpg" alt="Price Match" />
      </div>
      <div>
        <h4>RETURN POLICY</h4>
        <img src="/images/I.jpg" alt="Return Policy" />
      </div>
    </section>

    {/* Newsletter Signup */}
    <aside className="newsletter-signup">
      <h3>Don't miss out!</h3>
      <p>Sign Up For Deals, Discounts & News!</p>
      <form>
        <input type="text" placeholder="First Name" />
        <input type="text" placeholder="Last Name" />
        <input type="email" placeholder="Email" />
        <select>
          <option>Please Select</option>
          <option>Store 1</option>
          <option>Store 2</option>
        </select>
        <button type="submit">SUBSCRIBE</button>
      </form>
    </aside>
  </div>
);

export default AboutUsNew; 