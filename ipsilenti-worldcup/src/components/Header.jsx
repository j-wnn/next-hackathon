import React from "react";
import "../styles/home.css";
import styled from "@emotion/styled";

const HeaderContainer = styled.header`
    width: 100%;
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
`;

const TitleBox = styled.div`
    position: relative;
    padding: 0.5rem 1rem;
    margin-bottom: 1rem;

    &::before {
        content: "";
        position: absolute;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: #ffb4c0;
        top: -10px;
        left: -15px;
        z-index: 0;
        border: 2px solid #000;
    }

    &::after {
        content: "";
        position: absolute;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: #ffb4c0;
        bottom: -10px;
        right: -15px;
        z-index: 0;
        border: 2px solid #000;
    }
`;

const Title = styled.h1`
    font-family: "Pretendard", system-ui, -apple-system, BlinkMacSystemFont,
        sans-serif;
    font-weight: 800;
    font-size: 2.5rem;
    color: #8b0029;
    position: relative;
    z-index: 1;
    letter-spacing: -0.5px;
    white-space: nowrap;

    @media (max-width: 600px) {
        font-size: 1.8rem;
    }
`;

// 2025 연도 표시를 위한 작은 배지
const YearBadge = styled.div`
    position: absolute;
    top: -15px;
    right: -40px;
    background-color: #fedd9a;
    color: #8b0029;
    font-size: 0.7rem;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 10px;
    transform: rotate(15deg);
    border: 1px solid #000;
    box-shadow: 1px 1px 0 #000;
`;

const Header = () => {
    return (
        <HeaderContainer>
            <TitleBox>
                <Title>IPSELENTI 월드컵</Title>
                <YearBadge>2025</YearBadge>
            </TitleBox>
        </HeaderContainer>
    );
};

export default Header;
