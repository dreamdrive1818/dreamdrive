import React from 'react';
import './Footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFacebookF,
  faInstagram,
  faTwitter,
  faYoutube,
} from '@fortawesome/free-brands-svg-icons';
import VectorGroup from '../Vector/VectorGroup';

const Footer = () => {
  return (
    <footer className="matoa-footer">
      <div className="footer-container">
        {/* Address */}
        <div className="footer-column">
          <h3>Address</h3>
          <p>
            <b>Store & Office</b><br />
            Jl. Setrasari Kulon III, No. 10-12,<br />
            Sukarasa, Sukasari, Bandung,<br />
            Jawa Barat, Indonesia 40152
          </p>
          <br />
          <h4>Office Hour</h4>
          <p>Monday - Sunday<br />10.00 - 18.00</p>
        </div>

        {/* Contact */}
        <div className="footer-column">
          <h3>Get in touch</h3>
          <p><strong>Phone</strong><br />022-20277564</p>
          <p><strong>Service Center</strong><br />0811-233-8899</p>
          <p><strong>Customer Service</strong><br />0811-235-9988</p>
          <div className="social-icons">
            <a href="#"><FontAwesomeIcon icon={faFacebookF} /></a>
            <a href="#"><FontAwesomeIcon icon={faInstagram} /></a>
            <a href="#"><FontAwesomeIcon icon={faTwitter} /></a>
            <a href="#"><FontAwesomeIcon icon={faYoutube} /></a>
          </div>
        </div>

        {/* Useful Links */}
        <div className="footer-column">
          <h3>Useful Link</h3>
          <ul>
            <li><a href="#">Warranty & Complaints</a></li>
            <li><a href="#">Order & Shipping</a></li>
            <li><a href="#">Tracking Order</a></li>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Repair</a></li>
            <li><a href="#">Terms</a></li>
            <li><a href="#">FAQ</a></li>
          </ul>
        </div>

        {/* Campaign */}
        <div className="footer-column">
          <h3>Campaign</h3>
          <ul>
            <li><a href="#">Mengenal Arti Cukup</a></li>
            <li><a href="#">Tell Your Difference</a></li>
            <li><a href="#">Waykambas</a></li>
            <li><a href="#">Rebrand</a></li>
            <li><a href="#">Gallery</a></li>
            <li><a href="#">Singo</a></li>
            <li><a href="#">Rakai</a></li>
          </ul>
        </div>
      </div>
      <VectorGroup />
    </footer>
  );
};

export default Footer;
