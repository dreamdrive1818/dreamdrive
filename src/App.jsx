// src/App.jsx
import React from 'react';
import Container from './container/Container';
import './assets/style.css';

import { LocalProvider } from './context/LocalContext';
import { AdminProvider } from './context/AdminContext';
import { OrderProvider } from './context/OrderContext';
import { BlogProvider } from './context/BlogContext';
import { TestimonialProvider } from './context/TestimonialContext';

import { HelmetProvider } from 'react-helmet-async';

function App() {
  return (
    <HelmetProvider>
      <AdminProvider>
        <BlogProvider>
          <LocalProvider>
            <OrderProvider>
              <TestimonialProvider>
                {/* 🔁 Global SEO that reacts to context changes */}

                <Container />
              </TestimonialProvider>
            </OrderProvider>
          </LocalProvider>
        </BlogProvider>
      </AdminProvider>
    </HelmetProvider>
  );
}

export default App;
