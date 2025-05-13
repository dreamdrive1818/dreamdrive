import React from "react";
import "./Contact.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faPhoneAlt, faEnvelope } from "@fortawesome/free-solid-svg-icons";

const Contact = () => {
  return (
    <section className="contact-wrapper">
      <div className="contact-grid">
        {/* Left Column: Contact Info */}
        <div className="contact-info-box">
          <h2>Contact Us</h2>
          <p>Feel free to use the form or drop us an email. Old-fashioned phone calls work too.</p>

          <ul className="contact-info-list">
            <li><FontAwesomeIcon icon={faPhoneAlt} /> <span>+91 9876543210</span></li>
            <li><FontAwesomeIcon icon={faEnvelope} /> <span>Dreamdrive1818@gmail.com</span></li>
            <li><FontAwesomeIcon icon={faMapMarkerAlt} /> <span>Ranchi, Jharkhand, Pin - 834001</span></li>
          </ul>
        </div>

        {/* Right Column: Form */}
        <form className="contact-form-box">
          <div className="name-fields">
            <input type="text" placeholder="First" required />
            <input type="text" placeholder="Last" required />
          </div>
          <input type="email" placeholder="example@email.com" required />
          <input type="tel" placeholder="Phone (optional)" />
          <textarea placeholder="Type your message..." rows="5" required></textarea>
          <button type="submit" className="submit-btn">Submit</button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
