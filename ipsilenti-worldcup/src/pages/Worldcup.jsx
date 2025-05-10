import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Worldcup.module.css";
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

const CandidatesContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 2.5rem;
  margin: 1rem auto;
  width: 100%;
  max-width: 900px;
  min-height: 45vh;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
    align-items: center;
    min-height: 55vh;
  }
`;

const CandidateWrapper = styled.div`
  flex: 1;
  max-width: 480px;
  height: 100%;
  max-height: 360px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 768px) {
    width: 90%;
    max-height: 35vh;
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
        setTotalRounds(Math.max(1, Math.floor(itemCount / 2)));

        // 표준 토너먼트 라운드 값을 사용하여 currentStage 설정
        try {
            const standardRounds = [32, 16, 8, 4, 2];
            let closestStandardRound;
            
            // 정확히 일치하는 표준 라운드 찾기
            if (standardRounds.includes(itemCount)) {
                closestStandardRound = itemCount;
            } else {
                // 가장 가까운 작은 표준 라운드 찾기
                closestStandardRound = standardRounds.find(r => r <= itemCount);
            }
            
            // 유효한 값이 없는 경우 가장 작은 표준 라운드 사용
            if (!closestStandardRound || closestStandardRound < 2) {
                closestStandardRound = 2;
            }
            
            setCurrentStage(closestStandardRound);
        } catch (error) {
            console.error("Error setting current stage:", error);
            // 에러 발생 시 기본값 설정
            setCurrentStage(itemCount < 4 ? 2 : (itemCount < 8 ? 4 : (itemCount < 16 ? 8 : (itemCount < 32 ? 16 : 32))));
        }

        // Initialize with first pair
        setCurrentPair([limitedItems[0], limitedItems[1]]);
        setCurrentRound(1);
    };

    const getStages = () => {
        // 표준 토너먼트 라운드 값
        const standardRounds = [32, 16, 8, 4, 2];
        
        try {
            // 현재 라운드에 해당하는 시작점 찾기
            let startIndex = standardRounds.indexOf(selectedRound);
            
            // 표준 라운드가 아닌 경우 가장 가까운 작은 표준 라운드 찾기
            if (startIndex === -1) {
                startIndex = standardRounds.findIndex(r => r < selectedRound);
            }
            
            // 여전히 못 찾은 경우 또는 표준 라운드보다 작은 경우
            if (startIndex === -1) {
                // 0보다 작으면 가장 작은 표준 라운드(2강) 사용
                if (selectedRound < 2) {
                    return [2];
                }
                // 표준 라운드보다 큰 경우 전체 표준 라운드 사용
                return standardRounds;
            }
            
            // 시작점부터 끝까지의 라운드를 반환 (적어도 하나는 포함)
            const result = standardRounds.slice(startIndex);
            return result.length > 0 ? result : [2]; // 결과가 비어있으면 최소한 [2]를 반환
        } catch (error) {
            console.error("Error in getStages:", error);
            // 에러 발생 시 기본값 반환
            return [32, 16, 8, 4, 2];
        }
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
            console.log(`Recording match result: ${winner.name} beat ${loser.name}`);
            
            // 승자 통계 업데이트
            const winnerRef = doc(db, selectedTheme, winner.id.toString());
            await updateDoc(winnerRef, {
                MatchWinnerCount: increment(1),
                matchCount: increment(1),
                updatedAt: serverTimestamp()
            });
            
            // 패배자 통계 업데이트
            const loserRef = doc(db, selectedTheme, loser.id.toString());
            await updateDoc(loserRef, {
                LossCount: increment(1),
                matchCount: increment(1),
                updatedAt: serverTimestamp()
            });
            
            // 매치 히스토리 기록 (옵션)
            const matchRef = await addDoc(collection(db, "matches"), {
                theme: selectedTheme,
                round: selectedRound,
                stage: stage,
                winnerId: winner.id,
                winnerName: winner.name,
                loserId: loser.id,
                loserName: loser.name,
                timestamp: serverTimestamp()
            });
            
            console.log("Match recorded with ID:", matchRef.id);
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
            
            console.log(`Updating match stats for ${itemData.name}, winner: ${isWinner}`);
            
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
                    name: itemData.name,
                    image: itemData.image,
                    wins: isWinner ? 1 : 0,
                    matches: 1,
                    tournamentWins: 0,
                    winRate: isWinner ? 1 : 0,
                    lastUpdated: serverTimestamp()
                };
                
                await setDoc(itemRef, newData);
            }
            
            console.log(`Match stats updated for ${itemData.name}`);
        } catch (error) {
            console.error(`Error updating match stats for item ${itemId}:`, error);
        }
    };

    // Record tournament winner
    const recordTournamentWinner = async (winner) => {
        try {
            console.log(`Recording tournament winner: ${winner.name}`);
            
            // 우승자 통계 업데이트
            const winnerRef = doc(db, selectedTheme, winner.id.toString());
            await updateDoc(winnerRef, {
                FinalWinnerCount: increment(1),
                updatedAt: serverTimestamp()
            });
            
            // 우승 기록 저장 (옵션)
            const winnerHistoryRef = await addDoc(collection(db, "winners"), {
                theme: selectedTheme,
                round: selectedRound,
                winnerId: winner.id,
                winnerName: winner.name,
                timestamp: serverTimestamp()
            });
            
            console.log("Tournament winner recorded with ID:", winnerHistoryRef.id);
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
            <div className="container" style={{ 
                minHeight: 'auto', 
                justifyContent: 'flex-start', 
                paddingTop: 10,
                paddingBottom: 10,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.3rem'
            }}>
                <Header />
                
                <TournamentProgress
                    stages={getStages()}
                    currentStage={currentStage}
                    currentRound={currentRound}
                    totalRounds={currentStage / 2}
                    themeName={selectedTheme}
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