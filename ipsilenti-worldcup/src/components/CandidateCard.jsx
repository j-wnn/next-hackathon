import React from 'react';
import styled from '@emotion/styled';

const CardWrapper = styled.div`
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 320px;
  height: 100%;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
  
  &.selected {
    box-shadow: 0 0 0 3px #25c19f, 0 10px 20px rgba(0, 0, 0, 0.2);
  }
  
  &.slideLeft {
    animation: slideLeft 1.5s forwards;
  }
  
  &.slideRight {
    animation: slideRight 1.5s forwards;
  }
  
  @keyframes slideLeft {
    0% { transform: translateX(0); opacity: 1; }
    100% { transform: translateX(-200%); opacity: 0; }
  }
  
  @keyframes slideRight {
    0% { transform: translateX(0); opacity: 1; }
    100% { transform: translateX(200%); opacity: 0; }
  }
`;

const CardImage = styled.img`
  width: 100%;
  aspect-ratio: 1/1;
  object-fit: cover;
`;

const PlaceholderImage = styled.div`
  width: 100%;
  aspect-ratio: 1/1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f2fa;
  font-weight: 500;
  font-size: 1.2rem;
  color: #666;
`;

const CardTitle = styled.div`
  width: 100%;
  padding: 1rem;
  text-align: center;
  font-weight: 600;
  font-size: 1.3rem;
  background-color: rgba(255, 255, 255, 0.95);
`;

/**
 * A reusable candidate card component for the worldcup tournament
 * 
 * @param {Object} props
 * @param {Object} props.item - The candidate item data
 * @param {function} props.onClick - Callback when card is clicked
 * @param {boolean} props.isSelected - Whether this card is selected
 * @param {string} props.slideDirection - Direction to slide out (left, right or null)
 * @param {string} props.className - Additional class names
 */
const CandidateCard = ({ 
  item, 
  onClick, 
  isSelected, 
  slideDirection, 
  className = '' 
}) => {
  const getAnimationClass = () => {
    if (isSelected) return 'selected';
    if (slideDirection === 'left') return 'slideRight';
    if (slideDirection === 'right') return 'slideLeft';
    return '';
  };

  return (
    <CardWrapper 
      className={`${className} ${getAnimationClass()}`}
      onClick={onClick}
    >
      {item.image ? (
        <CardImage src={item.image} alt={item.artistName || item.name} />
      ) : (
        <PlaceholderImage>
          {item.artistName || item.name}
        </PlaceholderImage>
      )}
      <CardTitle>
        {item.artistName || item.name}
      </CardTitle>
    </CardWrapper>
  );
};

export default CandidateCard; 