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
import AllBlogs from '../components/blogs/AllBlogs';
import Blogspage from '../components/blogs/Blogspage';
import StatusTracking from '../components/statusTracking/StatusTracking';
import WhatsAppPopup from '../components/WhatsAppPopup/WhatsAppPopup';
import ContactPopup from '../components/ContactPopup/ContactPopup';
import Testimonial from '../components/Testimonial/Testimonial';
import { Helmet } from "react-helmet";
import FormEntryChecker from '../components/FormEntryChecker/FormEntryChecker';
import Numberattach from '../components/Numberattach/Numberattach';

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
          <Helmet>
  <title>Dream Drive | Ranchi’s Trusted Self-Drive Car Rentals</title>
  <meta
    name="description"
    content="Welcome to Dream Drive – Ranchi’s top choice for self-drive car rentals. Book SUVs like Nexon & Compass with flexible packages, 24x7 support, and doorstep delivery."
  />
  <meta
    property="og:title"
    content="Dream Drive | Self-Drive Car Rentals in Ranchi"
  />
</Helmet>

<Numberattach />
      
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
        <Route path="/blogs" element={<AllBlogs />} />
        <Route path="/testimonials" element={<Testimonial />} />
        <Route path="/blogs/:slug" element={<Blogspage />} />
        <Route path="/order" element={<Order />} />
        <Route path="/order-tracking" element={<StatusTracking />} />
        <Route path="/consent-form" element={<FormEntryChecker />} />
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
       {!isAdminPage  && <ContactPopup />}
     {!isAdminPage  && <DreamCarBanner />}
      {!isAdminPage  && <Footer />}
      {!isAdminPage  && <WhatsAppPopup />}
       
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
