import React from 'react';
import '../styles/gridCard.css';

const GridCard = ({ title, description, index }) => {
  return (
    <div className="grid-card">
      <div className="grid-card-title">{title}</div>
      <div className="grid-card-desc">{description}</div>
    </div>
  );
};

export default GridCard; 