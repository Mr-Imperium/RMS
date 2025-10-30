import React from 'react';
import { Container, Box, Avatar, Typography, Paper } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

/**
 * A layout component for authentication pages (Login, Forgot Password, etc.).
 * Provides a consistent, centered card UI.
 * @param {object} props
 * @param {React.ReactNode} props.children - The form content to be rendered inside the layout.
 * @param {string} props.title - The title to be displayed at the top of the form (e.g., "Sign in").
 */
const AuthLayout = ({ children, title }) => {
  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={3}
        sx={{
          marginTop: 8,
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: 2,
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {title}
        </Typography>
        <Box sx={{ mt: 3, width: '100%' }}>
          {children}
        </Box>
      </Paper>
    </Container>
  );
};

export default AuthLayout; 
