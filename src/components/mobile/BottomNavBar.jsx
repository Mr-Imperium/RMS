import React from 'react';
import { NavLink } from 'react-router-dom';
import { Paper, BottomNavigation, BottomNavigationAction } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import WorkIcon from '@mui/icons-material/Work';
import SearchIcon from '@mui/icons-material/Search';

const BottomNavBar = () => {
    const [value, setValue] = React.useState(0);

    return (
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: (theme) => theme.zIndex.appBar }} elevation={3}>
            <BottomNavigation
                showLabels
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}
            >
                <BottomNavigationAction component={NavLink} to="/dashboard" label="Dashboard" icon={<DashboardIcon />} />
                <BottomNavigationAction component={NavLink} to="/candidates" label="Candidates" icon={<PeopleIcon />} />
                <BottomNavigationAction component={NavLink} to="/job-titles" label="Jobs" icon={<WorkIcon />} />
                <BottomNavigationAction component={NavLink} to="/detection" label="Detect" icon={<SearchIcon />} />
            </BottomNavigation>
        </Paper>
    );
};
export default BottomNavBar;