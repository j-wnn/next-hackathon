import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import styles from "./Worldcup.module.css";
import { getThemeItems, themeItems, themeNames } from "../data/themes";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CandidateCard from "../components/CandidateCard";
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
    writeBatch,
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
    position: relative;

    @media (max-width: 768px) {
        width: 90%;
    }
`;

const WorldCup = () => {
    const { round: paramRound } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    // 우선순위: URL 파라미터 -> location state -> 기본값 8
    const selectedRound =
        location.state?.selectedRound || parseInt(paramRound) || 8;

    const initialItems = [
        {
            id: 1,
            artistName: "에스파",
            image: "https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FCXUUr%2FbtrhThE7JT5%2FI71I3Xkn6M6R5hMhRmF4u0%2Fimg.jpg",
        },
        {
            id: 2,
            artistName: "아이브",
            image: "https://cdn.bhdw.net/im/ive-kpop-band-members-kitsch-mv-shoot-wallpaper-117859_w635.webp",
        },
        {
            id: 3,
            artistName: "뉴진스",
            image: "https://cdn-dedmn.nitrocdn.com/aMvAQkaFHzVFwGJeWJtcmuHMJPUhZIQZ/assets/images/optimized/rev-470aef7/wp-content/uploads/2023/01/newjeans-complete-profile-1200x675.jpg",
        },
        {
            id: 4,
            artistName: "르세라핌",
            image: "https://i.pinimg.com/736x/61/86/c2/6186c2dbb2f409e89a85623fd7f6b6d6.jpg",
        },
        {
            id: 5,
            artistName: "트와이스",
            image: "https://img.sbs.co.kr/newsnet/etv/upload/2023/01/16/30000781753_1280.jpg",
        },
        {
            id: 6,
            artistName: "블랙핑크",
            image: "https://6.soompi.io/wp-content/uploads/image/69938538-b221-4dc6-9904-d15dce655838.jpeg?s=900x600&e=t",
        },
        {
            id: 7,
            artistName: "레드벨벳",
            image: "https://upload.wikimedia.org/wikipedia/commons/6/6a/Red_Velvet_for_Marie_Claire_Korea_on_210422.png",
        },
        {
            id: 8,
            artistName: "소녀시대",
            image: "https://cdnimg.melon.co.kr/cm2/artistcrop/images/002/45/258/245258_20220727151751_500.jpg?e3d4217f9f3ae1816e56e22bca688e83/melon/resize/416/quality/80/optimize",
        },
        {
            id: 9,
            artistName: "있지",
            image: "https://i.pinimg.com/564x/97/d3/2b/97d32b9e56a1caa9a0b383af48d8d383.jpg",
        },
        {
            id: 10,
            artistName: "케플러",
            image: "https://blog.kakaocdn.net/dn/bS0QIP/btsCuCVRDwK/sCnqJNcFJwBR4ki9cMYkH0/img.jpg",
        },
        {
            id: 11,
            artistName: "오마이걸",
            image: "https://img.sbs.co.kr/newimg/news/20220328/201647650_1280.jpg",
        },
        {
            id: 12,
            artistName: "마마무",
            image: "https://image.xportsnews.com/contents/images/upload/article/2022/1011/mb_1665483324983698.jpg",
        },
        {
            id: 13,
            artistName: "(여자)아이들",
            image: "https://image.ytn.co.kr/general/jpg/2022/0127/202201271442013023_d.jpg",
        },
        {
            id: 14,
            artistName: "에이핑크",
            image: "https://img.hankyung.com/photo/201911/01.21175034.1.jpg",
        },
        {
            id: 15,
            artistName: "스테이씨",
            image: "https://file.mk.co.kr/meet/neds/2022/07/image_readtop_2022_591876_16566655615099628.jpg",
        },
        {
            id: 16,
            artistName: "이달의 소녀",
            image: "https://img.hankyung.com/photo/202202/BF.29420645.1.jpg",
        },
    ];

    const [items, setItems] = useState([]);
    const [currentRound, setCurrentRound] = useState(0);
    const [totalRounds, setTotalRounds] = useState(0);
    const [winners, setWinners] = useState([]);
    const [currentPair, setCurrentPair] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [currentStage, setCurrentStage] = useState(0);
    const [finalWinner, setFinalWinner] = useState(null);
    const [matchStats, setMatchStats] = useState({}); // Track win/loss for each item
    const [matchHistory, setMatchHistory] = useState([]); // Track all match results

    useEffect(() => {
        if (![4, 8, 16, 32].includes(selectedRound)) {
            navigate("/");
            return;
        }

        if (initialItems.length < selectedRound) {
            alert(`${selectedRound}강을 진행하기 위한 충분한 후보가 없습니다.`);
            navigate("/");
            return;
        }

        initializeGame();
    }, [selectedRound, navigate]);

    const initializeGame = () => {
        const shuffledItems = [...initialItems]
            .sort(() => Math.random() - 0.5)
            .slice(0, selectedRound);
        setItems(shuffledItems);
        setCurrentPair([shuffledItems[0], shuffledItems[1]]);
        setCurrentRound(1);
        setCurrentStage(selectedRound);
        setTotalRounds(selectedRound / 2);

        // Initialize match stats for each item
        const initialStats = {};
        shuffledItems.forEach((item) => {
            initialStats[item.id] = {
                wins: 0,
                matches: 0,
            };
        });
        setMatchStats(initialStats);
        setMatchHistory([]);
    };

    const getStages = () => {
        const stages = [];
        let stage = selectedRound;
        while (stage > 1) {
            stages.push(stage);
            stage = stage / 2;
        }
        return stages;
    };

    // Initialize or update themeStats document
    const initializeThemeStats = async () => {
        try {
            console.log("Initializing theme stats for:", selectedRound);
            const themeStatsRef = doc(
                db,
                "themeStats",
                selectedRound.toString()
            );
            const themeDoc = await getDoc(themeStatsRef);

            if (themeDoc.exists()) {
                console.log("Theme stats exists, updating");
                await updateDoc(themeStatsRef, {
                    totalGames: increment(1),
                    lastUpdated: serverTimestamp(),
                });
            } else {
                console.log("Theme stats doesn't exist, creating");
                await setDoc(themeStatsRef, {
                    totalGames: 1,
                    themeName: selectedRound,
                    lastUpdated: serverTimestamp(),
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
                theme: selectedRound,
                round: selectedRound,
                stage: stage,
                winnerId: winner.id,
                winnerName: winner.artistName,
                loserId: loser.id,
                loserName: loser.artistName,
                timestamp: serverTimestamp(),
            });

            console.log("Match recorded with ID:", matchRef.id);
        } catch (error) {
            console.error("Error recording match result:", error);
        }
    };

    // Update match statistics for an item
    const updateItemMatchStats = async (itemId, isWinner) => {
        try {
            const itemData = items.find(
                (item) => item.id.toString() === itemId.toString()
            );
            if (!itemData) {
                console.error("Item not found:", itemId);
                return;
            }

            console.log(
                `Updating match stats for ${itemData.artistName}, winner: ${isWinner}`
            );

            const itemRef = doc(
                db,
                "themes",
                selectedRound,
                "items",
                itemId.toString()
            );
            const itemDoc = await getDoc(itemRef);

            if (itemDoc.exists()) {
                // Update existing document
                const updateData = {
                    matches: increment(1),
                    lastUpdated: serverTimestamp(),
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
                        winRate: data.wins / data.matches,
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
                    lastUpdated: serverTimestamp(),
                };

                await setDoc(itemRef, newData);
            }

            console.log(`Match stats updated for ${itemData.artistName}`);
        } catch (error) {
            console.error(
                `Error updating match stats for item ${itemId}:`,
                error
            );
        }
    };

    // Record tournament winner
    const recordTournamentWinner = async (winner) => {
        try {
            console.log(`Recording tournament winner: ${winner.artistName}`);
            
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
                winnerName: winner.artistName,
                timestamp: serverTimestamp()
            });
            
            console.log("Tournament winner recorded with ID:", winnerHistoryRef.id);
        } catch (error) {
            console.error("Error saving tournament results:", error);
        }
    };

    const handleSelect = async (selected, index) => {
        if (isAnimating) return;

        setIsAnimating(true);
        setSelectedItem(selected);

        await new Promise((resolve) => setTimeout(resolve, 1000));

        const newWinners = [...winners, selected];
        setWinners(newWinners);

        const nextIndex = currentRound * 2;
        if (nextIndex < items.length - 1) {
            setCurrentPair([items[nextIndex], items[nextIndex + 1]]);
            setCurrentRound(currentRound + 1);
        } else if (winners.length + 1 === currentStage / 2) {
            const nextStage = currentStage / 2;

            if (nextStage >= 2) {
                // 다음 스테이지로 진행
                console.log(
                    `현재 스테이지 ${currentStage}강이 끝나고 ${nextStage}강으로 진행합니다.`
                );
                setItems([...newWinners, selected]);
                setWinners([]);
                setCurrentRound(1);
                setCurrentStage(nextStage);
                setTotalRounds(nextStage / 2);
                setCurrentPair([newWinners[0], newWinners[1]]);
            } else {
                // 결승 결과
                setFinalWinner(selected);
                console.log(`최종 우승자: ${selected.artistName}`);

                // Record tournament winner before navigating
                await recordTournamentWinner(selected);

                // Navigate to results page with winner and theme info
                navigate("/result", {
                    state: {
                        winner: selected,
                        theme: selectedRound,
                        totalRound: selectedRound,
                    },
                });
            }
        }

        setSelectedItem(null);
        setIsAnimating(false);
    };

    return (
        <div className="home-root">
            <div
                className="container"
                style={{
                    minHeight: "auto",
                    justifyContent: "flex-start",
                    paddingTop: 32,
                }}
            >
                <Header />

                <div className={styles.progressContainer}>
                    <div className={styles.progressBar}>
                        {getStages().map((stage) => (
                            <div
                                key={stage}
                                className={`${styles.progressStep} ${
                                    stage === currentStage ? styles.active : ""
                                }`}
                            >
                                {stage === 2 ? "결승" : `${stage}강`}
                            </div>
                        ))}
                    </div>
                    <div className={styles.round}>
                        {currentStage === 2 ? "결승" : `${currentStage}강`}{" "}
                        {currentRound}/{currentStage / 2}라운드
                    </div>
                </div>

                <CandidatesContainer>
                    {currentPair.map((item, index) => (
                        <CandidateWrapper key={item.id}>
                            <CandidateCard
                                item={item}
                                onClick={() => handleSelect(item, index)}
                                isSelected={selectedItem?.id === item.id}
                                slideDirection={
                                    selectedItem && selectedItem.id !== item.id
                                        ? index === 0
                                            ? "left"
                                            : "right"
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
