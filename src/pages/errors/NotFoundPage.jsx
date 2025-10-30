import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Button, Container } from '@mui/material';

const NotFoundPage = () => {
  return (
    <Container component="main" sx={{ pt: 8, pb: 8, height: '100vh', display: 'flex', alignItems: 'center' }}>
      <Box sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center' }}>
        <Typography variant="h1" component="h1" fontWeight="bold" color="primary.main">404</Typography>
        <Typography variant="h4" paragraph>
          Page Not Found
        </Typography>
        <Typography sx={{ color: 'text.secondary', mb: 4 }}>
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </Typography>
        
        <Button to="/dashboard" size="large" variant="contained" component={RouterLink}>
          Go to Dashboard
        </Button>
      </Box>
    </Container>
  );
};
export default NotFoundPage;