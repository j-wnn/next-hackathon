import React from 'react';
import styled from '@emotion/styled';
import { FaCheck } from 'react-icons/fa';

const ProgressContainer = styled.div`
  margin: 1rem 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const ProgressBarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 600px;
  background-color: #fff;
  border-radius: 16px;
  padding: 0.8rem 2rem;
  border: 3px solid #000;
  box-shadow: 6px 6px 0 #000;
  position: relative;
`;

const ProgressTitle = styled.div`
  font-size: 1.4rem;
  font-weight: 800;
  margin-bottom: 0.7rem;
  color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  border-bottom: 2px solid #eee;
  padding-bottom: 0.6rem;
`;

const ThemeName = styled.span`
  color: #8b0029;
`;

const StepsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const StepWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  position: relative;
  z-index: 2;
`;

const ProgressStep = styled.div`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: ${({ status }) =>
    status === 'done' ? '#555555' : status === 'active' ? '#8b0029' : '#f5f5f5'};
  color: ${({ status }) =>
    status === 'done' || status === 'active' ? '#fff' : '#888'};
  border: 2px solid #000;
  box-shadow: 3px 3px 0 #000;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.8rem;
  position: relative;
  z-index: 2;
  transition: background 0.2s, color 0.2s;
  flex-shrink: 0;
`;

// 체크 아이콘을 위한 스타일드 컴포넌트
const CheckIcon = styled.div`
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  & svg {
    width: 16px;
    height: 16px;
    fill: white;
  }
`;

const StepLabel = styled.div`
  margin-top: 8px;
  text-align: center;
  font-size: 1rem;
  color: #222;
  font-weight: 500;
`;

const CurrentRoundInfo = styled.div`
  font-size: 1rem;
  font-weight: 700;
  color: #333;
  margin-top: 0.5rem;
  padding: 0.3rem 0.8rem;
  border-radius: 8px;
`;

/**
 * A reusable tournament progress component
 * 
 * @param {Object} props
 * @param {Array} props.stages - Array of stage numbers (e.g. [32, 16, 8, 4, 2])
 * @param {number} props.currentStage - Current active stage
 * @param {number} props.currentRound - Current round within the stage
 * @param {number} props.totalRounds - Total rounds in current stage
 * @param {string} props.themeName - Name of the current theme
 */
const TournamentProgress = ({ 
  stages, 
  currentStage, 
  currentRound,
  totalRounds,
  themeName = ''
}) => {
  // 유효한 단계가 없는 경우 처리
  if (!stages || !Array.isArray(stages) || stages.length === 0) return null;
  
  // 표준 라운드 값과 매핑
  const standardRounds = [32, 16, 8, 4, 2];
  
  // 현재 스테이지를 표준 라운드로 맵핑
  const normalizedCurrentStage = standardRounds.find(round => 
    Math.abs(round - currentStage) <= 2
  ) || standardRounds[standardRounds.length - 1]; // 가장 가까운 표준 라운드로 정규화
  
  // 현재 스테이지의 인덱스 찾기
  let currentStageIndex = stages.findIndex(stage => stage === normalizedCurrentStage);
  
  // 일치하는 스테이지를 찾지 못한 경우 대체 로직
  if (currentStageIndex === -1) {
    // 현재 스테이지와 가장 가까운 값 찾기
    const closestStage = stages.reduce((prev, curr) => 
      Math.abs(curr - normalizedCurrentStage) < Math.abs(prev - normalizedCurrentStage) ? curr : prev
    );
    currentStageIndex = stages.indexOf(closestStage);
    
    // 여전히 찾지 못한 경우 첫 번째 요소 사용
    if (currentStageIndex === -1) {
      currentStageIndex = 0;
    }
  }
  
  // 스텝 상태 계산 - 인덱스 기반으로 변경
  const getStepStatus = (idx) => {
    if (idx < currentStageIndex) return 'done';     // 현재보다 왼쪽(이전 단계)는 완료
    if (idx === currentStageIndex) return 'active'; // 현재 단계는 활성
    return 'todo';                                 // 현재보다 오른쪽(이후 단계)는 미완료
  };

  // 라벨 텍스트 생성
  const getStepText = (stage, idx) => {
    if (idx === stages.length - 1 && stages.length > 1) return '결승';
    
    // 표준 라운드 텍스트 맵핑
    const stageLabels = {
      32: '32강',
      16: '16강',
      8: '8강',
      4: '4강',
      2: '결승'
    };
    
    // 표준 라벨이 있으면 사용하고, 없으면 stage+"강" 사용
    return stageLabels[stage] || `${Math.round(stage)}강`;
  };

  // 총 라운드 수 계산
  const calculatedTotalRounds = totalRounds || Math.max(1, Math.floor(currentStage / 2));

  return (
    <ProgressContainer>
      <ProgressBarContainer>
        <ProgressTitle>
          <ThemeName>{themeName}</ThemeName>
        </ProgressTitle>
        
        <StepsContainer>
          {stages.map((stage, idx) => (
            <StepWrapper key={stage || idx}>
              <ProgressStep status={getStepStatus(idx)}>
                {getStepText(stage, idx)}
              </ProgressStep>
            </StepWrapper>
          ))}
        </StepsContainer>
        
        <CurrentRoundInfo>
          {currentRound}/{calculatedTotalRounds} 라운드
        </CurrentRoundInfo>
      </ProgressBarContainer>
    </ProgressContainer>
  );
};

export default TournamentProgress;