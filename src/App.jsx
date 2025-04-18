import React from 'react';
import Container from './container/Container';
import './assets/style.css'
import { LocalProvider } from './context/LocalContext';

function App() {
  return (
    <div>
      <LocalProvider >
      <Container />
      </LocalProvider>
    </div>
  );
}

export default App;
