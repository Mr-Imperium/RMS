import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Button, Container } from '@mui/material';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';

const UnauthorizedPage = () => {
  return (
    <Container component="main" sx={{ pt: 8, pb: 8, height: '100vh', display: 'flex', alignItems: 'center' }}>
      <Box sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center' }}>
        <DoNotDisturbIcon color="error" sx={{ fontSize: 80, mb: 2 }}/>
        <Typography variant="h4" paragraph>
          Access Denied
        </Typography>
        <Typography sx={{ color: 'text.secondary', mb: 4 }}>
          You do not have the necessary permissions to access this page. Please contact your administrator if you believe this is an error.
        </Typography>
        
        <Button to="/dashboard" size="large" variant="contained" component={RouterLink}>
          Return to Dashboard
        </Button>
      </Box>
    </Container>
  );
};
export default UnauthorizedPage;