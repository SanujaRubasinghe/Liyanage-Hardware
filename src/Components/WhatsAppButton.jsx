'use client';
import React from 'react';
import './WhatsAppButton.css';

export default function WhatsAppButton() {
  const phoneNumber = '9472211324';
  const defaultMessage = encodeURIComponent('Hello! I would like to inquire about products at New Liyanage Hardware.');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${defaultMessage}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float-btn"
      aria-label="Chat on WhatsApp"
    >
      <i className="fab fa-whatsapp whatsapp-icon"></i>
      <span className="whatsapp-tooltip">Chat with us</span>
    </a>
  );
}
