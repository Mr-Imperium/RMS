import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const StatCard = ({ title, value, icon, color = 'primary.main' }) => {
    return (
        <Card elevation={3}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography color="text.secondary" gutterBottom variant="body2">{title}</Typography>
                        <Typography variant="h4" component="div">{value}</Typography>
                    </Box>
                    <Box sx={{ color }}>{icon}</Box>
                </Box>
            </CardContent>
        </Card>
    );
};
export default StatCard;