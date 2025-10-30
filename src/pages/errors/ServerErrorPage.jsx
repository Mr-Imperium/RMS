import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Button, Container } from '@mui/material';

const ServerErrorPage = () => {
    return (
        <Container component="main" sx={{ pt: 8, pb: 8 }}>
            <Box sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center' }}>
                <Typography variant="h3" paragraph>
                    Server Error! 😔
                </Typography>
                <Typography sx={{ color: 'text.secondary', mb: 3 }}>
                    Something went wrong on our end. We're working to fix the issue. Please try again later.
                </Typography>
                
                {/* Placeholder for a Server Error Illustration */}
                {/* <Box component="img" src={ServerErrorIllustration} sx={{ height: 260, mx: 'auto', my: { xs: 5, sm: 10 } }} /> */}
                
                <Button to="/dashboard" size="large" variant="contained" component={RouterLink}>
                    Go to Dashboard
                </Button>
            </Box>
        </Container>
    );
};
export default ServerErrorPage;