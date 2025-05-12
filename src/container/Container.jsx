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
import Order from '../components/Order/Order';
import AdminLayout from './AdminLayout';
import Payment from '../components/Payment/Payment';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const AppRoute = () => {

   const location = useLocation();
  const isAdminPage = location.pathname.includes("admin");

  return (
      <>
      <ScrollToTop />
      
      {!isAdminPage  && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cars" element={<FleetCarousel />} />
        <Route path="/order" element={<Order />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/about" element={<About />} />
        <Route path="/howitworks" element={<HowItWorks />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/termsandconditions" element={<TermsAndConditions />} />
        
      </Routes>
      {isAdminPage && <AdminLayout />}
     
     {!isAdminPage  && <DreamCarBanner />}
      {!isAdminPage  && <Footer />}

       
    </>
  );
};

const Container = () => {
  return (
    <Router>
      <AppRoute />
    </Router>
  );
};

export default Container;
