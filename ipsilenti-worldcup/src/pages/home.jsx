import React from 'react';
import GridSection from '../components/GridSection';
import { Button } from '../components/ui/button';
import '../styles/home.css';

const Home = () => {
  return (
    <div className="home-root">
      <div className="container" style={{ minHeight: 'auto', justifyContent: 'flex-start', paddingTop: 32 }}>
        <h1 className="home-title">이상형 월드컵</h1>
        <GridSection />
        <Button>버튼</Button>
        <footer className="home-footer">© 2024 이상형 월드컵</footer>
      </div>
    </div>
  );
};

export default Home;
