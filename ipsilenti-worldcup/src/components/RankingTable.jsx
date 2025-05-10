import React from 'react';
import styled from '@emotion/styled';
import ProgressBar from './ui/ProgressBar';

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  margin-top: 1.5rem;
`;

const Th = styled.th`
  background: #f0f2fa;
  font-weight: 700;
  padding: 1rem 0.5rem;
  border-bottom: 2px solid #e0e0e0;
  text-align: center;
`;

const Td = styled.td`
  padding: 0.8rem 0.5rem;
  border-bottom: 1px solid #f0f0f0;
  text-align: center;
  font-size: 1rem;
`;

const RankNumber = styled.div`
  font-weight: 700;
  font-size: 1.2rem;
`;

const ProfileImage = styled.img`
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
`;

const ProfileName = styled.div`
  font-weight: 600;
  margin-top: 0.2rem;
`;

const NoDataMessage = styled.div`
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: #666;
`;

/**
 * A reusable ranking table component
 * 
 * @param {Object} props
 * @param {Array} props.items - Array of ranking items to display
 * @param {number} props.totalGames - Total number of games played for win percentage
 * @param {boolean} props.loading - Whether data is loading
 * @param {string} props.error - Error message, if any
 * @param {function} props.onRefresh - Callback when refresh is requested
 */
const RankingTable = ({ 
  items, 
  totalGames, 
  loading, 
  error, 
  onRefresh 
}) => {
  if (loading) {
    return <div style={{textAlign: 'center', padding: '2rem'}}>로딩 중...</div>;
  }
  
  if (error) {
    return (
      <div style={{textAlign: 'center', padding: '2rem', color: 'red'}}>
        <p>{error}</p>
        {onRefresh && (
          <button 
            onClick={onRefresh} 
            style={{padding: '0.5rem 1rem', marginTop: '1rem'}}
          >
            다시 시도
          </button>
        )}
      </div>
    );
  }
  
  if (!items || items.length === 0) {
    return (
      <NoDataMessage>
        <p>아직 랭킹 데이터가 없습니다.</p>
        <p>월드컵 게임을 플레이하고 다시 확인해주세요!</p>
      </NoDataMessage>
    );
  }
  
  return (
    <Table>
      <thead>
        <tr>
          <Th>순위</Th>
          <Th>이미지</Th>
          <Th>이름</Th>
          <Th>우승비율<br/><span style={{fontWeight:400, fontSize:'0.95em'}}>(우승 횟수 / 전체 게임 수)</span></Th>
          <Th>승률<br/><span style={{fontWeight:400, fontSize:'0.95em'}}>(승리횟수 / 전체 1:1대결 수)</span></Th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, idx) => {
          // Calculate tournament win percentage
          const winPercent = totalGames > 0 
            ? ((item.tournamentWins || 0) / totalGames * 100)
            : 0;
            
          // Calculate match win rate
          const matchWinRate = item.matches > 0 
            ? ((item.wins || 0) / item.matches * 100)
            : 0;
            
          return (
            <tr key={item.id} style={{background: idx % 2 === 0 ? '#fafbff' : '#fff'}}>
              <Td>
                <RankNumber>{idx + 1}</RankNumber>
              </Td>
              <Td>
                <ProfileImage src={item.image} alt={item.name} />
              </Td>
              <Td>
                <ProfileName>{item.name}</ProfileName>
              </Td>
              <Td>
                <ProgressBar 
                  percent={winPercent} 
                  variant="win" 
                  value={item.tournamentWins || 0} 
                  total={totalGames} 
                />
              </Td>
              <Td>
                <ProgressBar 
                  percent={matchWinRate} 
                  variant="match" 
                  value={item.wins || 0} 
                  total={item.matches || 0} 
                />
              </Td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

export default RankingTable; 