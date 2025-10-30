import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../api/supabaseClient';

/**
 * Fetches remarks for a specific entity (e.g., a candidate or a client).
 */
export const fetchRemarksForEntity = createAsyncThunk(
  'remarks/fetchRemarksForEntity',
  async ({ entityId, entityType }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('remarks')
        .select('*, profiles(full_name)')
        .eq('entity_id', entityId)
        .eq('entity_type', entityType)
        .order('created_at', { ascending: false });
        
      if (error) throw error;

      return { entityId, remarks: data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Adds a new remark for a specific entity.
 */
export const addRemark = createAsyncThunk(
  'remarks/addRemark',
  async (newRemarkData, { rejectWithValue }) => {
    const { data, error } = await supabase.from('remarks').insert(newRemarkData).select('*, profiles(full_name)').single();
    if (error) {
      return rejectWithValue(error.message);
    }
    return data;
  }
);

const initialState = {
  // Store remarks in a dictionary keyed by entityId for efficient lookup
  byEntity: {},
  status: 'idle',
  error: null,
};

const remarksSlice = createSlice({
  name: 'remarks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRemarksForEntity.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRemarksForEntity.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.byEntity[action.payload.entityId] = action.payload.remarks;
      })
      .addCase(fetchRemarksForEntity.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addRemark.fulfilled, (state, action) => {
        const { entity_id } = action.payload;
        if (state.byEntity[entity_id]) {
          state.byEntity[entity_id].unshift(action.payload);
        } else {
          state.byEntity[entity_id] = [action.payload];
        }
      });
  },
});

// Selectors
export const selectRemarksByEntityId = (entityId) => (state) => state.remarks.byEntity[entityId] || [];
export const selectRemarksStatus = (state) => state.remarks.status;

export default remarksSlice.reducer;