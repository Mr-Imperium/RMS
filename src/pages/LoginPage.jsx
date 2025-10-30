 
import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const LoginPage = () => {
  return (
    <Container component="main" maxWidth="xs">
        <Box
            sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Typography component="h1" variant="h5">
                Sign in
            </Typography>
            <Box component="form" noValidate sx={{ mt: 1 }}>
                {/* Login form will go here in the next step */}
                <Typography>
                    Login form will be implemented here.
                </Typography>
            </Box>
        </Box>
    </Container>
  );
};

export default LoginPage;