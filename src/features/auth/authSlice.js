import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../api/supabaseClient';
import { signInWithPassword, signOut, getSession } from '../../services/authService';

/**
 * Fetches the user's profile from the 'profiles' table.
 * This is separate from the auth user and contains app-specific data like roles.
 */
export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (userId, { rejectWithValue }) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*, user_roles(role_name)')
      .eq('id', userId)
      .single();
      
    if (error) {
      return rejectWithValue(error.message);
    }
    // Flatten the role structure for easier access
    const profile = { ...data, role: data.user_roles.role_name };
    delete profile.user_roles;
    return profile;
  }
);

/**
 * Checks the initial session when the app loads.
 * If a session exists, it fetches the user profile.
 */
export const checkUserSession = createAsyncThunk(
  'auth/checkUserSession',
  async (_, { dispatch, rejectWithValue }) => {
    const session = await getSession();
    if (session?.user) {
      await dispatch(fetchUserProfile(session.user.id));
      return session;
    }
    return null;
  }
);

/**
 * Thunk for user login.
 */
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { dispatch, rejectWithValue }) => {
    const { data, error } = await signInWithPassword(email, password);
    if (error) {
      return rejectWithValue(error.message);
    }
    if (data.user) {
      await dispatch(fetchUserProfile(data.user.id));
    }
    return data.session;
  }
);

/**
 * Thunk for user logout.
 */
export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await signOut();
});

const initialState = {
  session: null,
  profile: null,
  isAuthenticated: false,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.session = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.isAuthenticated = false;
        state.session = null;
        state.profile = null;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.session = null;
        state.profile = null;
        state.status = 'idle';
      })
      // Fetch Profile
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      // Check Session
      .addCase(checkUserSession.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(checkUserSession.fulfilled, (state, action) => {
        if (action.payload) {
          state.session = action.payload;
          state.isAuthenticated = true;
        }
        state.status = 'succeeded';
      })
      .addCase(checkUserSession.rejected, (state) => {
        state.status = 'failed';
        state.isAuthenticated = false;
      });
  },
});

// Selectors
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectCurrentUserProfile = (state) => state.auth.profile;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;
