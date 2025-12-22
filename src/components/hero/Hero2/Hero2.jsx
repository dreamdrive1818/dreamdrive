import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./Hero2.css";

/** 🎯 Add / edit themes here anytime */
const HERO_THEMES = {
  default: { key: "default", label: "Default", offerText: "", offerBadge: "" },
  christmas: {
    key: "christmas",
    label: "Christmas",
    offerText: "Flat 10% OFF • Limited Time",
    offerBadge: "HOLIDAY DEAL",
  },
  newyear: {
    key: "newyear",
    label: "New Year",
    offerText: "New Year Offer • Flat 15% OFF",
    offerBadge: "2026",
  },
  diwali: {
    key: "diwali",
    label: "Diwali",
    offerText: "Diwali Offer • Up to 20% OFF",
    offerBadge: "FESTIVE",
  },
};

function getAutoThemeKey(today = new Date()) {
  const m = today.getMonth();
  const d = today.getDate();

  if (m === 11 && d >= 10) return "christmas"; // Dec 10 - Dec 31
  if (m === 0 && d <= 7) return "newyear"; // Jan 1 - Jan 7
  return "default";
}

const Hero2 = ({ themeKey }) => {
  const navigate = useNavigate();

  const activeTheme = useMemo(() => {
    const key = themeKey || getAutoThemeKey(new Date());
    return HERO_THEMES[key] || HERO_THEMES.default;
  }, [themeKey]);

  const handleNavigate = () => navigate("/cars");

  return (
    <section className={`hero-banner hero-theme--${activeTheme.key}`}>
      {/* 🎄 Christmas visuals */}
      {activeTheme.key === "christmas" && (
        <>
          {/* soft snow texture */}
          <div className="hero-snow" aria-hidden="true" />

          {/* falling snow flakes (3 layers) */}
          <div className="snowflakes" aria-hidden="true">
            <div className="snowflake snowflake--1" />
            <div className="snowflake snowflake--2" />
            <div className="snowflake snowflake--3" />
          </div>

          {/* top lights */}
          <div className="hero-lights" aria-hidden="true" />
        </>
      )}

      <div className="hero-content reveal-bottom">
        {activeTheme.offerText ? (
          <div className="hero-offer" role="note" aria-label="Offer banner">
            {activeTheme.offerBadge ? (
              <span className="hero-offer__badge">{activeTheme.offerBadge}</span>
            ) : null}
            <span className="hero-offer__text">{activeTheme.offerText}</span>
          </div>
        ) : null}

        <h1>
          Drive Your <span className="highlight">Freedom!</span>
          <br />
          Choose <span className="highlight">Rent</span> or{" "}
          <span className="highlight">Self Drive</span> – The Car is Yours
        </h1>

        <p className="hero-subtitle">
          Whether you're planning a weekend getaway, a business trip, or just a
          city ride — we’ve got the perfect wheels ready for you.
        </p>

        <div className="hero-buttons">
          <button className="btn-rent" onClick={handleNavigate}>
            Rent a Car
          </button>
          <button className="btn-self" onClick={handleNavigate}>
            Self Drive
          </button>
        </div>

        <div className="car-showcase">
          <img
            src="https://res.cloudinary.com/dcrfks1tq/image/upload/v1750169101/test_QkNB2Ri_axzqkj.png"
            className="left-car fade-in-bottom delay-2"
            alt="Left Car"
          />
          <img
            src="https://res.cloudinary.com/df10iqj1i/image/upload/v1766399135/24df9713-f67d-4f45-9da9-7ac8d7e124e8.png"
            className="center-car fade-in-bottom delay-3"
            alt="Jeep Compass Limited 2024"
          />
          <img
            src="https://res.cloudinary.com/dcrfks1tq/image/upload/v1750168799/tata-nexon-right-front-three-quarter2-removebg-preview_lad5vy_gfkhzv.png"
            className="right-car fade-in-bottom delay-4"
            alt="Tata Nexon Dark Edition 2023"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero2;
