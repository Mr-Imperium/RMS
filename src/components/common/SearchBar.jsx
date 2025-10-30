import React, { useState, useEffect } from 'react';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

/**
 * A debounced search input component.
 * @param {object} props
 * @param {function(string): void} props.onSearch - Callback function that fires after the debounce delay.
 * @param {number} [props.delay=500] - The debounce delay in milliseconds.
 * @param {string} [props.placeholder='Search...'] - The placeholder text.
 */
const SearchBar = ({ onSearch, delay = 500, placeholder = 'Search...' }) => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(searchTerm);
    }, delay);

    // Cleanup function to cancel the timeout if the user keeps typing
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, onSearch, delay]);

  return (
    <TextField
      variant="outlined"
      fullWidth
      placeholder={placeholder}
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  );
};

export default SearchBar;