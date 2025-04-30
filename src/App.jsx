import React from 'react';
import Container from './container/Container';
import './assets/style.css'
import { LocalProvider } from './context/LocalContext';
import { AdminProvider } from './context/AdminContext';

function App() {
  return (
    <div>
      <AdminProvider>
      <LocalProvider >
      <Container />
      </LocalProvider>
      </AdminProvider>
    </div>
  );
}

export default App;
