// src/components/ContactUs.jsx
import React from 'react';
import './ContactUsA.css';
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt, FaChevronUp } from 'react-icons/fa';

export default function ContactUs() {
  return (
    <div className="contact-page">
      <main>
        <h1 className="page-title">Contact Us</h1>

        <div className="contact-container">
          {/* Info Cards */}
          <section className="contact-info">
            <div className="info-card">
              <FaMapMarkerAlt className="info-icon" />
              <h3>Visit Us</h3>
              <p>6/3B, Rathnapura Rd., Ilimba Junction, Munagama, Horana.</p>
            </div>
            <div className="info-card">
              <FaEnvelope className="info-icon" />
              <h3>Email Us</h3>
              <p>info.singhasec@gmail.com</p>
            </div>
            <div className="info-card">
              <FaPhoneAlt className="info-icon" />
              <h3>Call Us</h3>
              <p>Always On – 24/7, 365 Days</p>
              <p>071 982 9694 / 074 150 6033</p>
            </div>
          </section>

          {/* Contact Form */}
          <section className="contact-form-section">
            <h2>Get in Touch</h2>
            <form
              className="contact-form"
              action="https://api.web3forms.com/submit"
              method="post"
            >
              <input type="hidden" name="access_key" value="acd0a3e8-78d8-41bf-98a2-661ff0ebb4de" />
              <input type="hidden" name="subject" value="Web Inquiry" />

              <div className="form-row">
                <input type="text" name="First Name" placeholder="First Name" required />
                <input type="text" name="Last Name" placeholder="Last Name" required />
              </div>
              <div className="form-row">
                <input type="text" name="Company Name" placeholder="Company Name" />
                <input type="email" name="Email" placeholder="Email" required />
              </div>
              <input type="tel" name="Phone Number" placeholder="Phone Number" required />
              <textarea name="Message" placeholder="Message" rows="5" required />

              <button type="submit" className="submit-btn">Send Message</button>
            </form>
          </section>
        </div>

        {/* Map */}
        <section className="map-section">
          <iframe
            className="map-iframe"
            src="https://www.google.com/maps?q=6.7242575984408814,80.09123018996549&z=15&output=embed"
            allowFullScreen
            loading="lazy"
            title="Singha Security Location"
          />
        </section>
      </main>

      {/* Scroll To Top */}
      <button className="scroll-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <FaChevronUp />
      </button>
    </div>
  );
}
