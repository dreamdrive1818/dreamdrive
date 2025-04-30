import React from "react";
import "./Contact.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faPhoneAlt,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { useLocalContext } from "../../context/LocalContext";

const Contact = () => {
  const { Goto } = useLocalContext();

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
              <strong> Address:</strong> <span>Ranchi, Jharkhand, Pin - 834001</span>
            </li>
            <li>
              <FontAwesomeIcon icon={faPhoneAlt} className="contact-icon" />
              <strong> Phone:</strong> <span>+91 9876543210</span>
            </li>
            <li>
              <FontAwesomeIcon icon={faEnvelope} className="contact-icon" />
              <strong> Email:</strong> <span>Dreamdrive1818@gmail.com</span>
            </li>
          </ul>

          {/* Booking Button */}
          <a onClick={Goto} className="book-now-btn">Book Now</a>

          {/* QR Code */}
          <div className="qr-section">
            <p>Or scan to fill the consent form:</p>
            <img src='https://res.cloudinary.com/dcf3mojai/image/upload/v1745951636/60040252249_CONSENTFORMFORCARHIRE_1_nmlbib.png' alt="Consent Form QR" className="qr-code" />
          </div>
        </div>

        {/* Right: Contact Form */}
        <form className="contact-form">
          <h2> Or Write Your Message below:</h2>
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
