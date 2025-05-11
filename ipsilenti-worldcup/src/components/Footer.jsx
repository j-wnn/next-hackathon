import React from 'react';
import '../styles/home.css';
import styled from '@emotion/styled';

const FooterContainer = styled.footer`
  width: 100%;
  padding: 1.5rem;
  margin-top: 2rem;
  text-align: center;
  font-weight: 700;
  border-top: 3px solid #000;
  background-color: #ffffff;
  font-size: 1.1rem;
  color: #000;
  position: relative;
`;

const Footer = () => {
  return (
    <FooterContainer className="home-footer">
      © 입실렌티 월드컵 from NEXT 2025
    </FooterContainer>
  );
};

export default Footer; 