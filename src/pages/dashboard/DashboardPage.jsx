import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchDashboardAnalytics, selectDashboardData, selectDashboardStatus } from '../../features/dashboard/dashboardSlice';
import PlacementChart from '../../components/dashboard/PlacementChart';
import StatCard from '../../components/dashboard/StatCard';
import ActivityFeed from '../../components/dashboard/ActivityFeed';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import DateRangePicker from '../../components/common/DateRangePicker';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

const DashboardPage = () => {
    const dispatch = useAppDispatch();
    const { kpis, placementsByMonth, candidatesByStatus, recentActivities } = useAppSelector(selectDashboardData);
    const status = useAppSelector(selectDashboardStatus);
    const [dateRange, setDateRange] = useState({
        startDate: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
        endDate: new Date(),
    });
    const memoizedPlacementsData = useMemo(() => placementsByMonth, [placementsByMonth]);
    const handleDateChange = useCallback((newRange) => {
        setDateRange(newRange);
    }, []);


    useEffect(() => {
        dispatch(fetchDashboardAnalytics(dateRange));
    }, [dispatch, dateRange]);

    if (status === 'loading' || status === 'idle') {
        return <LoadingSpinner fullPage />;
    }

    return (
        <Box>
            <Typography variant="h4" component="h1" gutterBottom>Dashboard</Typography>
            <Grid container spacing={3}>
                {/* KPI Cards */}
                <Grid item lg={3} sm={6} xs={12}><StatCard title="Total Clients" value={kpis.total_clients || 0} icon={<BusinessIcon fontSize="large" />} /></Grid>
                <Grid item lg={3} sm={6} xs={12}><StatCard title="Active Candidates" value={kpis.active_candidates || 0} icon={<PeopleAltIcon fontSize="large" />} /></Grid>
                <Grid item lg={3} sm={6} xs={12}><StatCard title="In Lineup" value={kpis.in_lineup || 0} icon={<PlaylistAddCheckIcon fontSize="large" />} /></Grid>
                <Grid item lg={3} sm={6} xs={12}><StatCard title="Placements This Month" value={kpis.placements_this_month || 0} icon={<FlightTakeoffIcon fontSize="large" />} /></Grid>
                
                {/* Charts */}
                <Grid item xs={12} lg={8}>
                    <PlacementChart data={memoizedPlacementsData} />
                    <Paper sx={{ p: 2, height: 400 }}>
                        <Typography variant="h6">Placements by Month</Typography>
                        <ResponsiveContainer>
                            <BarChart data={placementsByMonth}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
                <Grid item xs={12} lg={4}>
                    <Paper sx={{ p: 2, height: 400 }}>
                        <Typography variant="h6">Candidates by Status</Typography>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie data={candidatesByStatus} dataKey="value" nameKey="status" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} label>
                                    {candidatesByStatus.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Activity Feed */}
                <Grid item xs={12} lg={12}>
                     <Paper sx={{ p: 2 }}>
                        <ActivityFeed activities={recentActivities} />
                     </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};
export default DashboardPage;