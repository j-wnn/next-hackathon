import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WorldCup from "./pages/worldcup";
import "./App.css";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<WorldCup />} />
            </Routes>
        </Router>
    );
}

// 뼈대 라우팅

export default App;
