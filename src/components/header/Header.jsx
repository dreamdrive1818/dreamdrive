import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faShoppingCart,
  faSearch,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

const Header = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const cartItemCount = 2; // You can replace this with actual cart context value

  const handleNavigation = (route) => {
    navigate(route);
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setIsMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="matoa-header">
  <div className="header-inner">
    {/* Logo */}
    <div className="logo" onClick={() => navigate("/")}>
      {/* <h2>DRIVOXE.</h2> */}
      <img src="https://res.cloudinary.com/dcrfks1tq/image/upload/v1744822234/WhatsApp_Image_2025-04-14_at_20.57.15_b7644c4b-removebg-preview_ebkbxf.png" alt="" />
    </div>

    {/* Hamburger (Mobile Only) */}
    <div className="hamburger" onClick={() => setIsMobileMenuOpen(true)}>
      <FontAwesomeIcon icon={faBars} />
    </div>

    {/* Center Navigation (Desktop Only) */}
    <nav className="nav-links">
      <p onClick={() => handleNavigation("/services")}>Service</p>
      <p onClick={() => handleNavigation("/cars")}>Cars</p>
      <p onClick={() => handleNavigation("/pricing")}>Pricing</p>
      <p onClick={() => handleNavigation("/about")}>About</p>
    </nav>

    {/* Right Actions */}
    <div className="header-actions">
      <button className="contact-btn" onClick={() => handleNavigation("/contact")}>
        Contact
      </button>
      <span>|</span>
      <button className="signup-btn" onClick={() => handleNavigation("/signup")}>
        Sign up
      </button>
    </div>
  </div>

  {/* Mobile Menu */}
  {isMobileMenuOpen && (
    <div className="mobile-menu">
      <div className="mobile-header">
        <FontAwesomeIcon icon={faTimes} onClick={() => setIsMobileMenuOpen(false)} />
      </div>
      <div className="mobile-links">
        <p onClick={() => handleNavigation("/services")}>Service</p>
        <p onClick={() => handleNavigation("/cars")}>Cars</p>
        <p onClick={() => handleNavigation("/pricing")}>Pricing</p>
        <p onClick={() => handleNavigation("/about")}>About</p>
        <p onClick={() => handleNavigation("/contact")}>Contact</p>
        <p onClick={() => handleNavigation("/signup")}>Sign up</p>
      </div>
    </div>
  )}
</header>
  );
};

export default Header;
