import React from 'react';
import GridCard from './GridCard';
import '../styles/gridSection.css';
import { themeItemCounts, themeNames } from '../data/themes';

// 테마 이미지 매핑 - 이미지 파일명과 일치하게 설정
const themeImages = {
  "라인업 월드컵": "/images/themes/lineup.jpg",
  "응원가 월드컵": "/images/themes/cheering.jpg",
  "막걸리 월드컵": "/images/themes/makgeolli.jpg",
  "안암 술집 월드컵": "/images/themes/anam-pub.jpg",
  "마스코트 월드컵": "/images/themes/mascot.jpg"
};

// 테마 설명
const themeDescriptions = {
  "라인업 월드컵": "고려대학교 라인업",
  "응원가 월드컵": "최고의 응원가는?",
  "막걸리 월드컵": "다양한 막걸리 대결",
  "안암 술집 월드컵": "안암동 최고의 술집",
  "마스코트 월드컵": "매력적인 마스코트들"
};

// 기본 이미지 경로
const defaultThemeImage = "/images/themes/default.jpg";

// 테마 정보를 동적으로 생성
const gridItems = themeNames.map((themeName, index) => ({
  id: index + 1,
  title: themeName,
  description: themeDescriptions[themeName] || `${themeName}`,
  imageUrl: themeImages[themeName] || defaultThemeImage
}));

const GridSection = () => {
  return (
    <div className="grid-section">
      {gridItems.map((item, idx) => (
        <GridCard 
          key={item.id} 
          title={item.title} 
          description={item.description} 
          index={idx}
          imageUrl={item.imageUrl}
        />
      ))}
    </div>
  );
};

export default GridSection; 