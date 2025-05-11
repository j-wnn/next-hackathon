import React from 'react';
import styled from '@emotion/styled';

const SearchForm = styled.form`
  display: flex;
  flex-shrink: 0;
  width: 100%;
`;

const Input = styled.input`
  padding: 0.7rem 1rem;
  border: 3px solid #000;
  border-right: none;
  border-radius: 8px 0 0 8px;
  font-size: 1rem;
  font-weight: 600;
  width: 250px;
  height: 48px;
  box-sizing: border-box;
  outline: none;
  box-shadow: 2px 2px 0 #000;
  
  &:focus {
    border-color: #8b0029;
  }
  
  @media (max-width: 768px) {
    width: 70%;
  }
`;

const Button = styled.button`
  padding: 0.7rem 1.2rem;
  border: 3px solid #000;
  border-radius: 0 8px 8px 0;
  background: #8b0029;
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  height: 48px;
  box-sizing: border-box;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  flex-shrink: 0;
  /* Ensure horizontal text */
  writing-mode: initial;
  box-shadow: 2px 2px 0 #000;
  
  &:hover { 
    background: #7a0024;
    transform: translate(2px, 2px);
    box-shadow: none;
  }
  
  @media (max-width: 768px) {
    width: 30%;
  }
`;

/**
 * A reusable search box component
 * 
 * @param {Object} props
 * @param {string} props.value - Current search value
 * @param {function} props.onChange - Callback when input changes
 * @param {function} props.onSubmit - Callback when form is submitted
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.buttonText - Text for the button
 */
const SearchBox = ({ 
  value, 
  onChange, 
  onSubmit, 
  placeholder = "검색어 입력", 
  buttonText = "검색" 
}) => {
  return (
    <SearchForm onSubmit={onSubmit}>
      <Input
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      <Button type="submit">{buttonText}</Button>
    </SearchForm>
  );
};

export default SearchBox; 