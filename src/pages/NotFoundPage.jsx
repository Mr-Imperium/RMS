import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button, Container } from '@mui/material';

const NotFoundPage = () => {
  return (
    <Container>
      <Box
        sx={{
          py: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Typography variant="h1" component="h1" gutterBottom>
          404
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Oops! Page Not Found.
        </Typography>
        <Typography variant="body1" paragraph>
          The page you are looking for does not exist or has been moved.
        </Typography>
        <Button component={Link} to="/" variant="contained" sx={{ mt: 4 }}>
          Go to Homepage
        </Button>
      </Box>
    </Container>
  );
};

export default NotFoundPage;