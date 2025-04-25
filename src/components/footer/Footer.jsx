import React from "react";
import "./Footer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { useLocalContext } from "../../context/LocalContext";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const { webinfo } = useLocalContext();
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
            <p onClick={() => navigate("/about")}>Who we are</p>
            <p onClick={() => navigate("/howitworks")}>How it works</p>
            <p onClick={() => navigate("/cars")}>Pick a car</p>
            <p onClick={() => navigate("/contact")}>Contact Us</p>
          </div>
          <div className="footer-column">
            <h4>Legal</h4>
            <p onClick={() => navigate("/termsandconditions")}>Terms and Conditions</p>
            <p onClick={() => navigate("/faq")}>FAQs</p>
          </div>
          <div className="footer-column">
            <h4>Social Media</h4>
            <p>
              <a href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a>
            </p>
            <p>
              <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
            </p>
            <p>
              <a href="https://twitter.com" target="_blank" rel="noreferrer">Twitter</a>
            </p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>Copyright © 2025 {webinfo.name}. All rights reserved.</p>
        <div className="scroll-up" onClick={scrollToTop}>
          <FontAwesomeIcon icon={faArrowUp} />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
