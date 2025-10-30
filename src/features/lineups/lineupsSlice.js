import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../api/supabaseClient';
import { setNotification } from '../ui/uiSlice';

// Fetch lineups for a specific job using our RPC function
export const fetchLineupsForJob = createAsyncThunk('lineups/fetchForJob', async (jobId, { rejectWithValue }) => {
  const { data, error } = await supabase.rpc('get_lineups_for_job', { p_job_id: jobId });
  if (error) return rejectWithValue(error.message);
  return data;
});

// Update a specific status field for a lineup
export const updateLineupStatus = createAsyncThunk('lineups/updateStatus', async ({ lineupId, statusField, newValue }, { dispatch, rejectWithValue }) => {
  const { data, error } = await supabase
    .from('candidate_lineups')
    .update({ [statusField]: newValue })
    .eq('id', lineupId)
    .select()
    .single();

  if (error) {
    dispatch(setNotification({ message: `Update failed: ${error.message}`, severity: 'error' }));
    return rejectWithValue(error.message);
  }
  return data;
});

const initialState = {
  items: [],
  status: 'idle',
  error: null,
};

const lineupsSlice = createSlice({
  name: 'lineups',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLineupsForJob.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchLineupsForJob.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchLineupsForJob.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })
      .addCase(updateLineupStatus.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.lineup_id === action.payload.id);
        if (index !== -1) {
          // Merge the updated status field back into the existing item
          state.items[index] = { ...state.items[index], ...action.payload };
        }
      });
  },
});

export const selectAllLineups = (state) => state.lineups.items;
export const selectLineupsStatus = (state) => state.lineups.status;
export default lineupsSlice.reducer;