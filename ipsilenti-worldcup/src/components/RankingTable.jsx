import React from 'react';
import styled from '@emotion/styled';
import ProgressBar from './ui/ProgressBar';

// Main table container with responsive behavior
const TableContainer = styled.div`
  position: relative;
  width: 100%;
  overflow-x: hidden;
`;

// Standard table for desktop
const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 6px 6px 0 #000;
  border: 3px solid #000;
  margin-top: 1.5rem;
  
  @media (max-width: 768px) {
    display: none; // Hide table on mobile
  }
`;

const Th = styled.th`
  background: #8b0029;
  font-weight: 800;
  padding: 1rem 0.8rem;
  border-bottom: 2px solid #000;
  text-align: center;
  color: #fff;
  font-size: 1rem;
  letter-spacing: -0.5px;
`;

const Td = styled.td`
  padding: 0.8rem 0.6rem;
  border-bottom: 1px solid #eee;
  text-align: center;
  font-size: 1rem;
  vertical-align: middle;
`;

// Mobile card view
const MobileCardContainer = styled.div`
  display: none;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  margin-top: 1.5rem;
  
  @media (max-width: 768px) {
    display: flex;
  }
`;

const RankCard = styled.div`
  background: #fff;
  border-radius: 10px;
  border: 3px solid #000;
  box-shadow: 5px 5px 0 #000;
  padding: 0.8rem;
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  aspect-ratio: 16/9;
  background: ${props => props.rank <= 3 ? '#fff9f0' : '#fff'};
  
  @media (max-width: 430px) {
    padding: 0.7rem;
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  gap: 0.8rem;
`;

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  justify-content: space-around;
`;

const StatRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  font-weight: 700;
  color: #555;
  
  @media (max-width: 430px) {
    font-size: 0.75rem;
  }
`;

const RankNumber = styled.div`
  font-weight: 800;
  font-size: 1.2rem;
  color: ${props => props.rank <= 3 ? '#8b0029' : '#333'};
  
  @media (max-width: 768px) {
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${props => props.rank <= 3 ? '#8b0029' : '#eee'};
    color: ${props => props.rank <= 3 ? '#fff' : '#333'};
    border-radius: 50%;
    border: 2px solid #000;
    box-shadow: 2px 2px 0 #000;
  }
`;

const ProfileImage = styled.img`
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid #000;
  box-shadow: 3px 3px 0 #000;
  
  @media (max-width: 768px) {
    width: 55px;
    height: 55px;
  }
  
  @media (max-width: 430px) {
    width: 50px;
    height: 50px;
  }
`;

const ProfileName = styled.div`
  font-weight: 700;
  margin-top: 0.3rem;
  font-size: 1rem;
  color: #000;
  
  @media (max-width: 768px) {
    margin-top: 0;
    font-size: 1.1rem;
    flex: 1;
  }
`;

const NoDataMessage = styled.div`
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: #333;
  background: #fff;
  border-radius: 10px;
  border: 3px solid #000;
  box-shadow: 6px 6px 0 #000;
  margin-top: 1.5rem;
`;

const RefreshButton = styled.button`
  padding: 0.7rem 1.2rem;
  background-color: #8b0029;
  color: white;
  font-weight: 700;
  border: 3px solid #000;
  border-radius: 8px;
  box-shadow: 4px 4px 0 #000;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
  margin-top: 1.5rem;
  
  &:hover {
    transform: translate(4px, 4px);
    box-shadow: none;
  }
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 3rem;
  font-size: 1.3rem;
  font-weight: 700;
  color: #8b0029;
  background: #fff;
  border-radius: 10px;
  border: 3px solid #000;
  box-shadow: 6px 6px 0 #000;
  margin-top: 1.5rem;
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 2.5rem;
  color: #8b0029;
  background: #fff;
  border-radius: 10px;
  border: 3px solid #000;
  box-shadow: 6px 6px 0 #000;
  margin-top: 1.5rem;
  
  p {
    font-size: 1.2rem;
    font-weight: 700;
    margin-bottom: 1rem;
  }
`;

const PaginationContainer = styled.div`
  margin-top: 2rem;
  width: 100%;
  display: flex;
  justify-content: center;
`;

const PageInfo = styled.div`
  text-align: center;
  margin-bottom: 1rem;
  font-size: 0.95rem;
  color: #666;
`;

const PaginationWrap = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 430px) {
    gap: 0.25rem;
  }
`;

const PageButton = styled.button`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
  background: ${props => props.active ? '#8b0029' : '#fff'};
  color: ${props => props.active ? '#fff' : '#000'};
  border: 2px solid #000;
  box-shadow: ${props => props.active ? 'none' : '2px 2px 0 #000'};
  opacity: ${props => props.active ? 1 : 1};
  
  &:hover:not([data-active="true"]) {
    transform: translate(2px, 2px);
    box-shadow: none;
  }
  
  @media (max-width: 430px) {
    width: 28px;
    height: 28px;
    font-size: 0.8rem;
    border-width: 1.5px;
    box-shadow: ${props => props.active ? 'none' : '1.5px 1.5px 0 #000'};
  }
`;

const NavButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
  background: #fff;
  color: #000;
  border: 2px solid #000;
  box-shadow: 2px 2px 0 #000;
  opacity: ${props => props.inactive ? 0.5 : 1};
  
  &:hover:not([data-inactive="true"]) {
    transform: translate(2px, 2px);
    box-shadow: none;
  }
  
  @media (max-width: 430px) {
    padding: 0.3rem 0.5rem;
    font-size: 0.8rem;
    border-width: 1.5px;
    box-shadow: 1.5px 1.5px 0 #000;
  }
`;

const RefreshOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  border-radius: 10px;
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid rgba(139, 0, 41, 0.2);
  border-radius: 50%;
  border-top-color: #8b0029;
  animation: spin 1s ease-in-out infinite;
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

// Skeleton loading animation
const Skeleton = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.6) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  animation: shimmer 1.5s infinite;
  
  @keyframes shimmer {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(100%);
    }
  }
`;

/**
 * A reusable ranking table component with pagination
 */
const RankingTable = ({ 
  items, 
  totalGames, 
  loading, 
  refreshing = false,
  error, 
  onRefresh,
  currentPage = 1,
  pageCount = 1,
  onPageChange,
  totalItems = 0
}) => {
  if (loading) {
    return <LoadingContainer>로딩 중...</LoadingContainer>;
  }
  
  if (error) {
    return (
      <ErrorContainer>
        <p>{error}</p>
        {onRefresh && (
          <RefreshButton onClick={onRefresh}>
            다시 시도
          </RefreshButton>
        )}
      </ErrorContainer>
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
  
  // Generate array of page numbers to display
  const getPageNumbers = () => {
    const maxPageItems = 5; // Maximum number of page links to show
    
    // For mobile, show fewer page items
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 768;
    const adjustedMaxPageItems = screenWidth <= 430 ? 3 : maxPageItems;
    
    let startPage = Math.max(1, currentPage - Math.floor(adjustedMaxPageItems / 2));
    let endPage = Math.min(pageCount, startPage + adjustedMaxPageItems - 1);
    
    // Adjust start page if needed to ensure we show adjustedMaxPageItems
    if (endPage - startPage + 1 < adjustedMaxPageItems && endPage < pageCount) {
      startPage = Math.max(1, endPage - adjustedMaxPageItems + 1);
    }
    
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };
  
  const pageNumbers = getPageNumbers();
  const startIndex = (currentPage - 1) * 20 + 1;
  const endIndex = Math.min(currentPage * 20, totalItems);
  
  return (
    <>
      <TableContainer>
        {refreshing && (
          <RefreshOverlay>
            <Spinner />
            <Skeleton />
          </RefreshOverlay>
        )}
        
        {/* Desktop Table View */}
        <Table>
          <thead>
            <tr>
              <Th width="8%">순위</Th>
              <Th width="12%">이미지</Th>
              <Th width="20%">이름</Th>
              <Th width="30%">우승비율<br/>(우승 횟수/총 게임 수)</Th>
              <Th width="30%">승률<br/>(1:1 시 승리 횟수/총 매치 수)</Th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => {
              const absoluteRank = (currentPage - 1) * 20 + idx + 1;
              // Calculate tournament win percentage
              const winPercent = totalGames > 0 
                ? ((item.tournamentWins || 0) / totalGames * 100)
                : 0;
                
              // Calculate match win rate
              const matchWinRate = item.matches > 0 
                ? ((item.wins || 0) / item.matches * 100)
                : 0;
                
              return (
                <tr key={item.id} style={{
                  background: idx % 2 === 0 ? '#fafafa' : '#fff',
                  // Highlight top 3 ranks
                  ...(absoluteRank <= 3 && {background: '#fff9f0'})
                }}>
                  <Td>
                    <RankNumber rank={absoluteRank}>{absoluteRank}</RankNumber>
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
                      showStats={true}
                      barColor="#8b0029"
                    />
                  </Td>
                  <Td>
                    <ProgressBar 
                      percent={matchWinRate} 
                      variant="match" 
                      value={item.wins || 0} 
                      total={item.matches || 0} 
                      showStats={true}
                      barColor="#8b0029"
                    />
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        
        {/* Mobile Card View */}
        <MobileCardContainer>
          {items.map((item, idx) => {
            const absoluteRank = (currentPage - 1) * 20 + idx + 1;
            const winPercent = totalGames > 0 
              ? ((item.tournamentWins || 0) / totalGames * 100)
              : 0;
            
            const matchWinRate = item.matches > 0 
              ? ((item.wins || 0) / item.matches * 100)
              : 0;
            
            return (
              <RankCard key={item.id} rank={absoluteRank}>
                <CardHeader>
                  <RankNumber rank={absoluteRank}>{absoluteRank}</RankNumber>
                  <ProfileImage src={item.image} alt={item.name} />
                  <ProfileName>{item.name}</ProfileName>
                </CardHeader>
                <CardBody>
                  <StatRow>
                    <StatLabel>우승비율 (우승 횟수/총 게임 수)</StatLabel>
                    <ProgressBar 
                      percent={winPercent} 
                      variant="win" 
                      value={item.tournamentWins || 0} 
                      total={totalGames} 
                      showStats={true}
                      barColor="#8b0029"
                    />
                  </StatRow>
                  <StatRow>
                    <StatLabel>승률 (1:1 시 승리 횟수/총 매치 수)</StatLabel>
                    <ProgressBar 
                      percent={matchWinRate} 
                      variant="match" 
                      value={item.wins || 0} 
                      total={item.matches || 0} 
                      showStats={true}
                      barColor="#8b0029"
                    />
                  </StatRow>
                </CardBody>
              </RankCard>
            );
          })}
        </MobileCardContainer>
      </TableContainer>
      
      {pageCount > 1 && (
        <PaginationContainer>
          <div>
            <PageInfo>
              전체 {totalItems}개 항목 중 {startIndex}-{endIndex}번 표시 중
            </PageInfo>
            <PaginationWrap>
              <NavButton 
                onClick={() => currentPage > 1 ? onPageChange(currentPage - 1) : null}
                inactive={currentPage === 1}
                data-inactive={currentPage === 1}
              >
                이전
              </NavButton>
              
              {pageNumbers.map(pageNum => (
                <PageButton
                  key={pageNum}
                  active={pageNum === currentPage}
                  data-active={pageNum === currentPage}
                  onClick={() => pageNum !== currentPage ? onPageChange(pageNum) : null}
                >
                  {pageNum}
                </PageButton>
              ))}
              
              <NavButton 
                onClick={() => currentPage < pageCount ? onPageChange(currentPage + 1) : null}
                inactive={currentPage === pageCount}
                data-inactive={currentPage === pageCount}
              >
                다음
              </NavButton>
            </PaginationWrap>
          </div>
        </PaginationContainer>
      )}
    </>
  );
};

export default RankingTable; 