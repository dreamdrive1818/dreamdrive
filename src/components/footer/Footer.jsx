import React from "react";
import "./Footer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { useLocalContext } from "../../context/LocalContext";

const Footer = () => {

  const {webinfo} = useLocalContext();

  return (
    <footer className="footer">
        <div className="footer-top">
      <div className="footer-left">
        <h2>Don’t Miss a Thing</h2>
        <p>Subscribe to our newsletter for exclusive deals and updates.</p>
        <div className="newsletter">
          <input
            type="email"
            placeholder="Enter email address for newsletter ..."
          />
          <button>
            <span>→</span>
          </button>
        </div>
      </div>

      <div className="footer-right">
        <div className="footer-column">
          <h4>Quick Link</h4>
          <p>About us</p>
          <p>Who we are</p>
          <p>Contact Us</p>
        </div>
        <div className="footer-column">
          <h4>The Cars</h4>
          <p>How it works</p>
          <p>Pick a car</p>
          <p>FAQs</p>
        </div>
        <div className="footer-column">
          <h4>Social Media</h4>
          <p>Facebook</p>
          <p>Instagram</p>
          <p>Twitter</p>
        </div>
      </div>
            
      </div>

      <div className="footer-bottom">
        <p>Copyright © 2025 {webinfo.name}. All rights reserved.</p>
        <div className="scroll-up">
          <FontAwesomeIcon icon={faArrowUp} />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
