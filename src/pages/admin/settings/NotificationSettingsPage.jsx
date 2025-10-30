import React from 'react';
import { Paper, Typography } from '@mui/material';

const NotificationSettingsPage = () => {
    return (
        <Paper sx={{p: 3}}>
            <Typography variant="h5">🔔 Notification Settings</Typography>
            <Typography sx={{mt: 2, color: 'text.secondary'}}>
                Control **in-app notification preferences** (e.g., new candidate submission, job status changes) and configure **webhook integration** for external alerts.
            </Typography>
        </Paper>
    );
};
export default NotificationSettingsPage;