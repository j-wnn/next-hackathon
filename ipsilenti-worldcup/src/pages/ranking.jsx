import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, orderBy, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

// Firebase 설정 (result.jsx와 동일하게 맞춰주세요)
const firebaseConfig = {
  apiKey: "AIzaSyDHQdKh0KTYXKtGfapCB7Ztmf1WL3vY2kA",
  authDomain: "ipsilenti-worldcup.firebaseapp.com",
  projectId: "ipsilenti-worldcup",
  storageBucket: "ipsilenti-worldcup.firebasestorage.app",
  messagingSenderId: "580015752446",
  appId: "1:580015752446:web:77fe98cbacd4fe68c391af",
  measurementId: "G-NR9H8T2D2K"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const TableWrap = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  background: #f5f5f5;
  min-height: 100vh;
`;
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
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
const Img = styled.img`
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 8px;
`;
const ProgressBarWrap = styled.div`
  background: #f3f3f3;
  border-radius: 8px;
  width: 100%;
  height: 22px;
  position: relative;
`;
const ProgressBar = styled.div`
  height: 100%;
  border-radius: 8px;
  background: repeating-linear-gradient(135deg, #ff8a80, #ff8a80 10px, #ffb199 10px, #ffb199 20px);
  width: ${props => props.percent}%;
  min-width: 2%;
  transition: width 0.5s;
`;
const ProgressBar2 = styled.div`
  height: 100%;
  border-radius: 8px;
  background: repeating-linear-gradient(135deg, #ffb300, #ffb300 10px, #ffe082 10px, #ffe082 20px);
  width: ${props => props.percent}%;
  min-width: 2%;
  transition: width 0.5s;
`;
const SearchInput = styled.input`
  padding: 0.7rem 1rem;
  border: 1px solid #ccc;
  border-radius: 8px 0 0 8px;
  font-size: 1rem;
  width: 250px;
  height: 48px;
  box-sizing: border-box;
  outline: none;
`;
const SearchButton = styled.button`
  padding: 0.7rem 1.2rem;
  border: none;
  border-radius: 0 8px 8px 0;
  background: #283593;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  height: 48px;
  box-sizing: border-box;
  transition: background 0.3s;
  display: flex;
  align-items: center;
  &:hover { background: #1a237e; }
`;
const Button = styled.button`
  padding: 0.7rem 1rem;
  border: none;
  border-radius: 8px;
  background: #007bff;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #0056b3;
  }
`;

const Ranking = () => {
  const [ranking, setRanking] = useState([]);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRanking = async () => {
      const q = query(collection(db, 'winners'), orderBy('count', 'desc'));
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRanking(data);
      setTotal(data.reduce((acc, cur) => acc + (cur.count || 0), 0));
    };
    fetchRanking();
  }, []);

  // 검색 필터
  const filtered = ranking.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));

  // 검색 버튼 클릭 또는 엔터 시
  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  return (
    <TableWrap>
      <h2 style={{textAlign:'center', fontSize:'2.2rem', marginBottom:'2rem'}}>이상형 월드컵 우승 랭킹</h2>
      <form style={{display:'flex', justifyContent:'flex-end', alignItems:'center', marginBottom:'1.5rem'}} onSubmit={handleSearch}>
        <SearchInput
          placeholder="검색"
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
        />
        <SearchButton type="submit">검색</SearchButton>
      </form>
      <Table>
        <thead>
          <tr>
            <Th>순위</Th>
            <Th>이미지</Th>
            <Th>이름</Th>
            <Th>우승비율<br/><span style={{fontWeight:400, fontSize:'0.95em'}}>(우승 횟수 / 전체 우승)</span></Th>
            <Th>승률<br/><span style={{fontWeight:400, fontSize:'0.95em'}}>(임시: 우승비율과 동일)</span></Th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((item, idx) => {
            const percent = total ? ((item.count/total)*100).toFixed(2) : 0;
            return (
              <tr key={item.id} style={{background: idx%2===0 ? '#fafbff' : '#fff'}}>
                <Td style={{fontWeight:700, fontSize:'1.2rem'}}>{idx+1}</Td>
                <Td><Img src={item.image} alt={item.name} /></Td>
                <Td style={{fontWeight:600}}>{item.name}</Td>
                <Td>
                  <div style={{display:'flex', alignItems:'center', gap:8}}>
                    <span style={{minWidth:55, fontWeight:600}}>{percent}%</span>
                    <ProgressBarWrap>
                      <ProgressBar percent={percent} />
                    </ProgressBarWrap>
                  </div>
                </Td>
                <Td>
                  <div style={{display:'flex', alignItems:'center', gap:8}}>
                    <span style={{minWidth:55, fontWeight:600}}>{percent}%</span>
                    <ProgressBarWrap>
                      <ProgressBar2 percent={percent} />
                    </ProgressBarWrap>
                  </div>
                </Td>
              </tr>
            )
          })}
        </tbody>
      </Table>
      <div style={{display:'flex', justifyContent:'flex-end', marginTop:'2rem'}}>
        <Button onClick={() => navigate('/ranking')}>랭킹보기</Button>
      </div>
    </TableWrap>
  );
};

export default Ranking; 