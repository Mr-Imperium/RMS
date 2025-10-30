import React from 'react';
import { Paper, Typography } from '@mui/material';

const EmailSettingsPage = () => {
    return (
        <Paper sx={{p: 3}}>
            <Typography variant="h5">📧 Email Settings</Typography>
            <Typography sx={{mt: 2, color: 'text.secondary'}}>
                Configure **SMTP credentials** for sending emails and manage **email templates** for invitations, password resets, and notifications.
            </Typography>
        </Paper>
    );
};
export default EmailSettingsPage;