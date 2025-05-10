import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./worldcup.module.css";
import { getThemeItems, themeItems, themeNames } from "../data/themes";
import Header from '../components/Header';
import Footer from '../components/Footer';
import CandidateCard from '../components/CandidateCard';
import TournamentProgress from '../components/TournamentProgress';
import "../styles/home.css"; // Import home styling
import { 
    doc, 
    getDoc, 
    setDoc, 
    updateDoc, 
    increment, 
    serverTimestamp,
    collection, 
    addDoc,
    getDocs,
    query,
    where,
    writeBatch
} from "firebase/firestore";
import { db } from "../lib/firebase";
import styled from "@emotion/styled";

const ThemeTitle = styled.div`
  background-color: #ffffff;
  color: #000000;
  font-size: 1.6rem;
  font-weight: 800;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  margin: 1rem 0;
  display: inline-flex;
  align-items: center;
  border: 3px solid #000;
  box-shadow: 6px 6px 0 #000;
`;

const RoundBadge = styled.span`
  background-color: #8b0029;
  color: white;
  font-size: 1rem;
  font-weight: 700;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  margin-left: 1rem;
  border: 2px solid #000;
  box-shadow: 3px 3px 0 #000;
  transition: all 0.2s ease;
`;

const CandidatesContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 2rem;
  margin: 1rem auto;
  width: 100%;
  max-width: 900px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }
`;

const CandidateWrapper = styled.div`
  flex: 1;
  max-width: 400px;
  
  @media (max-width: 768px) {
    width: 90%;
  }
`;

const Worldcup = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const selectedTheme = location.state?.selectedTheme || "라인업 월드컵"; // Default theme if none selected
    const selectedRound = location.state?.selectedRound || 8; // Default to 8 if not specified

    const [items, setItems] = useState([]);
    const [currentRound, setCurrentRound] = useState(0);
    const [totalRounds, setTotalRounds] = useState(0);
    const [winners, setWinners] = useState([]);
    const [currentPair, setCurrentPair] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [slideDirection, setSlideDirection] = useState(null);
    const [currentStage, setCurrentStage] = useState(0);
    const [finalWinner, setFinalWinner] = useState(null);
    const [matchStats, setMatchStats] = useState({}); // Track win/loss for each item
    const [matchHistory, setMatchHistory] = useState([]); // Track all match results

    useEffect(() => {
        // Return to home if accessed directly without a theme
        if (!location.state && !selectedTheme) {
            navigate('/');
            return;
        }
        
        initializeGame();
    }, [selectedTheme, selectedRound]);

    const initializeGame = () => {
        // Get all items for the selected theme
        const allThemeItems = getThemeItems(selectedTheme);
        
        // Shuffle all items
        const shuffledItems = [...allThemeItems].sort(() => Math.random() - 0.5);
        
        // Take only the number of items required for the selected round
        const limitedItems = shuffledItems.slice(0, selectedRound);
        
        // Set the items for the game
        setItems(limitedItems);

        // Initialize match stats for each item
        const initialStats = {};
        limitedItems.forEach(item => {
            initialStats[item.id] = { 
                wins: 0, 
                matches: 0
            };
        });
        setMatchStats(initialStats);
        setMatchHistory([]);

        // Calculate stages based on the selected round
        const itemCount = limitedItems.length;
        setTotalRounds(itemCount / 2);

        // Initialize with first pair
        setCurrentPair([limitedItems[0], limitedItems[1]]);
        setCurrentRound(1);
        setCurrentStage(itemCount);
    };

    const getStages = () => {
        const itemCount = items.length || selectedRound;
        const stages = [];
        let stage = itemCount;
        while (stage > 1) {
            stages.push(stage);
            stage = stage / 2;
        }
        return stages;
    };

    // Initialize or update themeStats document
    const initializeThemeStats = async () => {
        try {
            console.log("Initializing theme stats for:", selectedTheme);
            const themeStatsRef = doc(db, "themeStats", selectedTheme);
            const themeDoc = await getDoc(themeStatsRef);
            
            if (themeDoc.exists()) {
                console.log("Theme stats exists, updating");
                await updateDoc(themeStatsRef, {
                    totalGames: increment(1),
                    lastUpdated: serverTimestamp()
                });
            } else {
                console.log("Theme stats doesn't exist, creating");
                await setDoc(themeStatsRef, {
                    totalGames: 1,
                    themeName: selectedTheme,
                    lastUpdated: serverTimestamp()
                });
            }
            console.log("Theme stats updated successfully");
        } catch (error) {
            console.error("Error initializing theme stats:", error);
        }
    };

    // Record individual match result
    const recordMatchResult = async (winner, loser, stage) => {
        try {
            console.log(`Recording match result: ${winner.artistName} beat ${loser.artistName}`);
            
            // Record this match in our history state
            setMatchHistory(prev => [...prev, {
                winnerId: winner.id,
                loserId: loser.id,
                stage: stage,
                timestamp: new Date()
            }]);
            
            // Record match result to Firestore
            const matchRef = await addDoc(collection(db, "matches"), {
                theme: selectedTheme,
                round: selectedRound,
                stage: stage,
                winnerId: winner.id,
                winnerName: winner.artistName,
                loserId: loser.id,
                loserName: loser.artistName,
                timestamp: serverTimestamp()
            });
            
            console.log("Match recorded with ID:", matchRef.id);
            
            // Update item stats for both players
            await updateItemMatchStats(winner.id, true);  // Winner
            await updateItemMatchStats(loser.id, false);  // Loser
            
        } catch (error) {
            console.error("Error recording match result:", error);
        }
    };
    
    // Update match statistics for an item
    const updateItemMatchStats = async (itemId, isWinner) => {
        try {
            const itemData = items.find(item => item.id.toString() === itemId.toString());
            if (!itemData) {
                console.error("Item not found:", itemId);
                return;
            }
            
            console.log(`Updating match stats for ${itemData.artistName}, winner: ${isWinner}`);
            
            const itemRef = doc(db, "themes", selectedTheme, "items", itemId.toString());
            const itemDoc = await getDoc(itemRef);
            
            if (itemDoc.exists()) {
                // Update existing document
                const updateData = {
                    matches: increment(1),
                    lastUpdated: serverTimestamp()
                };
                
                if (isWinner) {
                    updateData.wins = increment(1);
                }
                
                await updateDoc(itemRef, updateData);
                
                // Now get the updated document to calculate win rate
                const updatedDoc = await getDoc(itemRef);
                const data = updatedDoc.data();
                
                if (data.matches > 0) {
                    await updateDoc(itemRef, {
                        winRate: data.wins / data.matches
                    });
                }
            } else {
                // Create new document if it doesn't exist
                const newData = {
                    id: itemId,
                    name: itemData.artistName,
                    image: itemData.image,
                    wins: isWinner ? 1 : 0,
                    matches: 1,
                    tournamentWins: 0,
                    winRate: isWinner ? 1 : 0,
                    lastUpdated: serverTimestamp()
                };
                
                await setDoc(itemRef, newData);
            }
            
            console.log(`Match stats updated for ${itemData.artistName}`);
        } catch (error) {
            console.error(`Error updating match stats for item ${itemId}:`, error);
        }
    };

    // Record tournament winner
    const recordTournamentWinner = async (winner) => {
        try {
            // Check if the theme is valid
            if (!themeNames.includes(selectedTheme)) {
                console.error("Invalid theme:", selectedTheme);
                return;
            }
            
            console.log(`Recording tournament winner: ${winner.artistName}`);
            
            // Update theme stats (total games count)
            await initializeThemeStats();
            
            // Record this tournament winner
            const winnerRef = await addDoc(collection(db, "tournamentWinners"), {
                theme: selectedTheme,
                round: selectedRound,
                winnerId: winner.id,
                winnerName: winner.artistName,
                winnerImage: winner.image,
                matchHistory: matchHistory,
                timestamp: serverTimestamp()
            });
            
            console.log("Tournament winner recorded with ID:", winnerRef.id);
            
            // Update winner's tournament wins count
            const itemRef = doc(db, "themes", selectedTheme, "items", winner.id.toString());
            const itemDoc = await getDoc(itemRef);
            
            if (itemDoc.exists()) {
                await updateDoc(itemRef, {
                    tournamentWins: increment(1),
                    lastWin: serverTimestamp()
                });
            } else {
                // This should not happen as the item should have been created during match updates
                // But just in case, create it
                await setDoc(itemRef, {
                    id: winner.id,
                    name: winner.artistName,
                    image: winner.image,
                    tournamentWins: 1,
                    wins: matchStats[winner.id].wins,
                    matches: matchStats[winner.id].matches,
                    winRate: matchStats[winner.id].matches > 0 ? matchStats[winner.id].wins / matchStats[winner.id].matches : 0,
                    lastWin: serverTimestamp()
                });
            }
            
            console.log("Tournament winner stats updated successfully");
        } catch (error) {
            console.error("Error saving tournament results:", error);
        }
    };

    const handleSelect = async (selected, direction) => {
        if (isAnimating) return;

        setIsAnimating(true);
        setSelectedItem(selected);
        setSlideDirection(direction);

        // Find the loser item
        const loser = currentPair.find(item => item.id !== selected.id);
        if (!loser) {
            console.error("Could not find loser item");
            setIsAnimating(false);
            return;
        }

        // Update match stats for both items in the pair
        setMatchStats(prev => {
            const updatedStats = { ...prev };
            
            // Winner gets a win and a match
            updatedStats[selected.id] = {
                wins: updatedStats[selected.id].wins + 1,
                matches: updatedStats[selected.id].matches + 1
            };
            
            // Loser just gets a match
            updatedStats[loser.id] = {
                wins: updatedStats[loser.id].wins,
                matches: updatedStats[loser.id].matches + 1
            };
            
            return updatedStats;
        });

        // Record this match result
        await recordMatchResult(selected, loser, currentStage);

        await new Promise((resolve) => setTimeout(resolve, 1500));

        const newWinners = [...winners, selected];
        setWinners(newWinners);

        const nextIndex = currentRound * 2;
        if (nextIndex < items.length - 1) {
            setCurrentPair([items[nextIndex], items[nextIndex + 1]]);
            setCurrentRound(currentRound + 1);
        } else if (winners.length + 1 === currentStage / 2) {
            const nextStage = currentStage / 2;
            if (nextStage >= 2) {
                setItems([...newWinners, selected]);
                setWinners([]);
                setCurrentRound(1);
                setCurrentStage(nextStage);
                setCurrentPair([newWinners[0], newWinners[1]]);
            } else {
                setFinalWinner(selected);
                
                // Record tournament winner before navigating
                await recordTournamentWinner(selected);
                
                // Navigate to results page with winner and theme info
                navigate('/result', { 
                    state: { 
                        winner: selected,
                        theme: selectedTheme,
                        totalRound: selectedRound
                    } 
                });
            }
        }

        setSelectedItem(null);
        setSlideDirection(null);
        setIsAnimating(false);
    };

    return (
        <div className="home-root">
            <div className="container" style={{ minHeight: 'auto', justifyContent: 'flex-start', paddingTop: 32 }}>
                <Header />
                
                <ThemeTitle>
                    {selectedTheme} <RoundBadge>{selectedRound}강</RoundBadge>
                </ThemeTitle>
                
                <TournamentProgress
                    stages={getStages()}
                    currentStage={currentStage}
                    currentRound={currentRound}
                    totalRounds={currentStage / 2}
                />

                <CandidatesContainer>
                    {currentPair.map((item, index) => (
                        <CandidateWrapper key={item.id}>
                            <CandidateCard
                                item={item}
                                onClick={() => handleSelect(item, index === 0 ? "left" : "right")}
                                isSelected={selectedItem?.id === item.id}
                                slideDirection={
                                    slideDirection === "left" && index === 1
                                        ? "right"
                                        : slideDirection === "right" && index === 0
                                        ? "left"
                                        : null
                                }
                            />
                        </CandidateWrapper>
                    ))}
                </CandidatesContainer>
                
                <Footer />
            </div>
        </div>
    );
};

export default Worldcup;