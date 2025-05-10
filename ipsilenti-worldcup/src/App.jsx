import React from 'react';
import './App.css';
import Result from './pages/result';
import Ranking from './pages/ranking';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Result />} />
        <Route path="/ranking" element={<Ranking />} />
      </Routes>
    </BrowserRouter>
  );
}

// 뼈대 라우팅

export default App;
