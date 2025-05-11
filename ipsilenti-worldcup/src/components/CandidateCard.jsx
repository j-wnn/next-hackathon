import React, { useEffect, useState, useRef } from "react";
import styled from "@emotion/styled";

const CardWrapper = styled.div`
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 6px 6px 0 #000;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 360px;
  height: 100%;
  border: 3px solid #000;
  
  &:hover {
    transform: translate(6px, 6px);
    box-shadow: none;
  }
  
  &.selected {
    border: 3px solid #8b0029;
    box-shadow: 6px 6px 0 #8b0029;
  }
  
  &.slideLeft {
    animation: slideLeft 1.5s forwards;
  }
  
  &.slideRight {
    animation: slideRight 1.5s forwards;
  }
  
  @keyframes slideLeft {
    0% { transform: translateX(0); opacity: 1; }
    100% { transform: translateX(-200%); opacity: 0; }
  }
  
  @keyframes slideRight {
    0% { transform: translateX(0); opacity: 1; }
    100% { transform: translateX(200%); opacity: 0; }
  }
`;

const CardImage = styled.img`
  width: 100%;
  aspect-ratio: 16/9;
  object-fit: cover;
  border-bottom: 3px solid #000;
`;

const PlaceholderImage = styled.div`
  width: 100%;
  aspect-ratio: 16/9;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  font-weight: 700;
  font-size: 1.3rem;
  color: #000;
  border-bottom: 3px solid #000;
`;

const CardTitle = styled.div`
  width: 100%;
  padding: 1rem;
  text-align: center;
  font-weight: 700;
  font-size: 1.5rem;
  background-color: #fff;
  color: #000;
`;

/**
 * A reusable candidate card component for the worldcup tournament
 *
 * @param {Object} props
 * @param {Object} props.item - The candidate item data
 * @param {function} props.onClick - Callback when card is clicked
 * @param {boolean} props.isSelected - Whether this card is selected
 * @param {string} props.slideDirection - Direction to slide out (left, right or null)
 * @param {boolean} props.showCenterAnimation - Whether to show center animation
 * @param {number} props.index - Index of the card (0 or 1)
 * @param {string} props.className - Additional class names
 */
const CandidateCard = ({
    item,
    onClick,
    isSelected,
    slideDirection,
    showCenterAnimation,
    index,
    className = "",
}) => {
    const cardRef = useRef(null);
    const [originalPosition, setOriginalPosition] = useState(null);
    const [centerAnimationActive, setCenterAnimationActive] = useState(false);

    // 카드의 초기 위치 저장
    useEffect(() => {
        if (cardRef.current) {
            const rect = cardRef.current.getBoundingClientRect();
            setOriginalPosition({
                left: rect.left,
                top: rect.top,
                width: rect.width,
                height: rect.height,
            });
        }
    }, [cardRef.current]);

    // 선택되었을 때 중앙으로 이동하는 애니메이션 활성화
    useEffect(() => {
        if (showCenterAnimation && originalPosition) {
            setCenterAnimationActive(true);

            // 애니메이션 종료 후 리셋
            const timer = setTimeout(() => {
                setCenterAnimationActive(false);
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [showCenterAnimation, originalPosition]);

    const getAnimationClass = () => {
        if (showCenterAnimation) return "moveToCenter";
        if (slideDirection === "left") return "slideLeft";
        if (slideDirection === "right") return "slideRight";
        return "";
    };

    return (
        <CardWrapper
            ref={cardRef}
            className={`${className} ${getAnimationClass()}`}
            onClick={onClick}
            style={
                slideDirection || showCenterAnimation
                    ? { pointerEvents: "none" }
                    : {}
            }
        >
            {item.image ? (
                <CardImage
                    src={item.image}
                    alt={item.name}
                />
            ) : (
                <PlaceholderImage>
                    {item.name}
                </PlaceholderImage>
            )}
            <CardTitle>{item.name}</CardTitle>
        </CardWrapper>
    );
};

export default CandidateCard;
 