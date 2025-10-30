import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../api/supabaseClient';
import { setNotification } from '../ui/uiSlice';

// Fetches all projects with related client and staff info
export const fetchProjects = createAsyncThunk('projects/fetchProjects', async (_, { rejectWithValue }) => {
  const { data, error } = await supabase
    .from('projects')
    .select('*, clients(company_name), project_staff(staff_id)');
  if (error) return rejectWithValue(error.message);
  return data;
});

// Adds a new project and its staff assignments
export const addProject = createAsyncThunk('projects/addProject', async ({ projectData, staffIds }, { dispatch, rejectWithValue }) => {
  // 1. Insert the main project data
  const { data: newProject, error: projectError } = await supabase
    .from('projects')
    .insert(projectData)
    .select()
    .single();
  
  if (projectError) {
    dispatch(setNotification({ message: `Error creating project: ${projectError.message}`, severity: 'error' }));
    return rejectWithValue(projectError.message);
  }

  // 2. Insert staff assignments
  if (staffIds && staffIds.length > 0) {
    const assignments = staffIds.map(staff_id => ({ project_id: newProject.id, staff_id }));
    const { error: staffError } = await supabase.from('project_staff').insert(assignments);
    if (staffError) {
      // Handle case where project was created but staff assignment failed
      dispatch(setNotification({ message: `Project created, but failed to assign staff: ${staffError.message}`, severity: 'warning' }));
    }
  }
  
  dispatch(setNotification({ message: 'Project created successfully!', severity: 'success' }));
  return newProject;
});

// ... create updateProject and deleteProject thunks similarly ...

const initialState = {
  items: [],
  status: 'idle',
  error: null,
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })
      .addCase(addProject.fulfilled, (state, action) => {
        // We will rely on refetching or realtime for a fully consistent state
      });
  },
});

export const selectAllProjects = (state) => state.projects.items;
export const selectProjectsStatus = (state) => state.projects.status;
export default projectsSlice.reducer;