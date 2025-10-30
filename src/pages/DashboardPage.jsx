 
import React from 'react';
import { Typography, Paper, Box } from '@mui/material';

const DashboardPage = () => {
  return (
    <Box>
        <Typography variant="h4" gutterBottom>
            Dashboard
        </Typography>
        <Paper sx={{ p: 2 }}>
            <Typography variant="body1">
                Welcome to the admin dashboard. Use the sidebar to navigate through the system.
            </Typography>
        </Paper>
    </Box>
  );
};

export default DashboardPage;