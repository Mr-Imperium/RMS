import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../api/supabaseClient';
import { setNotification } from '../ui/uiSlice';

// Fetches all user profiles with their roles
export const fetchStaff = createAsyncThunk('staff/fetchStaff', async (_, { rejectWithValue }) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, role_id, user_roles(role_name), raw_user_meta_data->>email as email'); // Get email from auth metadata
  if (error) return rejectWithValue(error.message);
  return data;
});

// Invokes the Edge Function to invite a new user
export const inviteStaff = createAsyncThunk('staff/inviteStaff', async (inviteData, { dispatch, rejectWithValue }) => {
  const { data, error } = await supabase.functions.invoke('invite-user', {
    body: inviteData,
  });
  if (error) {
    dispatch(setNotification({ message: `Error inviting staff: ${error.message}`, severity: 'error' }));
    return rejectWithValue(error.message);
  }
  dispatch(setNotification({ message: 'Invitation sent successfully!', severity: 'success' }));
  return data.user;
});

// Updates a staff member's role
export const updateStaffRole = createAsyncThunk('staff/updateStaffRole', async ({ id, role_id }, { dispatch, rejectWithValue }) => {
    const { data, error } = await supabase.from('profiles').update({ role_id }).eq('id', id).select('*, user_roles(role_name)').single();
    if (error) {
        dispatch(setNotification({ message: `Error updating role: ${error.message}`, severity: 'error' }));
        return rejectWithValue(error.message);
    }
    dispatch(setNotification({ message: 'Staff role updated!', severity: 'success' }));
    return data;
});


const initialState = {
  members: [],
  status: 'idle',
  error: null,
};

const staffSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStaff.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchStaff.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.members = action.payload;
      })
      .addCase(fetchStaff.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })
      .addCase(inviteStaff.fulfilled, (state, action) => {
        // Here we could add the invited user to the list with a 'pending' status
        // For simplicity, we'll just refetch the list after an invite.
      })
      .addCase(updateStaffRole.fulfilled, (state, action) => {
        const index = state.members.findIndex(m => m.id === action.payload.id);
        if (index !== -1) {
            // Need to merge data correctly
            const updatedMember = {...state.members[index], ...action.payload};
            state.members[index] = updatedMember;
        }
      });
  },
});

export const selectAllStaff = (state) => state.staff.members;
export const selectStaffStatus = (state) => state.staff.status;
export default staffSlice.reducer;