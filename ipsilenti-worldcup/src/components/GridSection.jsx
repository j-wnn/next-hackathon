import React from 'react';
import GridCard from './GridCard';
import '../styles/gridSection.css';
import { themeItemCounts, themeNames } from '../data/themes';

// 테마 정보를 동적으로 생성
const gridItems = themeNames.map((themeName, index) => ({
  id: index + 1,
  title: themeName,
  description: `${themeItemCounts[themeName]}개`
}));

const GridSection = () => {
  return (
    <div className="grid-section">
      {gridItems.map((item, idx) => (
        <GridCard key={item.id} title={item.title} description={item.description} index={idx} />
      ))}
    </div>
  );
};

export default GridSection; 