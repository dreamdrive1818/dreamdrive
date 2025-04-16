import React from 'react';
import './Trending.css';
import VectorGroup from '../Vector/VectorGroup';

const Trending = () => {
  return (
    <section className="trending-section">
      <div className="trending-container">
        <div className="trending-left">
          <div className="deal-title-wrapper">
            <h2 className="deal-title">Trending Deals</h2>
          </div>
          <p className="trending-subtitle">Ethnic Collection</p>
          <h3 className="trending-title">
            Graceful Ethnic Wear <br /> For Every Occasion
          </h3>
          <button className="trending-discover-btn">Discover</button>
        </div>

        <div className="trending-right">
          <div className="abstract-shapes"></div>
          <img
            src="https://images.lifestyleasia.com/wp-content/uploads/sites/7/2020/11/26155613/Arjun-Kilachand-September20-034-1-scaled-e1606387832621-1570x900.jpg"
            alt="Ethnic Wear"
            className="trending-image"
          />
          <VectorGroup />
        </div>
      </div>
    </section>
  );
};

export default Trending;
