import React from "react";
import "./About.css";
import { useLocalContext } from "../../context/LocalContext";

const About = () => {
  const { webinfo } = useLocalContext();

  return (
    <section className="about-us">
      <div className="about-container">
        <div className="about-heading">
          <h2>About Us</h2>
          <p>
            At <strong>{webinfo.name}</strong>, we believe in delivering seamless and affordable car rental solutions to every traveler. Whether you're planning a road trip, exploring a new city, or simply need a ride for your daily errands, we’ve got you covered with a wide fleet and flexible pricing.
          </p>
          <p>
            Founded with a mission to simplify mobility, our platform connects drivers to quality vehicles across major cities in India. With transparency, technology, and trust at the heart of our service, <strong>{webinfo.name}</strong> is your go-to partner on the road.
          </p>
        </div>

        <div className="about-features">
          <div className="feature-box">
            <h4>Wide Fleet</h4>
            <p>
              Choose from sedans, SUVs, hatchbacks, and luxury vehicles — all
              thoroughly inspected and maintained for your safety and comfort.
            </p>
          </div>
          <div className="feature-box">
            <h4>Trusted by Thousands</h4>
            <p>
              We’ve proudly served over 50,000 happy customers, earning
              high ratings for our transparency, support, and punctual service.
            </p>
          </div>
          <div className="feature-box">
            <h4>24/7 Support</h4>
            <p>
              Our dedicated support team is always ready to assist — whether it’s a
              last-minute booking or a late-night query, help is just a call away.
            </p>
          </div>
          <div className="feature-box">
            <h4>Eco-Conscious Approach</h4>
            <p>
              We're committed to sustainability by offering fuel-efficient options
              and working towards introducing electric vehicles in our fleet.
            </p>
          </div>
          <div className="feature-box">
            <h4>Flexible Booking</h4>
            <p>
              Hourly, daily, or weekly — book the way you want with zero hidden charges and complete transparency.
            </p>
          </div>
          <div className="feature-box">
            <h4>Tech-Enabled Experience</h4>
            <p>
              From booking to vehicle handover, everything happens digitally for your ease. Enjoy a paperless, hassle-free rental experience.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
