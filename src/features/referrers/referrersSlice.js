import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../api/supabaseClient';
import { setNotification } from '../ui/uiSlice';

// Fetches all referrers and a count of their associated candidates
export const fetchReferrers = createAsyncThunk('referrers/fetchReferrers', async (_, { rejectWithValue }) => {
  // We use an RPC (Remote Procedure Call) to get the referral count efficiently
  const { data, error } = await supabase.rpc('get_referrers_with_counts');
  if (error) return rejectWithValue(error.message);
  return data;
});

// Adds a new referrer
export const addReferrer = createAsyncThunk('referrers/addReferrer', async (referrerData, { dispatch, rejectWithValue }) => {
  const { data, error } = await supabase.from('referrers').insert(referrerData).select().single();
  if (error) {
    dispatch(setNotification({ message: `Error adding referrer: ${error.message}`, severity: 'error' }));
    return rejectWithValue(error.message);
  }
  dispatch(setNotification({ message: 'Referrer added successfully!', severity: 'success' }));
  return data;
});

// ... update and delete thunks would follow the same pattern ...

const initialState = {
  items: [],
  status: 'idle',
  error: null,
};

const referrersSlice = createSlice({
  name: 'referrers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReferrers.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchReferrers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchReferrers.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; });
  },
});

export const selectAllReferrers = (state) => state.referrers.items;
export const selectReferrersStatus = (state) => state.referrers.status;
export default referrersSlice.reducer;