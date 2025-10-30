import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../api/supabaseClient';

// Thunk to call the RPC function
export const detectCandidate = createAsyncThunk('detection/detectCandidate', async (nationalId, { rejectWithValue }) => {
  if (!nationalId) {
    return rejectWithValue('National ID cannot be empty.');
  }
  const { data, error } = await supabase.rpc('detect_candidate_by_national_id', {
    p_national_id: nationalId,
  });

  if (error) {
    return rejectWithValue(error.message);
  }

  // RPC returns an array, we expect a single result or an empty array
  if (data && data.length > 0) {
    return data[0];
  } else {
    return null; // Explicitly return null if not found
  }
});

const initialState = {
  result: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed' | 'not_found'
  error: null,
};

const detectionSlice = createSlice({
  name: 'detection',
  initialState,
  reducers: {
    clearDetectionResult: (state) => {
      state.result = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(detectCandidate.pending, (state) => {
        state.status = 'loading';
        state.result = null;
        state.error = null;
      })
      .addCase(detectCandidate.fulfilled, (state, action) => {
        if (action.payload) {
          state.status = 'succeeded';
          state.result = action.payload;
        } else {
          state.status = 'not_found';
        }
      })
      .addCase(detectCandidate.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearDetectionResult } = detectionSlice.actions;

export const selectDetectionResult = (state) => state.detection.result;
export const selectDetectionStatus = (state) => state.detection.status;
export const selectDetectionError = (state) => state.detection.error;

export default detectionSlice.reducer;