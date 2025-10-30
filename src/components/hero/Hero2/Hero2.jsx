import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Hero2.css';
import { Helmet } from "react-helmet-async";
import { usePageSeoSuppression } from '../../../utils/usePageSeoSuppression';

const Hero2 = () => {
  usePageSeoSuppression();
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/cars');
  };

  return (
    <>
       {/* Page-specific SEO (overrides defaults where provided) */}
      <Helmet>
        <title>Dream Drive | Ranchi’s Trusted Self-Drive Car Rentals</title>
        <meta
    name="description"
    content="Welcome to Dream Drive – Ranchi’s top choice for self-drive car rentals. Book SUVs like Nexon & Compass with flexible packages, 24x7 support, and doorstep delivery."
  />
   <meta
    property="og:title"
    content="Dream Drive | Self-Drive Car Rentals in Ranchi"
  />
      </Helmet>
    <section className="hero-banner">
      <div className="hero-content reveal-bottom">
        <h1>
          Drive Your <span className="highlight">Freedom!</span><br />
          Choose <span className="highlight">Rent</span> or <span className="highlight">Self Drive</span> – The Car is Yours
        </h1>

        <p className="hero-subtitle">
          Whether you're planning a weekend getaway, a business trip, or just a city ride — we’ve got the perfect wheels ready for you.
        </p>

        <div className="hero-buttons">
          <button className="btn-rent" onClick={handleNavigate}>Rent a Car</button>
          <button className="btn-self" onClick={handleNavigate}>Self Drive</button>
        </div>

        <div className="car-showcase ">
          <img
            src="https://res.cloudinary.com/dcrfks1tq/image/upload/v1750169101/test_QkNB2Ri_axzqkj.png"
            className="left-car fade-in-bottom delay-2"
            alt="Left Car"
          />
          <img
            src="https://res.cloudinary.com/dcrfks1tq/image/upload/v1750165088/2024-jeep-compass-in-red-front-view-image-6173c724dab8-626x570_psbii9-Photoroom_fdghph.png"
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
    </>
  );
};

export default Hero2;
