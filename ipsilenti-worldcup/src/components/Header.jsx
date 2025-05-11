import React from 'react';
import '../styles/home.css';
import styled from '@emotion/styled';

const HeaderContainer = styled.header`
  width: 100%;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  
  @media (max-width: 430px) {
    padding: 0.8rem 0.5rem;
  }
`;

const TitleBox = styled.div`
  position: relative;
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
  cursor: ${props => props.onClick ? 'pointer' : 'default'};
  max-width: 100%;
  
  &::before {
    content: '';
    position: absolute;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: #ffb4c0;
    top: -10px;
    left: -15px;
    z-index: 0;
    border: 2px solid #000;
    
    @media (max-width: 430px) {
      width: 24px;
      height: 24px;
      top: -8px;
      left: -8px;
    }
  }
  
  &::after {
    content: '';
    position: absolute;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: #ffb4c0;
    bottom: -10px;
    right: -15px;
    z-index: 0;
    border: 2px solid #000;
    
    @media (max-width: 430px) {
      width: 24px;
      height: 24px;
      bottom: -8px;
      right: -8px;
    }
  }
  
  &:hover {
    transform: ${props => props.onClick ? 'scale(1.02)' : 'none'};
    transition: transform 0.2s ease;
  }
`;

const Title = styled.h1`
  font-family: 'Pretendard', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  font-weight: 800;
  font-size: 2.5rem;
  color: #8b0029;
  position: relative;
  z-index: 1;
  letter-spacing: -0.5px;
  white-space: nowrap;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
  
  @media (max-width: 430px) {
    font-size: 1.9rem;
  }
`;

// 2025 연도 표시를 위한 작은 배지
const YearBadge = styled.div`
  position: absolute;
  top: -15px;
  right: -30px;
  background-color: #fedd9a;
  color: #8b0029;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 10px;
  transform: rotate(15deg);
  border: 1px solid #000;
  box-shadow: 1px 1px 0 #000;
  
  @media (max-width: 430px) {
    top: -10px;
    right: -15px;
    font-size: 0.6rem;
    padding: 1px 6px;
    border-radius: 8px;
    transform: rotate(10deg);
  }
`;

const Header = ({ onTitleClick }) => {
  return (
    <HeaderContainer>
      <TitleBox onClick={onTitleClick}>
        <Title>입실렌티 월드컵</Title>
        <YearBadge>2025</YearBadge>
      </TitleBox>
    </HeaderContainer>
  );
};

export default Header; 