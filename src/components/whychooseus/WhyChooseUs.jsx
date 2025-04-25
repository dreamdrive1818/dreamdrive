import React from "react";
import "./WhyChooseUs.css";
import { useLocalContext } from "../../context/LocalContext";
import { useNavigate } from "react-router-dom";

const WhyChoose = () => {
  const { webinfo } = useLocalContext();
  const navigate = useNavigate();

  return (
    <section className="why-choose">
      <div className="why-left">
        <h2>Why Choose <br />{webinfo.name}?</h2>
        <p>
          We're not just another car rental service — we're here to make your journey easy, comfortable, and worry-free.<br />
          From quick bookings to clean rides, we've got everything covered so you can hit the road with confidence.
        </p>
        <button onClick={() => navigate('/contact')}>Join the Ride</button>
      </div>

      <div className="why-right">
        <img
          src="https://res.cloudinary.com/dcf3mojai/image/upload/v1745570274/pngtree-3d-blue-car-on-transparent-background-png-image_15295584_edwavm.png"
          alt="Blue Car"
          className="car-img"
        />

        <div className="tag easy-booking">
          <h4>Quick & Easy</h4>
          <p>Book your car in minutes — no hassle, no paperwork.</p>
        </div>

        <div className="tag quality-variety">
          <h4>Clean & Comfortable</h4>
          <p>Choose from well-maintained cars that suit your style and needs.</p>
        </div>

        <div className="tag affordable-rates">
          <h4>No Hidden Costs</h4>
          <p>What you see is what you pay — simple and honest pricing.</p>
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;
