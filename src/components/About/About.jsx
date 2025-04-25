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
            At <strong>{webinfo.name}</strong>, we're a passionate team committed to redefining car rentals with comfort, transparency, and technology. Though we’re just 6 months into our journey, our focus on customer satisfaction and seamless experiences sets us apart.
          </p>
          <p>
            Starting with a vision to simplify mobility for everyone, we’ve already helped hundreds of travelers get on the road with ease. Our growing platform connects drivers to well-maintained vehicles, blending trust and digital convenience to deliver a modern rental solution.
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
            <h4>Growing Trust</h4>
            <p>
              In just a few months, we’ve earned the trust of hundreds of happy customers through our reliable service and transparent practices.
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
