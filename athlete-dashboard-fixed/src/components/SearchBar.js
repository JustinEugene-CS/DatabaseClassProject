import React from 'react';

const SearchBar = ({ placeholder, onSearch }) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      onChange={e => onSearch(e.target.value)}
      style={{
        padding: 8,
        marginBottom: 20,
        width: '100%',
        fontSize: '16px'
      }}
    />
  );
};

export default SearchBar;