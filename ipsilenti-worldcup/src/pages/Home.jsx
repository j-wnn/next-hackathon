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
      <div className="container" style={{ 
        margin: '40px auto',
        background: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '16px',
        border: '3px solid #000',
        boxShadow: '8px 8px 0 #000',
        padding: '60px 0 40px',
        minHeight: 'auto', 
        justifyContent: 'flex-start', 
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* 장식 요소 - 곡선 그린 라인 */}
        <div className="decorative-element curve-line-left"></div>
        <div className="decorative-element curve-line-right"></div>

        <Header />
        
        <GridSection />
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          marginTop: '2rem', 
          marginBottom: '1rem',
          position: 'relative',
          zIndex: 2 
        }}>
          <Button 
            onClick={handleRankingClick}
            style={{
              backgroundColor: '#8b0029',
              color: 'white',
              fontSize: '1.2rem',
              fontWeight: '700',
              padding: '1.2rem 2.5rem',
              borderRadius: '8px',
              boxShadow: '4px 4px 0 #000',
              border: '2px solid #000',
              transition: 'all 0.2s ease',
              minWidth: '200px',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            랭킹 보기
          </Button>
        </div>
        
        <Footer />
      </div>
    </div>
  );
};

export default Home;
