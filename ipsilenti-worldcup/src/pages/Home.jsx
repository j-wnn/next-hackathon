import React from 'react';
import { useNavigate } from 'react-router-dom';
import GridSection from '../components/GridSection';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styled from '@emotion/styled';
import '../styles/home.css';

const RankingButton = styled.button`
  padding: 0.9rem 1.7rem;
  margin: 0.5rem;
  border: 3px solid #000;
  border-radius: 10px;
  background-color: #8b0029;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 4px 4px 0 #000;
  transition: all 0.2s;
  min-width: 200px;
  &:hover {
    transform: translate(4px, 4px);
    box-shadow: none;
  }
  &:active {
    transform: translate(4px, 4px);
    box-shadow: none;
  }
  @media (max-width: 600px) {
    font-size: 1rem;
    padding: 0.7rem 1.1rem;
  }
`;

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
          <RankingButton onClick={handleRankingClick}>
            랭킹 보기
          </RankingButton>
        </div>
        
        <Footer />
      </div>
    </div>
  );
};

export default Home;
