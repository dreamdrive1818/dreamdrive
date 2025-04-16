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
          {/* <img src="/logo.png" alt="Logo" /> */}
          <h2>Varstraa</h2>
        </div>

       {/* Desktop Navigation */}
<nav className="nav-links">
  <p onClick={() => handleNavigation("/ethnic/mens")}>Men's Ethnic</p>
  <p onClick={() => handleNavigation("/ethnic/womens")}>Women's Ethnic</p>
  <p onClick={() => handleNavigation("/ethnic/sarees")}>Kid's Ethnic</p>
  <p onClick={() => handleNavigation("/ethnic/sherwanis")}>Sherwanis</p>
</nav>


        {/* Icons */}
        <div className="actions">
          <FontAwesomeIcon icon={faSearch} className="icon" title="Search" />
          <div className="login" onClick={() => handleNavigation("/login")}>
            <FontAwesomeIcon icon={faUser} size="xl" />
            <span>Log In</span>
          </div>
          <div className="cart" onClick={() => handleNavigation("/cart")}>
            <FontAwesomeIcon icon={faShoppingCart} size="2x" />
            {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
          </div>
         {isMobileMenuOpen && <div className="hamburger" onClick={() => setIsMobileMenuOpen(true)}>
            <FontAwesomeIcon icon={faBars} />
          </div>
         }
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-header">
            <FontAwesomeIcon icon={faTimes} onClick={() => setIsMobileMenuOpen(false)} />
          </div>
          <div className="mobile-links">
            <p onClick={() => handleNavigation("/watches")}>Watches</p>
            <p onClick={() => handleNavigation("/eyewear")}>Eyewear</p>
            <p onClick={() => handleNavigation("/accessories")}>Accessories</p>
            <p onClick={() => handleNavigation("/news")}>News</p>
            <p onClick={() => handleNavigation("/login")}>Log In</p>
            <p onClick={() => handleNavigation("/cart")}>Cart</p>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
