import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../api/supabaseClient';
import { setNotification } from '../ui/uiSlice';

const PAGE_SIZE = 20;

/**
 * Fetches a paginated and searchable list of candidates.
 */
export const fetchCandidates = createAsyncThunk(
  'candidates/fetchCandidates',
  async ({ page, searchQuery }, { rejectWithValue }) => {
    try {
      let query = supabase.from('candidates').select('*', { count: 'exact' });

      if (searchQuery) {
        query = query.or(`given_name.ilike.%${searchQuery}%,family_name.ilike.%${searchQuery}%,passport_no.ilike.%${searchQuery}%,national_id.ilike.%${searchQuery}%`);
      }
      
      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      
      query = query.range(from, to).order('created_at', { ascending: false });

      const { data, error, count } = await query;
      
      if (error) throw error;
      
      return { data, count };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Adds a new candidate.
 */
export const addCandidate = createAsyncThunk(
  'candidates/addCandidate',
  async (newCandidateData, { dispatch, rejectWithValue }) => {
    const { data, error } = await supabase.from('candidates').insert(newCandidateData).select().single();
    if (error) {
      dispatch(setNotification({ message: `Error adding candidate: ${error.message}`, severity: 'error' }));
      return rejectWithValue(error.message);
    }
    dispatch(setNotification({ message: 'Candidate added successfully!', severity: 'success' }));
    return data;
  }
);

/**
 * Updates an existing candidate.
 */
export const updateCandidate = createAsyncThunk(
  'candidates/updateCandidate',
  async (updatedCandidateData, { dispatch, rejectWithValue }) => {
    const { id, ...updateData } = updatedCandidateData;
    const { data, error } = await supabase.from('candidates').update(updateData).eq('id', id).select().single();
    if (error) {
      dispatch(setNotification({ message: `Error updating candidate: ${error.message}`, severity: 'error' }));
      return rejectWithValue(error.message);
    }
    dispatch(setNotification({ message: 'Candidate updated successfully!', severity: 'success' }));
    return data;
  }
);


const initialState = {
  items: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  pagination: {
    currentPage: 1,
    totalCount: 0,
    totalPages: 1,
  },
};

const candidatesSlice = createSlice({
  name: 'candidates',
  initialState,
  reducers: {
    setCandidatesCurrentPage: (state, action) => {
        state.pagination.currentPage = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchCandidates.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCandidates.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.data;
        state.pagination.totalCount = action.payload.count;
        state.pagination.totalPages = Math.ceil(action.payload.count / PAGE_SIZE);
      })
      .addCase(fetchCandidates.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Add
      .addCase(addCandidate.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.pagination.totalCount += 1;
      })
      // Update
      .addCase(updateCandidate.fulfilled, (state, action) => {
          const index = state.items.findIndex(c => c.id === action.payload.id);
          if (index !== -1) {
              state.items[index] = action.payload;
          }
      });
  },
});

export const { setCandidatesCurrentPage } = candidatesSlice.actions;

// Selectors
export const selectAllCandidates = (state) => state.candidates.items;
export const selectCandidatesStatus = (state) => state.candidates.status;
export const selectCandidatesError = (state) => state.candidates.error;
export const selectCandidatesPagination = (state) => state.candidates.pagination;

export default candidatesSlice.reducer;