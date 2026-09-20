// src/components/ContactUs.jsx
import React from 'react';
import styles from './ContactUsA.module.css';
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt } from 'react-icons/fa';


export default function ContactUs() {
  return (
    <div className={styles.contactPage}>
      <main>
        <h1 className={styles.pageTitle}>Contact Us</h1>

        <div className={styles.contactContainer}>
          {/* Info Cards */}
          <section className={styles.contactInfo}>
            <div className={styles.infoCard}>
              <FaMapMarkerAlt className={styles.infoIcon} />
              <h3 className={styles.cardTitle}>Visit Us</h3>
              <p className={styles.cardText}>
                  New Liyanage Hardware Ltd
                  Galwana junction, Angoda.
                </p>
            </div>
            <div className={styles.infoCard}>
              <FaEnvelope className={styles.infoIcon} />
              <h3 className={styles.cardTitle}>Email Us</h3>
              <p className={styles.cardText}>
                newliyanage@gmail.com
              </p>
            </div>
            <div className={styles.infoCard}>
              <FaPhoneAlt className={styles.infoIcon} />
              <h3 className={styles.cardTitle}>Call Us</h3>
              <p className={styles.cardText}>
                Tele: 072211324 / 0754232212 - Mon – Fri, 8 am – 5 pm



              </p>
            </div>
          </section>
        </div>

        {/* Map */}
        <section className={styles.mapSection}>
          <iframe
            className={styles.mapIframe}
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d131803.4918072042!2d79.74031033425226!3d6.935884427392453!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae25770dd3147db%3A0xfa648fb21f073810!2sNew%20Liyanage%20Hardware!5e1!3m2!1sen!2slk!4v1751210645818!5m2!1sen!2slk"
            allowFullScreen
            loading="lazy"
            title="Singha Security Location"
          />
        </section>
      </main>
    </div>
  );
}
