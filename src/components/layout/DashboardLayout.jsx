import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, CssBaseline, Toolbar } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import BottomNavBar from '../mobile/BottomNavBar'; // Import BottomNav
import useResponsive from '../../hooks/useResponsive'; // Import responsive hook

const DRAWER_WIDTH = 260;

const DashboardLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isMobile } = useResponsive();

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <Header drawerWidth={DRAWER_WIDTH} handleDrawerToggle={handleDrawerToggle} />
      <Sidebar
        drawerWidth={DRAWER_WIDTH}
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          display: 'flex',
          flexDirection: 'column',
          pb: isMobile ? '72px' : 3 // Add padding-bottom to avoid overlap with BottomNavBar
        }}
      >
        <Toolbar />
        <Box sx={{ flexGrow: 1 }}>
            <Outlet />
        </Box>
        {!isMobile && <Footer />} {/* Hide footer on mobile */}
      </Box>
      {isMobile && <BottomNavBar />} {/* Show BottomNavBar only on mobile */}
    </Box>
  );
};
export default DashboardLayout;