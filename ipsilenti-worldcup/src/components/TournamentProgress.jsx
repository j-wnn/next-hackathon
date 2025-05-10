import React from 'react';
import styled from '@emotion/styled';

const ProgressContainer = styled.div`
  margin: 1.5rem 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const ProgressBarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 600px;
  background-color: #f0f2fa;
  border-radius: 30px;
  padding: 0.5rem;
`;

const ProgressStep = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background-color: ${props => props.isActive ? '#25c19f' : '#e0e0e0'};
  color: ${props => props.isActive ? 'white' : '#666'};
  border-radius: 50%;
  font-weight: ${props => props.isActive ? '700' : '500'};
  font-size: 0.9rem;
  position: relative;
  transition: all 0.3s ease;
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 100%;
    width: calc(100% - 20px);
    height: 3px;
    background-color: ${props => props.isActive && props.hasNext ? '#25c19f' : '#e0e0e0'};
    transform: translateY(-50%);
    display: ${props => props.isLast ? 'none' : 'block'};
  }
`;

const CurrentRoundInfo = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-top: 0.5rem;
`;

/**
 * A reusable tournament progress component
 * 
 * @param {Object} props
 * @param {Array} props.stages - Array of stage numbers (e.g. [32, 16, 8, 4, 2])
 * @param {number} props.currentStage - Current active stage
 * @param {number} props.currentRound - Current round within the stage
 * @param {number} props.totalRounds - Total rounds in current stage
 */
const TournamentProgress = ({ 
  stages, 
  currentStage, 
  currentRound,
  totalRounds 
}) => {
  if (!stages || stages.length === 0) return null;
  
  return (
    <ProgressContainer>
      <ProgressBarContainer>
        {stages.map((stage, index) => (
          <ProgressStep 
            key={stage}
            isActive={stage === currentStage}
            isLast={index === stages.length - 1}
            hasNext={index < stages.length - 1}
          >
            {stage}강
          </ProgressStep>
        ))}
      </ProgressBarContainer>
      
      <CurrentRoundInfo>
        {currentStage}강 {currentRound}/{totalRounds || currentStage / 2}
      </CurrentRoundInfo>
    </ProgressContainer>
  );
};

export default TournamentProgress; 