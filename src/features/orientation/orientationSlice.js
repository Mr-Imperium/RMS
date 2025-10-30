import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../api/supabaseClient';

export const fetchOrientationCenters = createAsyncThunk('orientation/fetchCenters', async (_, { rejectWithValue }) => {
  const { data, error } = await supabase.from('orientation_centers').select('*');
  if (error) return rejectWithValue(error.message);
  return data;
});

const orientationSlice = createSlice({
  name: 'orientation',
  initialState: {
    centers: [],
    batches: [],
    status: 'idle',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrientationCenters.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchOrientationCenters.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.centers = action.payload;
      });
  },
});

export const selectOrientationCenters = (state) => state.orientation.centers;
export default orientationSlice.reducer;