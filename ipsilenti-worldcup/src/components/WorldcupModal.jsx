import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactDOM from 'react-dom';
import '../styles/WorldcupModal.css';
import { themeItemCounts } from '../data/themes';

const WorldcupModal = ({ isOpen, onClose, theme, totalItems }) => {
  const [selectedRound, setSelectedRound] = useState('8');
  const navigate = useNavigate();

  // Add/remove modal-open class to body when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    
    // Cleanup on unmount
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  // 현재 테마에 맞게 초기 선택 라운드를 설정
  useEffect(() => {
    if (totalItems >= 32) {
      setSelectedRound('32');
    } else if (totalItems >= 16) {
      setSelectedRound('16');
    } else if (totalItems >= 8) {
      setSelectedRound('8');
    } else {
      setSelectedRound('4');
    }
  }, [theme, totalItems]);

  if (!isOpen) return null;

  const handleStartWorldcup = () => {
    // 월드컵 페이지로 이동하면서 선택된 테마와 라운드 정보 전달
    navigate('/worldcup', { 
      state: { 
        selectedTheme: theme,
        selectedRound: parseInt(selectedRound)
      } 
    });
    onClose();
  };

  // Render modal using React Portal to attach it to the end of document body
  // This completely detaches it from parent component flow
  const modalContent = (
    <div className="modal-overlay" onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{theme}</h2>
          <p>라운드를 선택하고 월드컵을 시작하세요</p>
        </div>
        
        <div className="modal-body">
          <div className="select-round">
            <label htmlFor="round-select">라운드를 선택해주세요.</label>
            <select 
              id="round-select" 
              value={selectedRound} 
              onChange={(e) => setSelectedRound(e.target.value)}
              className="round-dropdown"
            >
              {[32, 16, 8, 4].map(round => (
                round <= totalItems ? (
                  <option key={round} value={round.toString()}>{round}강</option>
                ) : null
              )).filter(Boolean)}
            </select>
          </div>
          
          <p className="round-info">
            총 {totalItems}개 후보 중 {selectedRound}개가 무작위로 선택됩니다
          </p>
        </div>
        
        <div className="modal-footer">
          <button className="cancel-button" onClick={onClose}>취소</button>
          <button className="start-button" onClick={handleStartWorldcup}>시작하기</button>
        </div>
      </div>
    </div>
  );
  
  // Create portal to render modal at the end of the document body
  return ReactDOM.createPortal(
    modalContent,
    document.body
  );
};

export default WorldcupModal; 