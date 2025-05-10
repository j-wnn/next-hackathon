import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { initializeThemeData, checkInitializedThemes } from '../lib/initializeFirestore';
import Header from '../components/Header';
import Footer from '../components/Footer';
import "../styles/home.css";

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const Title = styled.h1`
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: #333;
`;

const Section = styled.div`
  margin-bottom: 2rem;
  padding: 1.5rem;
  border: 1px solid #eee;
  border-radius: 8px;
`;

const SectionTitle = styled.h2`
  font-size: 1.4rem;
  margin-bottom: 1rem;
  color: #444;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #3949ab;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #303f9f;
  }
  
  &:disabled {
    background-color: #9e9e9e;
    cursor: not-allowed;
  }
`;

const StatusText = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background-color: ${props => props.success ? '#e8f5e9' : props.error ? '#ffebee' : '#f5f5f5'};
  border-radius: 4px;
  color: ${props => props.success ? '#2e7d32' : props.error ? '#c62828' : '#616161'};
`;

const ThemeStats = styled.div`
  margin-top: 1rem;
`;

const ThemeItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
`;

const Admin = () => {
  const [initializing, setInitializing] = useState(false);
  const [status, setStatus] = useState(null);
  const [themeStats, setThemeStats] = useState(null);
  
  // 초기화 시 테마 데이터 확인
  useEffect(() => {
    checkThemeData();
  }, []);
  
  // 테마 데이터 초기화 상태 확인
  const checkThemeData = async () => {
    const stats = await checkInitializedThemes();
    setThemeStats(stats);
  };
  
  // 테마 데이터 초기화 함수
  const handleInitializeData = async () => {
    if (window.confirm('기존 데이터가 있다면 덮어쓰게 됩니다. 계속하시겠습니까?')) {
      setInitializing(true);
      setStatus({ type: 'info', message: '테마 데이터 초기화 중...' });
      
      try {
        const result = await initializeThemeData();
        
        if (result) {
          setStatus({ type: 'success', message: '테마 데이터 초기화가 완료되었습니다!' });
        } else {
          setStatus({ type: 'error', message: '테마 데이터 초기화 중 오류가 발생했습니다.' });
        }
        
        // 초기화 후 데이터 상태 확인
        await checkThemeData();
      } catch (error) {
        console.error('초기화 오류:', error);
        setStatus({ 
          type: 'error', 
          message: `테마 데이터 초기화 중 오류가 발생했습니다: ${error.message}` 
        });
      } finally {
        setInitializing(false);
      }
    }
  };
  
  return (
    <div className="home-root">
      <div className="container" style={{ minHeight: 'auto', justifyContent: 'flex-start', paddingTop: 32 }}>
        <Header />
        
        <Container>
          <Title>관리자 페이지</Title>
          
          <Section>
            <SectionTitle>테마 데이터 초기화</SectionTitle>
            <p>
              Firestore에 모든 테마 데이터를 초기화합니다.
              각 테마마다 컬렉션이 생성되고, 해당 테마의 아이템이 문서로 추가됩니다.
            </p>
            
            <Button 
              onClick={handleInitializeData} 
              disabled={initializing}
            >
              {initializing ? '초기화 중...' : '테마 데이터 초기화'}
            </Button>
            
            {status && (
              <StatusText 
                success={status.type === 'success'} 
                error={status.type === 'error'}
              >
                {status.message}
              </StatusText>
            )}
            
            {themeStats && (
              <ThemeStats>
                <h3>테마별 데이터 현황</h3>
                {Object.entries(themeStats).map(([theme, count]) => (
                  <ThemeItem key={theme}>
                    <span>{theme}</span>
                    <span>{count}개 아이템</span>
                  </ThemeItem>
                ))}
              </ThemeStats>
            )}
          </Section>
        </Container>
        
        <Footer />
      </div>
    </div>
  );
};

export default Admin; 