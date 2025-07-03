import React from "react";
import "./WhyChooseUs.css";
import { useLocalContext } from "../../context/LocalContext";
import { useNavigate } from "react-router-dom";
import AnimateOnScroll from "../../assets/Animation/AnimateOnScroll";

const WhyChoose = () => {
  const { webinfo } = useLocalContext();
  const navigate = useNavigate();

  return (
    <section className="why-choose">
      <AnimateOnScroll className="why-left delay-2">
        <h2>Why Choose <br />{webinfo.name}?</h2>
        <p>
          We're not just another car rental service — we're here to make your journey easy, comfortable, and worry-free.<br />
          From quick bookings to clean rides, we've got everything covered so you can hit the road with confidence.
        </p>
        <button onClick={() => navigate('/contact')}>Join the Ride</button>
      </AnimateOnScroll>

      <AnimateOnScroll className="why-right delay-3">
        <img
          src="https://res.cloudinary.com/dcrfks1tq/image/upload/v1750163087/jeep_smrjsp.png"
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
      </AnimateOnScroll>
    </section>
  );
};

export default WhyChoose;
