import React from 'react';
import './Newsletter.css';

const Newsletter = () => {
  return (
    <section className="newsletter-section">
      <div className="newsletter-left">
        <h2>Join Our Newsletter</h2>
        <p>Subscribe today for free and save 10% on your first purchase.</p>
      </div>
      <div className="newsletter-right">
        <input type="email" placeholder="Enter Your Email" />
        <button>Subscribe</button>
      </div>
    </section>
  );
};

export default Newsletter;
