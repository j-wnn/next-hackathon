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
  padding: 2rem 1rem;
  min-height: 100%;
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
        
        // First, output debug information
        await debugFirestore();
        
        // Get theme stats (for total games)
        const themeStatsRef = doc(db, "themeStats", selectedTheme);
        console.log("Fetching theme stats from:", themeStatsRef.path);
        
        const themeStatsDoc = await getDoc(themeStatsRef);
        
        if (themeStatsDoc.exists()) {
          console.log("Theme stats found:", themeStatsDoc.data());
          setThemeStats(themeStatsDoc.data());
        } else {
          console.log("No theme stats found, using defaults");
          setThemeStats({ totalGames: 0 });
        }
        
        // Get item rankings for the selected theme
        const itemsRef = collection(db, "themes", selectedTheme, "items");
        console.log("Fetching items from:", itemsRef.path);
        
        // Initialize an empty array for our items
        let items = [];
        
        // First, try to get items ordered by tournamentWins
        const tournamentQuery = query(itemsRef, orderBy("tournamentWins", "desc"));
        const itemsSnapshot = await getDocs(tournamentQuery);
        
        if (!itemsSnapshot.empty) {
          console.log(`Found ${itemsSnapshot.size} items with tournament data`);
          
          items = itemsSnapshot.docs.map(doc => {
            const data = doc.data();
            console.log(`Item ${doc.id}:`, data);
            
            return {
              id: doc.id,
              ...data,
              // Ensure these fields exist with default values
              tournamentWins: data.tournamentWins || 0,
              wins: data.wins || 0,
              matches: data.matches || 0,
              name: data.name || `Unknown (${doc.id})`,
              image: data.image || "https://via.placeholder.com/100"
            };
          });
          
          setRankingItems(items);
        } else {
          console.log("No items found with tournament data");
          setRankingItems([]);
        }
        
        // Log summary of what we found
        console.log(`Ranking data loaded: ${items.length} items, ${themeStatsDoc.exists() ? themeStatsDoc.data().totalGames : 0} total games`);
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

  return (
    <div className="home-root">
      <div className="container" style={{ minHeight: 'auto', justifyContent: 'flex-start', paddingTop: 32, maxWidth: '100%' }}>
        <Header />
        
        <TableWrap>
          <h2 style={{textAlign:'center', fontSize:'2.2rem', marginBottom:'2rem'}}>{selectedTheme} 랭킹</h2>
          
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
            items={filteredItems}
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