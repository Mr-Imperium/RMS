import React from 'react';
import { Paper, Typography } from '@mui/material';

const BackupSettingsPage = () => {
    return (
        <Paper sx={{p: 3}}>
            <Typography variant="h5">💾 Backup Settings</Typography>
            <Typography sx={{mt: 2, color: 'text.secondary'}}>
                Manage **automatic database backups** schedules and configure **external cloud storage integration** (e.g., S3, Google Drive) for storing backup files.
            </Typography>
        </Paper>
    );
};
export default BackupSettingsPage;