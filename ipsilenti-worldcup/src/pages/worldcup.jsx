import React, { useState, useEffect } from "react";
import styles from "./worldcup.module.css";

const WorldCup = () => {
    const initialItems = [
        {
            id: 1,
            artistName: "에스파",
            image: "https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FCXUUr%2FbtrhThE7JT5%2FI71I3Xkn6M6R5hMhRmF4u0%2Fimg.jpg",
        },
        {
            id: 2,
            name: "후보 2",
            artistName: "아이브",
            image: "https://cdn.bhdw.net/im/ive-kpop-band-members-kitsch-mv-shoot-wallpaper-117859_w635.webp",
        },
        { id: 3, name: "후보 3", artistName: "아티스트 이름" },
        { id: 4, name: "후보 4", artistName: "아티스트 이름" },
        { id: 5, name: "후보 5", artistName: "아티스트 이름" },
        { id: 6, name: "후보 6", artistName: "아티스트 이름" },
        { id: 7, name: "후보 7", artistName: "아티스트 이름" },
        { id: 8, name: "후보 8", artistName: "아티스트 이름" },
    ];

    const [items, setItems] = useState([]);
    const [currentRound, setCurrentRound] = useState(0);
    const [totalRounds, setTotalRounds] = useState(0);
    const [winners, setWinners] = useState([]);
    const [currentPair, setCurrentPair] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [slideDirection, setSlideDirection] = useState(null);
    const [currentStage, setCurrentStage] = useState(0);

    useEffect(() => {
        initializeGame();
    }, []);

    const initializeGame = () => {
        const shuffledItems = [...initialItems].sort(() => Math.random() - 0.5);
        setItems(shuffledItems);

        const itemCount = shuffledItems.length;
        const roundCount = Math.log2(itemCount);
        setTotalRounds(itemCount / 2);

        setCurrentPair([shuffledItems[0], shuffledItems[1]]);
        setCurrentRound(1);
        setCurrentStage(itemCount);
    };

    const getStages = () => {
        const itemCount = initialItems.length;
        const stages = [];
        let stage = itemCount;
        while (stage > 1) {
            stages.push(stage);
            stage = stage / 2;
        }
        return stages;
    };

    const handleSelect = async (selected, direction) => {
        if (isAnimating) return;

        setIsAnimating(true);
        setSelectedItem(selected);
        setSlideDirection(direction);

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
                console.log("Tournament finished! Winner:", selected.name);
                alert(`우승자: ${selected.artistName}`);
            }
        }

        setSelectedItem(null);
        setSlideDirection(null);
        setIsAnimating(false);
    };

    return (
        <div className={styles.container}>
            <div className={styles.progressContainer}>
                <div className={styles.progressBar}>
                    {getStages().map((stage) => (
                        <div
                            key={stage}
                            className={`${styles.progressStep} ${
                                stage === currentStage ? styles.active : ""
                            }`}
                        >
                            {stage}강
                        </div>
                    ))}
                </div>
                <div className={styles.round}>
                    {currentStage}강 {currentRound}/{currentStage / 2}
                </div>
            </div>

            <div className={styles.imageContainer}>
                {currentPair.map((item, index) => (
                    <div
                        key={item.id}
                        className={`${styles.imageWrapper} ${
                            selectedItem?.id === item.id
                                ? styles.selected
                                : slideDirection === "left" && index === 1
                                ? styles.slideRight
                                : slideDirection === "right" && index === 0
                                ? styles.slideLeft
                                : ""
                        }`}
                        onClick={() =>
                            handleSelect(item, index === 0 ? "left" : "right")
                        }
                    >
                        {item.image ? (
                            <img
                                src={item.image}
                                alt={item.name}
                                className={styles.candidateImage}
                            />
                        ) : (
                            <div className={styles.candidateImage}>
                                {item.name}
                            </div>
                        )}
                        <div className={styles.artistName}>
                            {item.artistName}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WorldCup;
