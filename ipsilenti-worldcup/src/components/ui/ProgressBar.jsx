import React from 'react';
import styled from '@emotion/styled';

const ProgressContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const ProgressBarWrap = styled.div`
  background: #f3f3f3;
  border-radius: 8px;
  width: 100%;
  height: 22px;
  position: relative;
`;

const ProgressFill = styled.div`
  height: 100%;
  border-radius: 8px;
  background: ${props => props.variant === 'win' 
    ? 'repeating-linear-gradient(135deg, #ff8a80, #ff8a80 10px, #ffb199 10px, #ffb199 20px)'
    : props.variant === 'match' 
      ? 'repeating-linear-gradient(135deg, #ffb300, #ffb300 10px, #ffe082 10px, #ffe082 20px)'
      : props.color || '#283593'};
  width: ${props => props.percent}%;
  min-width: 2%;
  transition: width 0.5s;
`;

const StatsLabel = styled.div`
  font-size: 0.8rem;
  color: #666;
  margin-top: 0.3rem;
  text-align: right;
`;

const PercentLabel = styled.span`
  min-width: 55px;
  font-weight: 600;
`;

/**
 * A reusable progress bar component
 * 
 * @param {Object} props
 * @param {number} props.percent - Percentage to fill (0-100)
 * @param {string} props.variant - Visual variant (win, match, or default)
 * @param {string} props.color - Custom color (used if variant not specified)
 * @param {number} props.value - Numerator for stats
 * @param {number} props.total - Denominator for stats
 * @param {boolean} props.showStats - Whether to show the stats text
 */
const ProgressBar = ({ 
  percent, 
  variant, 
  color, 
  value, 
  total, 
  showStats = true,
  showPercentage = true 
}) => {
  const safePercent = Math.max(0, Math.min(100, Number(percent) || 0));
  
  return (
    <ProgressContainer>
      <div style={{display:'flex', alignItems:'center', gap: 8}}>
        {showPercentage && <PercentLabel>{safePercent.toFixed(2)}%</PercentLabel>}
        <ProgressBarWrap>
          <ProgressFill 
            percent={safePercent} 
            variant={variant} 
            color={color} 
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