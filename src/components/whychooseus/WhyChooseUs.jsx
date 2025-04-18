import React from "react";
import "./WhyChooseUs.css";
import { useLocalContext } from "../../context/LocalContext";

const WhyChoose = () => {

    const { webinfo } = useLocalContext();

  return (
    <section className="why-choose">
      <div className="why-left">
        <h2>Why Choose <br />{webinfo.name}?</h2>
        <p>
          Join our satisfied customers<br />
          who trust us for their journeys.<br />
          We serve with a lot of values<br />
          that you can feel directly.
        </p>
        <button>Join Us</button>
      </div>

      <div className="why-right">
        <img src="https://png.pngtree.com/png-clipart/20240610/original/pngtree-3d-blue-car-on-transparent-background-png-image_15295584.png" alt="Red Car" className="car-img" />

        <div className="tag easy-booking">
          <h4>Easy Booking</h4>
          <p>Reserve your car in just a few clicks.</p>
        </div>

        <div className="tag quality-variety">
          <h4>Quality & Variety</h4>
          <p>Explore our diverse range of premium vehicles.</p>
        </div>

        <div className="tag affordable-rates">
          <h4>Affordable Rates</h4>
          <p>Enjoy competitive prices without hidden fees.</p>
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;
