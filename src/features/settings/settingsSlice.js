import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../api/supabaseClient';
import { setNotification } from '../ui/uiSlice';

// Fetches all settings and transforms them from an array to a key-value object
export const fetchAllSettings = createAsyncThunk('settings/fetchAll', async (_, { rejectWithValue }) => {
  const { data, error } = await supabase.from('system_settings').select('key, value');
  if (error) return rejectWithValue(error.message);
  
  // Convert the array of {key, value} to a single object {key1: value1, key2: value2}
  const settingsObject = data.reduce((acc, { key, value }) => {
    acc[key] = value;
    return acc;
  }, {});
  
  return settingsObject;
});

// Thunk to update multiple settings at once
export const updateSettings = createAsyncThunk('settings/update', async (settingsToUpdate, { dispatch, rejectWithValue }) => {
    // settingsToUpdate should be an array of {key, value} objects
    const { error } = await supabase.from('system_settings').upsert(settingsToUpdate);

    if (error) {
        dispatch(setNotification({ message: `Failed to update settings: ${error.message}`, severity: 'error' }));
        return rejectWithValue(error.message);
    }
    dispatch(setNotification({ message: 'Settings saved successfully!', severity: 'success' }));
    return settingsToUpdate;
});


const initialState = {
    config: {},
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllSettings.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchAllSettings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.config = action.payload;
      })
      .addCase(fetchAllSettings.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })
      .addCase(updateSettings.fulfilled, (state, action) => {
          // Update the local config state with the new values
          action.payload.forEach(({ key, value }) => {
              state.config[key] = value;
          });
      });
  },
});

export const selectAllSettings = (state) => state.settings.config;
export const selectSettingsStatus = (state) => state.settings.status;
export default settingsSlice.reducer;