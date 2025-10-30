import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LockIcon from '@mui/icons-material/Lock';

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
        }}
      >
        <LockIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
        <Typography variant="h3" gutterBottom>
          Access Denied
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          You don't have permission to access this page.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/')}
        >
          Go to Home
        </Button>
      </Box>
    </Container>
  );
};

export default UnauthorizedPage;