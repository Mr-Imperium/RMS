import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../api/supabaseClient';
import { format } from 'date-fns';

export const fetchDashboardAnalytics = createAsyncThunk('dashboard/fetchAnalytics', async ({ startDate, endDate }, { rejectWithValue }) => {
    const { data, error } = await supabase.rpc('get_dashboard_analytics', {
        start_date: format(startDate, 'yyyy-MM-dd'),
        end_date: format(endDate, 'yyyy-MM-dd')
    });
    if (error) return rejectWithValue(error.message);
    return data;
});

const initialState = {
    kpis: {},
    placementsByMonth: [],
    candidatesByStatus: [],
    recentActivities: [],
    status: 'idle',
    error: null,
};

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        // Reducer for real-time KPI updates
        updateKpi: (state, action) => {
            const { key, value } = action.payload;
            if (state.kpis[key] !== undefined) {
                state.kpis[key] += value; // Increment/decrement
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardAnalytics.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchDashboardAnalytics.fulfilled, (state, action) => {
                state.kpis = action.payload.kpis;
                state.placementsByMonth = action.payload.placements_by_month || [];
                state.candidatesByStatus = action.payload.candidates_by_status || [];
                state.recentActivities = action.payload.recent_activities || [];
                state.status = 'succeeded';
            })
            .addCase(fetchDashboardAnalytics.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; });
    }
});

export const { updateKpi } = dashboardSlice.actions;
export const selectDashboardData = (state) => state.dashboard;
export const selectDashboardStatus = (state) => state.dashboard.status;
export default dashboardSlice.reducer;