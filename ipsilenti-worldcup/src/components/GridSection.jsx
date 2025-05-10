import React from 'react';
import GridCard from './GridCard';
import '../styles/gridSection.css';

const gridItems = [
  { id: 1, title: '라인업 월드컵', description: '50팀' },
  { id: 2, title: '응원가 월드컵', description: '30개' },
  { id: 3, title: '디저트 월드컵', description: '8개' },
  { id: 4, title: '음료 월드컵', description: '50개' },
  { id: 5, title: '간식 월드컵', description: '30개' },
];

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