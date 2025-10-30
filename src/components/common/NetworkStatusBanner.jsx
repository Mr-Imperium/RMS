import React from 'react';
import { Slide, Box, Typography } from '@mui/material';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import useOnlineStatus from '../../hooks/useOnlineStatus';

const NetworkStatusBanner = () => {
    const isOnline = useOnlineStatus();

    return (
        <Slide direction="down" in={!isOnline} mountOnEnter unmountOnExit>
            <Box
                sx={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0,
                    p: 1,
                    backgroundColor: 'warning.main', // More appropriate than error
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: (theme) => theme.zIndex.modal + 1,
                }}
            >
                <WifiOffIcon sx={{ mr: 1 }} />
                <Typography variant="body2" fontWeight="bold">
                    You are offline. Changes will not be saved.
                </Typography>
            </Box>
        </Slide>
    );
};

export default NetworkStatusBanner;