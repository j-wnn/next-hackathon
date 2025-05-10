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
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem 1rem;
  min-height: 100%;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
`;

const FilterSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const SearchSection = styled.div`
  display: flex;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #333;
`;

const Ranking = () => {
  const [rankingItems, setRankingItems] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [themeStats, setThemeStats] = useState({
    totalGames: 0
  });
  const [selectedTheme, setSelectedTheme] = useState("라인업 월드컵");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
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

  // Force refresh ranking data
  const handleRefresh = () => {
    console.log("Manual refresh requested");
    // Re-fetch with same theme to force refresh
    const currentTheme = selectedTheme;
    setSelectedTheme(currentTheme);
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

  return (
    <div className="home-root">
      <div className="container" style={{ minHeight: 'auto', justifyContent: 'flex-start', paddingTop: 32, maxWidth: '100%', backgroundColor: '#f5f7fa' }}>
        <Header />
        
        <TableWrap>
          <Title>{selectedTheme} 랭킹</Title>
          
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
            items={sortedItems}
            totalGames={themeStats.totalGames}
            loading={loading}
            error={error}
            onRefresh={handleRefresh}
          />
        </TableWrap>
        
        <Footer />
      </div>
    </div>
  );
};

export default Ranking; 