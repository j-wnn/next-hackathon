import React from 'react';
import styled from '@emotion/styled';
import { themeNames } from '../../data/themes';

const SelectorContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Label = styled.label`
  margin-right: 0.5rem;
  font-weight: bold;
`;

const Select = styled.select`
  padding: 0.7rem 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  height: 48px;
  min-width: 200px;
  margin-right: 1rem;
  background-color: white;
`;

const RefreshButton = styled.button`
  padding: 0.5rem 1rem;
  margin-left: 0.5rem;
  background: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #e0e0e0;
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
 * @param {string} props.labelText - Text for the label
 */
const ThemeSelector = ({ 
  selectedTheme, 
  onChange, 
  onRefresh, 
  showRefreshButton = true,
  labelText = "테마:" 
}) => {
  return (
    <SelectorContainer>
      <Label htmlFor="theme-select">{labelText}</Label>
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