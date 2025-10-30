import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button, Container } from '@mui/material';
const HomePage = () => {
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
<Typography variant="h2" component="h1" gutterBottom>
Overseas Employment Pvt. Ltd.
</Typography>
<Typography variant="h5" color="text.secondary" paragraph>
Welcome to the Recruitment Management System.
</Typography>
<Typography variant="body1" paragraph>
View public job listings or log in to access the dashboard.
</Typography>
<Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
<Button component={Link} to="/login" variant="contained" size="large">
Login
</Button>
<Button component={Link} to="/dashboard" variant="outlined" size="large">
Go to Dashboard
</Button>
</Box>
</Box>
</Container>
);
};
export default HomePage;
