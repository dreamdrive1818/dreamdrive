import React from "react";
import "./Contact.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faPhoneAlt,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";

const Contact = () => {
  return (
    <section className="contact-section">
      <div className="contact-container">
        {/* Left: Contact Info */}
        <div className="contact-info">
          <h2>Get In Touch</h2>
          <p>Have questions or want to work with us? Drop a message below.</p>
          <ul>
            <li>
              <FontAwesomeIcon icon={faMapMarkerAlt} className="contact-icon" />
              <strong> Address:</strong>  123 Main St, Your City
            </li>
            <li>
              <FontAwesomeIcon icon={faPhoneAlt} className="contact-icon" />
              <strong> Phone:</strong>  +91 9876543210
            </li>
            <li>
              <FontAwesomeIcon icon={faEnvelope} className="contact-icon" />
              <strong> Email:</strong>  contact@example.com
            </li>
          </ul>
        </div>

        {/* Right: Contact Form */}
        <form className="contact-form">
          <div className="form-group">
            <input type="text" placeholder="Your Name" required />
          </div>
          <div className="form-group">
            <input type="email" placeholder="Your Email" required />
          </div>
          <div className="form-group">
            <textarea placeholder="Your Message" rows="5" required></textarea>
          </div>
          <button type="submit" className="contact-submit">Send Message</button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
