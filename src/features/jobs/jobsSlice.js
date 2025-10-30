import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../api/supabaseClient';
import { setNotification } from '../ui/uiSlice';

const PAGE_SIZE = 20; // Number of jobs per page

/**
 * @typedef {object} FetchJobsArgs
 * @property {number} page - The current page number.
 * @property {string} [searchQuery] - Optional search term.
 * @property {string} [clientId] - Optional client ID to filter jobs by.
 */

/**
 * Fetches a paginated and searchable list of jobs with related client info.
 * @param {FetchJobsArgs} args
 */
export const fetchJobs = createAsyncThunk(
  'jobs/fetchJobs',
  async ({ page, searchQuery, clientId }, { rejectWithValue }) => {
    try {
      let query = supabase
        .from('jobs')
        .select('*, clients(company_name, lt_number)', { count: 'exact' });

      if (searchQuery) {
        query = query.ilike('job_title', `%${searchQuery}%`);
      }

      if (clientId) {
        query = query.eq('client_id', clientId);
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
 * Adds a new job.
 * @param {object} newJobData - The data for the new job.
 */
export const addJob = createAsyncThunk(
  'jobs/addJob',
  async (newJobData, { dispatch, rejectWithValue }) => {
    const { data, error } = await supabase.from('jobs').insert(newJobData).select('*, clients(company_name, lt_number)').single();
    if (error) {
      dispatch(setNotification({ message: `Error adding job: ${error.message}`, severity: 'error' }));
      return rejectWithValue(error.message);
    }
    dispatch(setNotification({ message: 'Job added successfully!', severity: 'success' }));
    return data;
  }
);

/**
 * Updates an existing job.
 * @param {object} updatedJobData - The updated job data, must include an `id`.
 */
export const updateJob = createAsyncThunk(
  'jobs/updateJob',
  async (updatedJobData, { dispatch, rejectWithValue }) => {
    const { id, ...updateData } = updatedJobData;
    const { data, error } = await supabase.from('jobs').update(updateData).eq('id', id).select('*, clients(company_name, lt_number)').single();
    if (error) {
      dispatch(setNotification({ message: `Error updating job: ${error.message}`, severity: 'error' }));
      return rejectWithValue(error.message);
    }
    dispatch(setNotification({ message: 'Job updated successfully!', severity: 'success' }));
    return data;
  }
);

export const deleteJob = createAsyncThunk(
  'jobs/deleteJob',
  async (jobId, { dispatch, rejectWithValue }) => {
    const { error } = await supabase.from('jobs').delete().eq('id', jobId);
    if (error) {
      dispatch(setNotification({ message: `Error deleting job: ${error.message}`, severity: 'error' }));
      return rejectWithValue(error.message);
    }
    dispatch(setNotification({ message: 'Job deleted successfully!', severity: 'success' }));
    return jobId;
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

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setJobsCurrentPage: (state, action) => { /* ... */ },
    // Reducers for realtime updates
    jobUpserted: (state, action) => {
        const index = state.items.findIndex(j => j.id === action.payload.id);
        if (index !== -1) {
            state.items[index] = action.payload;
        } else {
            state.items.unshift(action.payload);
        }
    },
    jobDeleted: (state, action) => {
        state.items = state.items.filter(j => j.id !== action.payload.id);
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Jobs
      .addCase(fetchJobs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.data;
        state.pagination.totalCount = action.payload.count;
        state.pagination.totalPages = Math.ceil(action.payload.count / PAGE_SIZE);
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Add Job
      .addCase(addJob.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.pagination.totalCount += 1;
      })
      // Update Job
      .addCase(updateJob.fulfilled, (state, action) => {
          const index = state.items.findIndex(job => job.id === action.payload.id);
          if (index !== -1) {
              state.items[index] = action.payload;
          }
      });
  },
});

export const { setJobsCurrentPage, jobUpserted, jobDeleted } = jobsSlice.actions;
// Selectors
export const selectAllJobs = (state) => state.jobs.items;
export const selectJobsStatus = (state) => state.jobs.status;
export const selectJobsError = (state) => state.jobs.error;
export const selectJobsPagination = (state) => state.jobs.pagination;

export default jobsSlice.reducer;