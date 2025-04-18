import React from "react";
import "./Achievement.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp,
  faCarCrash,
  faLightbulb,
  faLeaf,
  faStar,
  faChartLine,
  faUsers,
  faMedal,
  faCarOn,
} from "@fortawesome/free-solid-svg-icons";

const achievements = [
  { icon: faThumbsUp, title: "Customer Choice Award" },
  { icon: faCarOn, title: "Safety Drive Excellence" },
  { icon: faLightbulb, title: "Innovation Champion" },
  { icon: faLeaf, title: "Sustainable Travel Partner" },
  { icon: faStar, title: "Best Customer Support" },
  { icon: faChartLine, title: "Business Growth Milestone" },
  { icon: faUsers, title: "Community Engagement" },
  { icon: faMedal, title: "Industry Leadership" },
];

const Achievements = () => {
  return (
    <section className="achievements">
      <div className="achievements-left">
        <p className="achievements-subtitle">ACHIEVEMENTS</p>
        <h2 className="achievements-heading">
          Let’s See Our <br /> Celebrate Milestones
        </h2>
      </div>
      <div className="achievements-right">
        {achievements.map((item, index) => (
          <div className="achievement-card" key={index}>
            <FontAwesomeIcon icon={item.icon} className="icon" />
            <p>{item.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Achievements;
