import React from 'react';
import { useNavigate } from 'react-router-dom';
import GridSection from '../components/GridSection';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import '../styles/home.css';

const Home = () => {
  const navigate = useNavigate();
  
  const handleRankingClick = () => {
    navigate('/ranking');
  };
  
  return (
    <div className="home-root">
      <div className="container" style={{ minHeight: 'auto', justifyContent: 'flex-start', paddingTop: 32 }}>
        <Header />
        <GridSection />
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem', marginBottom: '1rem' }}>
          <Button onClick={handleRankingClick}>랭킹 보기</Button>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Home;
