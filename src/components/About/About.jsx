import React from "react";
import "./About.css";
import { useLocalContext } from "../../context/LocalContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCarSide,
  faHeart,
  faHeadset,
  faLeaf,
  faCalendarAlt,
  faMobileAlt,
  faShieldAlt,
   faThumbsUp
} from "@fortawesome/free-solid-svg-icons";
import Achievements from "../Achievements/Achievements";

const features = [
  {
    icon: faCarSide,
    title: "Wide Fleet",
    desc:
      "Choose from sedans, SUVs, hatchbacks, and luxury rides — all maintained for safety and comfort.",
  },
  {
    icon: faHeart,
    title: "Growing Trust",
    desc:
      "In just months, we've earned customer loyalty through consistent service and real transparency.",
  },
  {
    icon: faHeadset,
    title: "24/7 Support",
    desc:
      "Late-night queries or last-minute bookings? Our team is always ready to assist you — anytime.",
  },
  {
    icon: faLeaf,
    title: "Eco-Conscious",
    desc:
      "We champion sustainability by offering fuel-efficient cars and prepping our EV future.",
  },
  {
    icon: faCalendarAlt,
    title: "Flexible Booking",
    desc:
      "Hourly, daily, or weekly — choose what works for you. No hidden fees. Ever.",
  },
  {
    icon: faMobileAlt,
    title: "Fully Digital",
    desc:
      "Book, confirm, and pick up — all digitally. No paperwork, just a smooth ride start to finish.",
  },
  {
  icon: faShieldAlt,
  title: "Secure Payments",
  desc:
    "Your transactions are encrypted and protected with trusted gateways for a worry-free checkout.",
},
{
  icon: faThumbsUp,
  title: "Top Rated Service",
  desc:
    "Our customers consistently rate us highly for reliability, quality, and smooth experiences across every trip.",
}

];

const About = () => {
  const { webinfo } = useLocalContext();

  return (
    <>
    <section className="about-us">
      <div className="about-container">
        <div className="about-heading">
          <h2>About <span>{webinfo.name}</span></h2>
          <p>
            We're on a mission to redefine car rentals with comfort, transparency, and technology. Though we’re just 6 months in, our obsession with seamless experiences and happy customers drives every decision.
          </p>
          <p>
            From solo travelers to families, we've helped hundreds get on the road with ease. With a growing network and a tech-first approach, we make car rental not just easy — but enjoyable.
          </p>
        </div>

        <div className="about-features reveal-bottom">
          {features.map((item, i) => (
            <div className="feature-box" key={i}>
              <div className="feature-icon">
                <FontAwesomeIcon icon={item.icon} />
              </div>
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
    <Achievements />
    </>
  );
};

export default About;
