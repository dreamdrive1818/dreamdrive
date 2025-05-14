import React, { useState } from "react";
import "./Contact.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faPhoneAlt, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { db } from "../../firebase/firebaseConfig";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { toast } from "react-toastify";

const Contact = () => {
  const [formData, setFormData] = useState({
    first: "",
    last: "",
    email: "",
    phone: "",
    message: ""
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "contacts"), {
        ...formData,
        createdAt: Timestamp.now()
      });

      toast.success("Message submitted successfully!");
      setFormData({ first: "", last: "", email: "", phone: "", message: "" });
    } catch (err) {
      console.error("Contact Submit Error:", err.message);
      toast.error("Failed to submit message. Try again later.");
    }
  };

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
        <form className="contact-form-box" onSubmit={handleSubmit}>
          <div className="name-fields">
            <input
              type="text"
              name="first"
              placeholder="First"
              value={formData.first}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="last"
              placeholder="Last"
              value={formData.last}
              onChange={handleChange}
              required
            />
          </div>
          <input
            type="email"
            name="email"
            placeholder="example@email.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone (optional)"
            value={formData.phone}
            onChange={handleChange}
          />
          <textarea
            name="message"
            placeholder="Type your message..."
            rows="5"
            value={formData.message}
            onChange={handleChange}
            required
          />
          <button type="submit" className="submit-btn">Submit</button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
