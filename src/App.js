import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Menu from './components/Menu/Menu';
import Teclas from './components/Teclas/Teclas';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Menu />} />
      <Route path="/teclas" element={<Teclas />} />
    </Routes>
  );
}

export default App;
