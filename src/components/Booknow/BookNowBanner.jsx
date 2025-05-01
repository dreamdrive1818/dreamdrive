import React from "react";
import "./BookNowBanner.css";
import { useLocalContext } from "../../context/LocalContext";

const BookNowBanner = () => {

  const {handleNavigation} = useLocalContext();

  return (
    <section className="book-parallax-banner">
      <div className="book-parallax-content">
        <h2>Start Your Journey Today</h2>
        <p>Drive into the horizon with luxury and reliability at your fingertips.</p>
        <button onClick={handleNavigation} className="book-parallax-button">Book Now</button>
      </div>
    </section>
  );
};

export default BookNowBanner;
