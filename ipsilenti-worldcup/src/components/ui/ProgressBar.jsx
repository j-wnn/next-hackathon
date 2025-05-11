import React from 'react';
import styled from '@emotion/styled';

const ProgressContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const ProgressBarWrap = styled.div`
  background: #f3f3f3;
  border-radius: 6px;
  width: 100%;
  height: 22px;
  position: relative;
  border: 2px solid #000;
  box-shadow: 2px 2px 0 #000;
  overflow: hidden;
  
  @media (max-width: 768px) {
    height: 20px;
  }
  
  @media (max-width: 430px) {
    height: 18px;
    border-width: 1.5px;
    box-shadow: 1.5px 1.5px 0 #000;
  }
`;

const ProgressFill = styled.div`
  height: 100%;
  border-radius: 3px;
  background: ${props => 
    props.barColor ? props.barColor :
    props.variant === 'win' 
      ? '#8b0029'
    : props.variant === 'match' 
        ? '#8b0029'
        : '#8b0029'};
  width: ${props => props.percent}%;
  min-width: 2%;
  transition: width 0.5s;
`;

const StatsLabel = styled.div`
  font-size: 0.9rem;
  color: #333;
  margin-top: 0.4rem;
  text-align: right;
  font-weight: 600;
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
    margin-top: 0.2rem;
  }
  
  @media (max-width: 430px) {
    font-size: 0.75rem;
    margin-top: 0.1rem;
  }
`;

const PercentLabel = styled.span`
  min-width: 65px;
  font-weight: 700;
  color: #000;
  font-size: 0.95rem;
  
  @media (max-width: 768px) {
    min-width: 55px;
    font-size: 0.85rem;
  }
  
  @media (max-width: 430px) {
    min-width: 50px;
    font-size: 0.8rem;
  }
`;

/**
 * A reusable progress bar component
 * 
 * @param {Object} props
 * @param {number} props.percent - Percentage to fill (0-100)
 * @param {string} props.variant - Visual variant (win, match, or default)
 * @param {string} props.barColor - Custom color for the bar
 * @param {number} props.value - Numerator for stats
 * @param {number} props.total - Denominator for stats
 * @param {boolean} props.showStats - Whether to show the stats text
 */
const ProgressBar = ({ 
  percent, 
  variant, 
  color, 
  barColor,
  value, 
  total, 
  showStats = true,
  showPercentage = true 
}) => {
  const safePercent = Math.max(0, Math.min(100, Number(percent) || 0));
  
  return (
    <ProgressContainer>
      <div style={{display:'flex', alignItems:'center', gap: 8}}>
        {showPercentage && <PercentLabel>{safePercent.toFixed(1)}%</PercentLabel>}
        <ProgressBarWrap>
          <ProgressFill 
            percent={safePercent} 
            variant={variant} 
            color={color} 
            barColor={barColor}
          />
        </ProgressBarWrap>
      </div>
      
      {showStats && typeof value !== 'undefined' && typeof total !== 'undefined' && (
        <StatsLabel>
          {value} / {total}
        </StatsLabel>
      )}
    </ProgressContainer>
  );
};

export default ProgressBar; 