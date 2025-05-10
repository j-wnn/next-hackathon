import React from 'react';
import styled from '@emotion/styled';

const SearchForm = styled.form`
  display: flex;
`;

const Input = styled.input`
  padding: 0.7rem 1rem;
  border: 1px solid #ccc;
  border-radius: 8px 0 0 8px;
  font-size: 1rem;
  width: 250px;
  height: 48px;
  box-sizing: border-box;
  outline: none;
  
  &:focus {
    border-color: #283593;
  }
`;

const Button = styled.button`
  padding: 0.7rem 1.2rem;
  border: none;
  border-radius: 0 8px 8px 0;
  background: #283593;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  height: 48px;
  box-sizing: border-box;
  transition: background 0.3s;
  display: flex;
  align-items: center;
  
  &:hover { 
    background: #1a237e; 
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
  placeholder = "검색", 
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