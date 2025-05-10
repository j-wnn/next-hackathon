import React from 'react';
import '../styles/home.css';
import styled from '@emotion/styled';

const HeaderContainer = styled.header`
  width: 100%;
  padding: 1rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = () => {
  return (
    <HeaderContainer>
      <h1 className="home-title">IPSILENTI 월드컵</h1>
    </HeaderContainer>
  );
};

export default Header; 