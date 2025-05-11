import React from 'react';
import styled from '@emotion/styled';
import { themeNames } from '../../data/themes';

const SelectorContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Select = styled.select`
  padding: 0.7rem 1rem;
  border: 3px solid #000;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  height: 48px;
  min-width: 200px;
  margin-right: 1rem;
  background-color: white;
  box-shadow: 3px 3px 0 #000;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: #8b0029;
  }
`;

const RefreshButton = styled.button`
  padding: 0.6rem 1.2rem;
  margin-left: 0.5rem;
  background: #fff;
  border: 3px solid #000;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 3px 3px 0 #000;
  display: flex;
  align-items: center;
  
  &:hover {
    transform: translate(3px, 3px);
    box-shadow: none;
  }
`;

/**
 * A reusable theme selector component
 * 
 * @param {Object} props
 * @param {string} props.selectedTheme - The currently selected theme
 * @param {function} props.onChange - Callback when theme changes
 * @param {function} props.onRefresh - Optional callback when refresh button is clicked
 * @param {boolean} props.showRefreshButton - Whether to show refresh button
 */
const ThemeSelector = ({ 
  selectedTheme, 
  onChange, 
  onRefresh, 
  showRefreshButton = true
}) => {
  return (
    <SelectorContainer>
      <Select 
        id="theme-select" 
        value={selectedTheme} 
        onChange={onChange}
      >
        {themeNames.map(theme => (
          <option key={theme} value={theme}>{theme}</option>
        ))}
      </Select>
      
      {showRefreshButton && onRefresh && (
        <RefreshButton onClick={onRefresh}>
          새로고침
        </RefreshButton>
      )}
    </SelectorContainer>
  );
};

export default ThemeSelector; 