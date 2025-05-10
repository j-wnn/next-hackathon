import React from 'react';
import styled from '@emotion/styled';

const ProgressContainer = styled.div`
  margin: 2rem 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const ProgressBarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 600px;
  background-color: #f5f5f5;
  border-radius: 16px;
  padding: 1rem;
  border: 3px solid #000;
  box-shadow: 6px 6px 0 #000;
`;

const ProgressStep = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background-color: ${props => props.isActive ? '#8b0029' : '#fff'};
  color: ${props => props.isActive ? 'white' : '#000'};
  border-radius: 50%;
  font-weight: 700;
  font-size: 1.1rem;
  position: relative;
  transition: all 0.2s ease;
  border: 3px solid #000;
  box-shadow: ${props => props.isActive ? '4px 4px 0 #000' : '2px 2px 0 #000'};
  z-index: ${props => props.isActive ? 2 : 1};
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 100%;
    width: calc(100% - 30px);
    height: 6px;
    background-color: ${props => props.isActive && props.hasNext ? '#8b0029' : '#ccc'};
    transform: translateY(-50%);
    display: ${props => props.isLast ? 'none' : 'block'};
    z-index: 0;
  }
`;

const CurrentRoundInfo = styled.div`
  font-size: 1.4rem;
  font-weight: 700;
  color: #8b0029;
  margin-top: 1rem;
  border: 3px solid #000;
  padding: 0.5rem 1.5rem;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 4px 4px 0 #000;
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