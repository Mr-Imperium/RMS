import React from 'react';
import { Paper, InputBase, IconButton, Box, TextField, MenuItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const JobFilters = ({ onSearch, onSort, sx }) => {
  return (
    <Paper component="section" sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', ...sx }}>
      <Box
        component="form"
        onSubmit={(e) => {
            e.preventDefault();
            onSearch(e.target.elements.search.value);
        }}
        sx={{ flexGrow: 1, display: 'flex', border: '1px solid', borderColor: 'divider', borderRadius: 1 }}
      >
        <InputBase
          name="search"
          sx={{ ml: 2, flex: 1 }}
          placeholder="Search by Title, Company, or Country"
        />
        <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
          <SearchIcon />
        </IconButton>
      </Box>
      <TextField
        select
        label="Sort by"
        defaultValue="created_at.desc"
        onChange={(e) => onSort(e.target.value)}
        sx={{ minWidth: 200 }}
      >
        <MenuItem value="created_at.desc">Newest</MenuItem>
        <MenuItem value="created_at.asc">Oldest</MenuItem>
        <MenuItem value="clients.company_name.asc">Company (A-Z)</MenuItem>
        <MenuItem value="clients.company_name.desc">Company (Z-A)</MenuItem>
      </TextField>
    </Paper>
  );
};

export default JobFilters;