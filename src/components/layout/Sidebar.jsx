import React from 'react';
import { NavLink as RouterLink, useLocation } from 'react-router-dom';
import { Box, Drawer, List, ListItemText, ListItemIcon, ListItemButton, ListSubheader } from '@mui/material';
import { navConfig } from '../../config/navConfig.jsx';
import usePermissions from '../../hooks/usePermissions';

const Sidebar = ({ drawerWidth, mobileOpen, handleDrawerToggle }) => {
  const { can } = usePermissions();
  const location = useLocation();

  const drawerContent = (
    <div>
      <Box sx={{ p: 2, height: '64px' }} /> {/* Logo Spacer */}
      <List>
        {navConfig.map((group) => (
          <React.Fragment key={group.subheader}>
            <ListSubheader component="div" sx={{ backgroundColor: 'background.paper' }}>
              {group.subheader}
            </ListSubheader>
            {group.items
              .filter(item => can(item.permission)) // Filter items based on permission
              .map((item) => {
                const isActive = location.pathname.startsWith(item.path);
                return (
                  <ListItemButton key={item.title} component={RouterLink} to={item.path} selected={isActive}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.title} />
                  </ListItemButton>
                );
              })}
          </React.Fragment>
        ))}
      </List>
    </div>
  );

  return (
    <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
      <Drawer variant="temporary" open={mobileOpen} onClose={handleDrawerToggle}
        sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}>
        {drawerContent}
      </Drawer>
      <Drawer variant="permanent" sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }} open>
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;