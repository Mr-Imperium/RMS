import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../api/supabaseClient';

const PAGE_SIZE = 12; // Number of jobs per page for a card layout

/**
 * @typedef {object} FetchPublicJobsArgs
 * @property {number} page
 * @property {string} [searchQuery]
 * @property {string} [sortBy] - e.g., 'created_at.desc'
 */

/**
 * Fetches public job listings.
 * @param {FetchPublicJobsArgs} args
 */
export const fetchPublicJobs = createAsyncThunk(
  'publicJobs/fetchPublicJobs',
  async ({ page, searchQuery, sortBy = 'created_at.desc' }, { rejectWithValue }) => {
    try {
      let query = supabase
        .from('jobs')
        .select('*, clients!inner(company_name, country, address, lt_number)', { count: 'exact' })
        .eq('clients.visibility', 'Public'); // Crucial filter for public jobs only

      if (searchQuery) {
        query = query.or(
          `job_title.ilike.%${searchQuery}%,clients.company_name.ilike.%${searchQuery}%,clients.country.ilike.%${searchQuery}%`
        );
      }

      const [sortField, sortOrder] = sortBy.split('.');
      query = query.order(sortField, { ascending: sortOrder === 'asc', foreignTable: sortField.includes('clients.') ? 'clients' : undefined });
      
      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;
      
      if (error) throw error;
      
      return { data, count };
    } catch (error) {
      return rejectWithValue(error.message);
    }
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

const publicJobsSlice = createSlice({
  name: 'publicJobs',
  initialState,
  reducers: {
    setPublicJobsCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPublicJobs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPublicJobs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.data;
        state.pagination.totalCount = action.payload.count;
        state.pagination.totalPages = Math.ceil(action.payload.count / PAGE_SIZE);
      })
      .addCase(fetchPublicJobs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { setPublicJobsCurrentPage } = publicJobsSlice.actions;

// Selectors
export const selectAllPublicJobs = (state) => state.publicJobs.items;
export const selectPublicJobsStatus = (state) => state.publicJobs.status;
export const selectPublicJobsPagination = (state) => state.publicJobs.pagination;

export default publicJobsSlice.reducer;