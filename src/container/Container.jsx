import React, { useEffect, useRef, useState } from 'react';
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
import { ClipLoader } from "react-spinners";
import Success from '../components/Payment/Success/Success';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};



const AppRoute = () => {

   const location = useLocation();
     const [loading, setLoading] = useState(true);
  const isFirstRender = useRef(true);
  const isAdminPage = location.pathname.includes("admin");

   useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 100); 
    return () => clearTimeout(timer);
  }, [location.pathname]);


  return (
      <>
      <ScrollToTop />
      
      {!isAdminPage  && <Header />}
      <main className="route-container">
        {loading ? (
          <div className="route-spinner">
            {/* <ClipLoader size={60} color="#c2410c" /> */}
          </div>
        ) : (
          <div className="fade-in-bottom">
             <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cars" element={<FleetCarousel />} />
        <Route path="/order" element={<Order />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/about" element={<About />} />
        <Route path="/success" element={<Success />} />
        <Route path="/howitworks" element={<HowItWorks />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/termsandconditions" element={<TermsAndConditions />} />
        
      </Routes>
          </div>
        )}
      </main>
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
