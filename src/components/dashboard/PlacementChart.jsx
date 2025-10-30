import React, { memo } from 'react';
import { Paper, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Using React.memo prevents this component from re-rendering if its props (data) have not changed.
const PlacementChart = memo(({ data }) => {
    return (
        <Paper sx={{ p: 2, height: 400 }}>
            <Typography variant="h6">Placements by Month</Typography>
            <ResponsiveContainer>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </Paper>
    );
});

export default PlacementChart;