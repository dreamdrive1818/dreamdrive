import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../components/home/Home';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import FleetCarousel from '../components/fleetCarousel/FleetCarousel';
import HowItWorks from '../components/HowItWorks/HowItWorks';
import Contact from '../components/contact/Contact';
import DreamCarBanner from '../components/DreamCarBanner/DreamCarBanner';



const AppRoute = () => {
    return (
        <Router>
            <Header />
            <Routes>
             <Route path="/" element={<Home />} />
             <Route path="/cars" element={<FleetCarousel />} />
             <Route path="/howitworks" element={<HowItWorks />} />
             <Route path="/contact" element={<Contact />} />
            </Routes>
            <DreamCarBanner />
            <Footer />
        </Router>
    );
};

const Container = () => {
    return (
        <>
            <AppRoute />
        </>
    );
};

export default Container;
