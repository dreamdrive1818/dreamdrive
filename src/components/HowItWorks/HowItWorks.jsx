import React from "react";
import "./HowItWorks.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHandPointer,
  faCalendarCheck,
  faPenNib,
  faCarOn,
  faCarSide,
  faIndianRupeeSign,
} from "@fortawesome/free-solid-svg-icons";
import BookNowBanner from "../Booknow/BookNowBanner";

const steps = [
  {
    title: "Select",
    description: "Choose your desired car from our fleet.",
    icon: faHandPointer,
  },
  {
    title: "Book & Pay",
    description: "Reserve your car and pay securely online.",
    icon: faIndianRupeeSign,
    highlight: true,
  },
  {
    title: "Sign Consent",
    description: "Consent form will be emailed. Sign it digitally.",
    icon: faPenNib,
  },
  {
    title: "Drive",
    description: "Pick up your car and hit the road.",
    icon: faCarOn,
    highlight: true,
  },
  {
    title: "Return",
    description: "Bring the car back at the end of your rental period.",
    icon: faCarSide,
  },
];

const HowItWorks = () => {
  return (
    <>
    <section className="how-it-works">
      <h4 className="sub-heading">HOW IT WORKS</h4>
      <h2 className="main-heading">Simple Steps to Get the Car</h2>
      <div className="steps-container">
        <div className="vertical-line"></div>
        {steps.map((step, index) => (
          <div key={index} className={`step-block ${step.highlight ? "active" : ""}`}>
            <div className="step-circle" />
            <div className="step-content reveal-bottom">
              <div className="step-icon">
                <FontAwesomeIcon icon={step.icon} />
              </div>
              <div className="step-text">
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
    <BookNowBanner />
    </>
  );
};

export default HowItWorks;
