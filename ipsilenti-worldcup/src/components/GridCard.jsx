import React, { useState } from 'react';
import '../styles/gridCard.css';
import WorldcupModal from './WorldcupModal';
import { themeItemCounts } from '../data/themes';

const GridCard = ({ title, description, index }) => {
  const [showModal, setShowModal] = useState(false);
  
  const handleCardClick = () => {
    setShowModal(true);
  };
  
  const closeModal = () => {
    setShowModal(false);
  };

  const totalItems = themeItemCounts[title];

  return (
    <>
      <div className="grid-card" onClick={handleCardClick}>
        <div className="grid-card-title">{title}</div>
        <div className="grid-card-desc">{description}</div>
      </div>
      
      <WorldcupModal 
        isOpen={showModal} 
        onClose={closeModal} 
        theme={title}
        totalItems={totalItems}
      />
    </>
  );
};

export default GridCard; 