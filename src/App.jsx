import React from 'react';
import Container from './container/Container';
import './assets/style.css'
import { LocalProvider } from './context/LocalContext';
import { AdminProvider } from './context/AdminContext';
import { OrderProvider } from './context/OrderContext';
import { BlogProvider } from './context/BlogContext';
import { TestimonialProvider } from './context/TestimonialContext';

function App() {
  return (
    <div className=''>
      <AdminProvider>
        <BlogProvider >
      <LocalProvider >
      <OrderProvider >
        <TestimonialProvider>
      <Container  />
      </TestimonialProvider>
      </OrderProvider>
      </LocalProvider>
      </BlogProvider>
      </AdminProvider>
    </div>
  );
}

export default App;
