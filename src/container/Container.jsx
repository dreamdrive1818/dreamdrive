import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../components/home/Home';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import FleetCarousel from '../components/fleetCarousel/FleetCarousel';



const AppRoute = () => {
    return (
        <Router>
            <Header />
            <Routes>
             <Route path="/" element={<Home />} />
             <Route path="/cars" element={<FleetCarousel />} />
            </Routes>
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
