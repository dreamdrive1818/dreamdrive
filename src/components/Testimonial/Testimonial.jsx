import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "./Testimonial.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import { useTestimonialContext } from "../../context/TestimonialContext";

const Testimonial = () => {
  const location = useLocation();
  const { testimonials, submitTestimonial } = useTestimonialContext();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    message: "",
    rating: 0
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleRating = (value) => {
    setFormData((prev) => ({
      ...prev,
      rating: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.rating === 0) {
      return alert("Please select a rating before submitting");
    }
    await submitTestimonial(formData);
    setFormData({ name: "", message: "", rating: 0 });
    setShowModal(false); // close modal after submit
  };

  return (
    <section className={`testimonial-section ${location.pathname === "/testimonial" ? "full-height" : ""}`}>
      <h2>What Our Customers Say</h2>
      <div className="testimonial-grid">
        {/* testimonial list */}
        <div className="testimonial-list">
          {testimonials.length > 0 ? (
            testimonials.map((item) => (
              <div className="testimonial-card" key={item.id}>
                <div className="testimonial-rating">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FontAwesomeIcon
                      key={i}
                      icon={i < item.rating ? solidStar : regularStar}
                      className="star"
                    />
                  ))}
                </div>
                <p className="testimonial-message">"{item.message}"</p>
                <h4 className="testimonial-name">- {item.name}</h4>
              </div>
            ))
          ) : (
            <p>No approved testimonials yet.</p>
          )}
        </div>

        {/* only show button on /testimonial */}
        {location.pathname === "/testimonial" && (
          <div className="testimonial-button-wrapper">
            <button
              className="open-modal-btn"
              onClick={() => setShowModal(true)}
            >
              Leave a Testimonial
            </button>
          </div>
        )}
      </div>

      {/* only show modal on /testimonial */}
      {location.pathname === "/testimonial" && showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <h3>Leave a Testimonial</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <textarea
                name="message"
                placeholder="Your Message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
              <div className="rating-input">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FontAwesomeIcon
                    key={i}
                    icon={i < formData.rating ? solidStar : regularStar}
                    className="star"
                    onClick={() => handleRating(i + 1)}
                  />
                ))}
              </div>
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Testimonial;
