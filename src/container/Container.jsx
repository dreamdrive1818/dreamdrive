import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../components/home/Home';
import Header from '../components/header/Header';



const AppRoute = () => {
    return (
        <Router>
            <Header />
            <Routes>
             <Route path="/" element={<Home />} />
             {/* <Route path="/about" element={<About />} /> */}
            </Routes>
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
