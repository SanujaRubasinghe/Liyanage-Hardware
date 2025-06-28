import React from "react";
import "./AboutUsNew.css";

const cardDetails = [
  { title: "CUSTOMERS FIRST", img: "/images/A.jpg", description: "We always prioritize our customers' needs and satisfaction." },
  { title: "DELIVERY", img: "/images/B.jpg", description: "Fast and reliable delivery service to your job site or home." },
  { title: "SPECIAL ORDERS", img: "/images/C.jpg", description: "Need something unique? We handle special orders with ease." },
  { title: "WILL CALL", img: "/images/D.jpg", description: "Order ahead and pick up at your convenience with Will Call." },
  { title: "CBC PROGRAM", img: "/images/E.jpg", description: "Our CBC loyalty program rewards you with great benefits." },
  { title: "EMPLOYMENT", img: "/images/F.jpg", description: "Join our team and build your future with us." },
  { title: "MILITARY DISCOUNT", img: "/images/G.jpg", description: "Exclusive discounts to honor our military personnel." },
  { title: "PRICE MATCH", img: "/images/H.jpg", description: "We match competitor pricing to give you the best deal." },
  { title: "RETURN POLICY", img: "/images/I.jpg", description: "Hassle-free returns to keep your projects moving smoothly." },
];

const AboutUsNew = () => {
  return (
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
          {[
            { num: "01", title: "LOWEST PRICES", text: "We buy direct and operate efficiently with a no-frills approach, then we share the savings with you." },
            { num: "02", title: "IN STOCK, TODAY!", text: "With our massive in-store selection of supplies and materials, you can start and complete your home improvement projects today." },
            { num: "03", title: "WE CARE", text: "Our managers and associates want to get to know you, to understand your project needs, and earn your business." },
            { num: "04", title: "PRODUCTS YOU WANT", text: "We listen to our customers and source the products needed for your projects to meet local codes and regulations." },
            { num: "05", title: "WE REWARD YOU", text: "Our CBC program rewards our loyal customers with quarterly cash rebates, special discounts, and more great benefits!" },
          ].map(({ num, title, text }) => (
            <div className="reason-card" key={num}>
              <div className="reason-number">{num}</div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
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

      {/* Features Grid with Flip */}
      <section className="features-grid">
        {cardDetails.map((item, index) => (
          <div className="flip-card" key={index}>
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <h4>{item.title}</h4>
                <img src={item.img} alt={item.title} />
              </div>
              <div className="flip-card-back">
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default AboutUsNew;
