import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from '../components/home/Home';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import FleetCarousel from '../components/fleetCarousel/FleetCarousel';
import HowItWorks from '../components/HowItWorks/HowItWorks';
import Contact from '../components/contact/Contact';
import DreamCarBanner from '../components/DreamCarBanner/DreamCarBanner';
import TermsAndConditions from '../components/TermsAndConditions/TermsAndConditions';
import About from '../components/About/About';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const AppRoute = () => {
  return (
    <Router>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cars" element={<FleetCarousel />} />
        <Route path="/about" element={<About />} />
        <Route path="/howitworks" element={<HowItWorks />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/termsandconditions" element={<TermsAndConditions />} />
      </Routes>
      <DreamCarBanner />
      <Footer />
    </Router>
  );
};

const Container = () => <AppRoute />;

export default Container;
