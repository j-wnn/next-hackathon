import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { getFirestore, collection, query, orderBy, getDocs, where, doc, getDoc } from 'firebase/firestore';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ThemeSelector from '../components/ui/ThemeSelector';
import SearchBox from '../components/ui/SearchBox';
import RankingTable from '../components/RankingTable';
import "../styles/home.css"; // Import home styling
import { db } from "../lib/firebase";
import { themeNames } from "../data/themes"; // Import theme names from themes index

const TableWrap = styled.div`
  width: 100%;
  max-width: 900px;
  margin: 2rem auto;
  padding: 2rem;
  min-height: 100%;
  background-color: #fff;
  border-radius: 16px;
  border: 3px solid #000;
  box-shadow: 6px 6px 0 #000;
  position: relative;

  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
    margin: 1rem auto;
  }
`;

const FilterSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px dashed #eee;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
`;

const SearchSection = styled.div`
  display: flex;
  width: 300px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Title = styled.h2`
  text-align: center;
  font-size: 2.2rem;
  font-weight: 800;
  margin-top: 3.5rem;
  margin-bottom: 1.5rem;
  color: #000;
  padding-bottom: 0.8rem;
  border-bottom: 3px solid #eee;
  letter-spacing: -0.5px;

  span {
    color: #8b0029;
  }

  @media (max-width: 768px) {
    font-size: 1.7rem;
    margin-top: 3rem;
    margin-bottom: 1.2rem;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-top: 1.5rem;
  font-size: 1rem;
  border: 2px solid #000;
  border-radius: 8px;
  overflow: hidden;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const Th = styled.th`
  padding: 0.9rem 0.75rem;
  text-align: left;
  background-color: #8b0029;
  color: #fff;
  font-weight: 700;
  border-bottom: 2px solid #000;

  @media (max-width: 768px) {
    padding: 0.7rem 0.5rem;
  }
`;

const Td = styled.td`
  padding: 0.75rem;
  border-bottom: 1px solid #dee2e6;
  color: #333;

  @media (max-width: 768px) {
    padding: 0.6rem 0.5rem;
  }
`;

const RankCell = styled(Td)`
  font-weight: 800;
  color: #000;
  width: 60px;
  text-align: center;
  background: ${props => props.rank <= 3 ? '#f9f3e0' : 'transparent'};

  @media (max-width: 768px) {
    width: 40px;
  }
`;

const NameCell = styled(Td)`
  font-weight: 600;
  color: #000;
  width: 200px;

  @media (max-width: 768px) {
    width: auto;
  }
`;

const ScoreCell = styled(Td)`
  font-weight: 700;
  color: #8b0029;
  text-align: right;
  width: 100px;

  @media (max-width: 768px) {
    width: 80px;
  }
`;

const ThemeCell = styled(Td)`
  color: #555;
  width: 150px;

  @media (max-width: 768px) {
    width: auto;
  }
`;

const DateCell = styled(Td)`
  color: #555;
  width: 120px;

  @media (max-width: 768px) {
    width: auto;
  }
`;

const FilterButton = styled.button`
  padding: 0.6rem 1.2rem;
  margin-right: 0.6rem;
  border: 3px solid #000;
  border-radius: 8px;
  background-color: ${props => props.active ? '#8b0029' : '#fff'};
  color: ${props => props.active ? '#fff' : '#000'};
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.95rem;
  box-shadow: 3px 3px 0 #000;

  &:hover {
    transform: translate(3px, 3px);
    box-shadow: none;
  }

  @media (max-width: 768px) {
    padding: 0.5rem 0.9rem;
    font-size: 0.85rem;
    margin-right: 0.4rem;
  }
`;

const SearchInput = styled.input`
  padding: 0.7rem 1rem;
  border: 3px solid #000;
  border-radius: 8px;
  width: 100%;
  font-size: 0.95rem;
  font-weight: 600;
  box-shadow: 3px 3px 0 #000;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #8b0029;
    transform: translate(3px, 3px);
    box-shadow: none;
  }

  @media (max-width: 768px) {
    padding: 0.5rem 0.8rem;
    font-size: 0.85rem;
  }
`;

const HomeButton = styled.button`
  padding: 0.7rem 1.2rem;
  border: 3px solid #000;
  border-radius: 10px;
  background-color: #8b0029;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 4px 4px 0 #000;
  transition: all 0.2s;
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 5;
  
  &:hover {
    transform: translate(4px, 4px);
    box-shadow: none;
  }
  &:active {
    transform: translate(4px, 4px);
    box-shadow: none;
  }
  @media (max-width: 600px) {
    font-size: 0.9rem;
    padding: 0.5rem 0.9rem;
  }
`;

const BackButton = styled.button`
  padding: 0.6rem 0.9rem;
  border: 3px solid #000;
  border-radius: 10px;
  background-color: #fff;
  color: #000;
  font-size: 1.3rem;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 4px 4px 0 #000;
  transition: all 0.2s;
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 5;
  
  &:hover {
    transform: translate(4px, 4px);
    box-shadow: none;
  }
  &:active {
    transform: translate(4px, 4px);
    box-shadow: none;
  }
  @media (max-width: 600px) {
    font-size: 1.1rem;
    padding: 0.4rem 0.7rem;
  }
`;

const Ranking = () => {
  const [rankingItems, setRankingItems] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [themeStats, setThemeStats] = useState({
    totalGames: 0
  });
  const [selectedTheme, setSelectedTheme] = useState("입실렌티 라인업 월드컵");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [cameFromResult, setCameFromResult] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  
  const navigate = useNavigate();
  const location = useLocation();

  // Debug function to log the state of Firebase collections
  const debugFirestore = async () => {
    try {
      console.log("--------- DEBUGGING FIRESTORE ---------");
      
      // Check themeStats
      const themeStatsRef = doc(db, "themeStats", selectedTheme);
      const themeStatsDoc = await getDoc(themeStatsRef);
      console.log("ThemeStats document:", themeStatsDoc.exists() ? themeStatsDoc.data() : "Not found");
      
      // Check themes collection
      const themesPath = collection(db, "themes", selectedTheme, "items");
      const themesSnapshot = await getDocs(themesPath);
      console.log(`Items in theme "${selectedTheme}":`, themesSnapshot.size);
      themesSnapshot.forEach(doc => {
        console.log(`- Item ${doc.id}:`, doc.data());
      });
      
      // Check tournamentWinners
      const twQuery = query(collection(db, "tournamentWinners"), where("theme", "==", selectedTheme));
      const twSnapshot = await getDocs(twQuery);
      console.log(`Tournament winners for "${selectedTheme}":`, twSnapshot.size);
      
      // Check matches
      const matchesQuery = query(collection(db, "matches"), where("theme", "==", selectedTheme));
      const matchesSnapshot = await getDocs(matchesQuery);
      console.log(`Matches for "${selectedTheme}":`, matchesSnapshot.size);
      
      console.log("--------- END DEBUGGING ---------");
    } catch (error) {
      console.error("Error during Firestore debugging:", error);
    }
  };

  useEffect(() => {
    // If theme is in location state, use it
    if (location.state?.theme && themeNames.includes(location.state.theme)) {
      console.log("Setting theme from navigation:", location.state.theme);
      setSelectedTheme(location.state.theme);
    } else {
      console.log("Using default theme:", selectedTheme);
    }
    
    // Check if came from Result page
    if (location.state?.fromResult) {
      setCameFromResult(true);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchRankingData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log("Fetching ranking data for theme:", selectedTheme);
        
        // 새로운 데이터 구조에서 테마 아이템 가져오기
        const themeRef = collection(db, selectedTheme);
        console.log("Fetching items from collection:", selectedTheme);
        
        // FinalWinnerCount 기준으로 정렬하여 문서 가져오기
        const rankingQuery = query(themeRef, orderBy("FinalWinnerCount", "desc"));
        const itemsSnapshot = await getDocs(rankingQuery);
        
        if (!itemsSnapshot.empty) {
          console.log(`Found ${itemsSnapshot.size} items in the theme collection`);
          
          // 문서 데이터 매핑
          const items = itemsSnapshot.docs.map(doc => {
            const data = doc.data();
            console.log(`Item ${doc.id}:`, data);
            
            return {
              id: doc.id,
              name: data.name || `Unknown (${doc.id})`,
              image: data.image || "https://via.placeholder.com/100",
              tournamentWins: data.FinalWinnerCount || 0,
              wins: data.MatchWinnerCount || 0,
              matches: data.matchCount || 0
            };
          });
          
          setRankingItems(items);
          
          // 전체 게임 수 계산 (모든 FinalWinnerCount의 합)
          const totalGames = items.reduce((sum, item) => sum + (item.tournamentWins || 0), 0);
          setThemeStats({ totalGames });
          
          console.log(`Ranking data loaded: ${items.length} items, ${totalGames} total games`);
        } else {
          console.log("No items found for this theme");
          setRankingItems([]);
          setThemeStats({ totalGames: 0 });
        }
      } catch (error) {
        console.error("Error fetching ranking data:", error);
        setError(`데이터 로딩 오류: ${error.message}`);
        setRankingItems([]);
      }
      
      setLoading(false);
    };
    
    if (selectedTheme) {
      fetchRankingData();
    }
  }, [selectedTheme]);

  // Handle theme change
  const handleThemeChange = (e) => {
    const newTheme = e.target.value;
    console.log("Theme changed to:", newTheme);
    setSelectedTheme(newTheme);
    setSearch(""); // Reset search
    setSearchInput(""); // Reset search input
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchInput);
    setSearch(searchInput);
  };

  // Force refresh ranking data with delay
  const handleRefresh = () => {
    console.log("Manual refresh requested");
    
    // Set refreshing state
    setRefreshing(true);
    
    // Add artificial delay
    setTimeout(() => {
      // Re-fetch with same theme to force refresh
      const currentTheme = selectedTheme;
      setSelectedTheme(currentTheme);
      
      // Reset refreshing state after a short delay (to allow for transition effects)
      setTimeout(() => {
        setRefreshing(false);
      }, 100);
    }, 500);
  };

  // Handle pagination
  const onPageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoHome = () => {
    navigate('/');
  };
  
  const handleGoBack = () => {
    if (cameFromResult) {
      // Navigate back to the result page with the same parameters if available
      navigate('/result', { 
        state: location.state?.resultData || {}
      });
    } else {
      // Fallback to home if somehow the back button is shown but not from result
      navigate('/');
    }
  };

  // Filter items by search
  const filteredItems = rankingItems.filter(item => 
    item.name && item.name.toLowerCase().includes(search.toLowerCase())
  );

  // 1순위: 우승비율, 2순위: 승률 기준으로 정렬
  const sortedItems = filteredItems.slice().sort((a, b) => {
    // 우승비율 계산
    const aWinPercent = themeStats.totalGames > 0 ? (a.tournamentWins / themeStats.totalGames) : 0;
    const bWinPercent = themeStats.totalGames > 0 ? (b.tournamentWins / themeStats.totalGames) : 0;
    if (bWinPercent !== aWinPercent) {
      return bWinPercent - aWinPercent;
    }
    // 승률 계산
    const aMatchRate = a.matches > 0 ? (a.wins / a.matches) : 0;
    const bMatchRate = b.matches > 0 ? (b.wins / b.matches) : 0;
    return bMatchRate - aMatchRate;
  });

  // Calculate paginated items
  const pageCount = Math.ceil(sortedItems.length / itemsPerPage);
  const paginatedItems = sortedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="home-root">
      <div className="container" style={{ 
        minHeight: 'auto', 
        justifyContent: 'flex-start', 
        paddingTop: 32, 
        maxWidth: '100%', 
        backgroundColor: '#ffffff',
        paddingBottom: '2rem'
      }}>
        <Header onTitleClick={handleGoHome} />
        
        <TableWrap>
          {cameFromResult && (
            <BackButton onClick={handleGoBack}>
              &lt;
            </BackButton>
          )}
          <HomeButton onClick={handleGoHome}>처음으로</HomeButton>
          <Title><span>{selectedTheme}</span> 랭킹</Title>
          
          <FilterSection>
            <ThemeSelector
              selectedTheme={selectedTheme}
              onChange={handleThemeChange}
              onRefresh={handleRefresh}
            />
            
            <SearchSection>
              <SearchBox
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onSubmit={handleSearch}
              />
            </SearchSection>
          </FilterSection>
          
          <RankingTable
            items={paginatedItems}
            totalGames={themeStats.totalGames}
            loading={loading}
            refreshing={refreshing}
            error={error}
            onRefresh={handleRefresh}
            currentPage={currentPage}
            pageCount={pageCount}
            onPageChange={onPageChange}
            totalItems={sortedItems.length}
          />
        </TableWrap>
        
        <Footer />
      </div>
    </div>
  );
};

export default Ranking; 