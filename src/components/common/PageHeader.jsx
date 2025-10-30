import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const PageHeader = ({ title, buttonText, onButtonClick }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
      <Typography variant="h4" component="h1">
        {title}
      </Typography>
      {buttonText && onButtonClick && (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onButtonClick}
        >
          {buttonText}
        </Button>
      )}
    </Box>
  );
};

export default PageHeader;