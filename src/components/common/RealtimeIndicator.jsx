import React from 'react';
import { Chip } from '@mui/material';
import WifiIcon from '@mui/icons-material/Wifi';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import useOnlineStatus from '../../hooks/useOnlineStatus';

const RealtimeIndicator = () => {
    const isOnline = useOnlineStatus();

    if (isOnline) {
        return (
            <Chip
                icon={<WifiIcon />}
                label="Live"
                color="success"
                variant="outlined"
                size="small"
            />
        );
    }

    return (
        <Chip
            icon={<WifiOffIcon />}
            label="Offline"
            color="error"
            size="small"
        />
    );
};

export default RealtimeIndicator;