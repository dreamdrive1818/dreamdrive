import React from "react";
import "./DreamCarBanner.css";
import { useLocalContext } from "../../context/LocalContext";

const DreamCarBanner = () => {

  const {Goto} = useLocalContext();

  return (
    <section className="dream-banner">
      <div className="banner-content">
        <h2>
          Reserve Your Dream <br />
          Car Today and Feel <br />
          Best Experience Travel
        </h2>
        <button className="banner-btn" onClick={Goto}>Let’s Drive with Us</button>
      </div>
      {/* <div className="banner-image">
        <img
          src="https://images.unsplash.com/photo-1541447370296-7f618abc1697?q=80&w=1946&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Car"
        />
      </div> */}
    </section>
  );
};

export default DreamCarBanner;
