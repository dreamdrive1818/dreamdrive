import React from "react";
import "./About.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCarSide,
  faUserFriends,
  faShieldAlt,
  faMobileAlt,
} from "@fortawesome/free-solid-svg-icons";
import Achievements from "../Achievements/Achievements";
import AnimateOnScroll from "../../assets/Animation/AnimateOnScroll";

const highlights = [
  {
    icon: faCarSide,
    title: "Premium Fleet",
    desc: "Compact to luxury cars — clean, serviced, and road-ready.",
  },
  {
    icon: faUserFriends,
    title: "Rent or Self-Drive",
    desc: "Drive yourself or hire a pro — the choice is yours.",
  },
  {
    icon: faShieldAlt,
    title: "Fully Insured",
    desc: "Every ride is protected for your peace of mind.",
  },
  {
    icon: faMobileAlt,
    title: "Digital Booking",
    desc: "Book and manage everything from your phone.",
  },
];


const About = () => {
  return (
    <>
    <section className="about-container">
      <div className="about-content">
        {/* INTRO */}
        <AnimateOnScroll className="about-intro">
          <h2>About <span>DreamDrive</span></h2>
          <p>
            DreamDrive is not just a car rental company — it's your companion for freedom on the road.
            Whether you're heading out for a business meeting, a weekend adventure, or just exploring the city,
            we provide reliable, affordable, and premium car rental options at your fingertips. Our platform is built to eliminate the stress and confusion of traditional rentals, replacing it with ease, efficiency, and trust.
          </p>
          <p>
            With an expanding fleet and customer-centric services, we’ve proudly served over 1,000 satisfied customers across multiple cities in India.
            Every rental comes with our promise of safety, cleanliness, and unmatched convenience. We continuously upgrade our offerings to ensure every ride is not only smooth but memorable, making us one of the fastest-growing names in the mobility space.
          </p>
        </AnimateOnScroll>

        {/* HIGHLIGHTS */}
        <AnimateOnScroll className="about-features delay-2">
          {highlights.map((item, index) => (
            <div className="feature-card" key={index}>
              <div className="feature-icon">
                <FontAwesomeIcon icon={item.icon} />
              </div>
              <div className="feature-info">
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </AnimateOnScroll>

        {/* STORY + MISSION */}
        <AnimateOnScroll className="about-story delay-2">
          <div className="about-text-block">
            <h3>Our Story</h3>
            <p>
              DreamDrive was born out of a desire to revolutionize the way people experience car rentals in India.
              Tired of long queues, unreliable vehicles, and hidden charges, we decided it was time for a better way.
              What started as a passion project with just a few vehicles has now grown into a full-fledged tech-enabled mobility solution that puts customer satisfaction at the forefront.
            </p>
            <p>
              Since launching in 2023, we’ve continuously refined our model by listening to real feedback and solving genuine problems. Our focus on transparent pricing, quality control, and real-time support has helped us earn a loyal customer base and a reputation for dependability. We believe that renting a car should be as delightful as driving your own — and that’s exactly what we deliver.
            </p>
          </div>

          <div className="about-image-block">
             <img
              src="https://res.cloudinary.com/dcrfks1tq/image/upload/v1750163087/jeep_smrjsp.png"
              alt="DreamDrive Fleet"
            />
           
          </div>
        </AnimateOnScroll>

         <AnimateOnScroll className="about-mission">
            <div className="about-image-block">
            <img
              src="https://res.cloudinary.com/dcrfks1tq/image/upload/v1750168799/tata-nexon-right-front-three-quarter2-removebg-preview_lad5vy_gfkhzv.png"
              alt="DreamDrive Fleet"
            />
          </div>
          <div className="about-text-block">

            <h3>Our Mission</h3>
            <p>
              At DreamDrive, our mission is to make renting a car as simple, intuitive, and enjoyable as possible.
              We aim to break the barriers of traditional rentals by embracing technology, building a customer-first culture,
              and offering choices that match every lifestyle and budget.
            </p>
            <p>
              We strive to be the most trusted mobility brand in India — one that brings freedom and flexibility to modern travelers.
              Whether it’s a spontaneous trip or a long-term business rental, we’re here to ensure your experience is seamless from booking to return.
              Our ultimate goal? Empowering journeys, one ride at a time.
            </p>
          </div>

        
        </AnimateOnScroll>

      </div>
    </section>
    <Achievements />
    </>
  );
};

export default About;
