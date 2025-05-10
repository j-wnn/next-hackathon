import React, { useEffect, useState, useRef } from "react";
import styled from "@emotion/styled";

const CardWrapper = styled.div`
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    cursor: pointer;
    transition: all 0.3s ease;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 320px;
    height: 100%;
    will-change: transform, opacity;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    }

    &.moveToCenter {
        position: fixed !important;
        left: 50% !important;
        top: 50% !important;
        transform: translate(-50%, -50%) scale(1.05) !important;
        z-index: 100 !important;
        box-shadow: 0 0 30px rgba(0, 0, 0, 0.3) !important;
        transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1) !important;
    }

    &.slideLeft {
        animation: slideLeft 1s forwards;
    }

    &.slideRight {
        animation: slideRight 1s forwards;
    }

    @keyframes moveToCenter {
        0% {
            transform: translate(0, 0);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        100% {
            transform: translate(${(props) => props.centerShift || "0"}, 0);
            box-shadow: 0 0 30px rgba(0, 0, 0, 0.3);
            z-index: 10;
        }
    }

    @keyframes slideLeft {
        0% {
            transform: translateX(0);
            opacity: 1;
        }
        100% {
            transform: translateX(-200%);
            opacity: 0;
        }
    }

    @keyframes slideRight {
        0% {
            transform: translateX(0);
            opacity: 1;
        }
        100% {
            transform: translateX(200%);
            opacity: 0;
        }
    }
`;

const CardImage = styled.img`
    width: 100%;
    aspect-ratio: 1/1;
    object-fit: cover;
`;

const PlaceholderImage = styled.div`
    width: 100%;
    aspect-ratio: 1/1;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f0f2fa;
    font-weight: 500;
    font-size: 1.2rem;
    color: #666;
`;

const CardTitle = styled.div`
    width: 100%;
    padding: 1rem;
    text-align: center;
    font-weight: 600;
    font-size: 1.3rem;
    background-color: rgba(255, 255, 255, 0.95);
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
                    alt={item.artistName || item.name}
                />
            ) : (
                <PlaceholderImage>
                    {item.artistName || item.name}
                </PlaceholderImage>
            )}
            <CardTitle>{item.artistName || item.name}</CardTitle>
        </CardWrapper>
    );
};

export default CandidateCard;
