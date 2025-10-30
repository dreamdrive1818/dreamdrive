import React from "react";

import FleetCarousel from "../fleetCarousel/FleetCarousel";
import WhyChoose from "../whychooseus/WhyChooseUs";
import HowItWorks from "../HowItWorks/HowItWorks";
import Achievements from "../Achievements/Achievements";
import Contact from "../contact/Contact";
import Hero2 from "../hero/Hero2/Hero2";
import Testimonial from "../Testimonial/Testimonial";
import "./Home.css";

const Home = () => {
  return (
    <div className="home">
   

      <Hero2 />
      <FleetCarousel />
      <WhyChoose />
      <HowItWorks />
      <Achievements />
      <Contact />
      <Testimonial />
    </div>
  );
};

export default Home;
