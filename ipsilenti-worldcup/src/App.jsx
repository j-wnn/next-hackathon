import React from 'react';
import './App.css';
import Result from './pages/Result';
import Ranking from './pages/Ranking';
import Worldcup from './pages/Worldcup';
import Home from './pages/Home';
import Admin from './pages/Admin';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/result" element={<Result />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/worldcup" element={<Worldcup />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

// 뼈대 라우팅

export default App;
