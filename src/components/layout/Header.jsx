import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box, Menu, MenuItem, Avatar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectCurrentUserProfile, logoutUser } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import RealtimeIndicator from '../common/RealtimeIndicator';
import NotificationBell from './NotificationBell'; // Import NotificationBell
import GlobalSearchBar from './GlobalSearchBar';

const Header = ({ drawerWidth, handleDrawerToggle }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const userProfile = useAppSelector(selectCurrentUserProfile);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleLogout = () => {
    handleClose();
    dispatch(logoutUser()).then(() => navigate('/login'));
  };
  const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('') : '';

  return (
    <AppBar
      position="fixed"
      sx={{ /* ... styles */ }}
    >
      <Toolbar>
        <IconButton /* ... menu button */>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ display: { xs: 'none', sm: 'block' } }}>
          RMS
        </Typography>
        
        {/* Integrate Global Search Bar */}
        <Box sx={{ flexGrow: 1, ml: 2, mr: 2, maxWidth: 600 }}>
            <GlobalSearchBar />
        </Box>

        <Box sx={{ flexGrow: 1 }} /> {/* Spacer */}

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <RealtimeIndicator />
            <NotificationBell />
            {/* ... Profile Menu ... */}
        </Box>
      </Toolbar>
    </AppBar>
  );
};
export default Header;