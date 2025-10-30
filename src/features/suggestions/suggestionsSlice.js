import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../api/supabaseClient';
import { setNotification } from '../ui/uiSlice';

export const fetchSuggestions = createAsyncThunk('suggestions/fetchAll', async (_, { rejectWithValue }) => {
    const { data, error } = await supabase.from('suggestions').select('*, profiles(full_name)');
    if (error) return rejectWithValue(error.message);
    return data;
});

export const addSuggestion = createAsyncThunk('suggestions/add', async (suggestionData, { dispatch, rejectWithValue }) => {
    const { data, error } = await supabase.from('suggestions').insert(suggestionData).select('*, profiles(full_name)').single();
    if (error) {
        dispatch(setNotification({ message: `Failed to add suggestion: ${error.message}`, severity: 'error' }));
        return rejectWithValue(error.message);
    }
    dispatch(setNotification({ message: 'Suggestion submitted!', severity: 'success' }));
    return data;
});

export const resolveSuggestion = createAsyncThunk('suggestions/resolve', async ({ id, resolution_text }, { dispatch, rejectWithValue }) => {
    const { data, error } = await supabase.from('suggestions').update({ is_resolved: true, resolution_text }).eq('id', id).select('*, profiles(full_name)').single();
     if (error) return rejectWithValue(error.message);
    dispatch(setNotification({ message: 'Suggestion marked as resolved.', severity: 'info' }));
    return data;
});

const suggestionsSlice = createSlice({
    name: 'suggestions',
    initialState: { items: [], status: 'idle' },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSuggestions.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchSuggestions.fulfilled, (state, action) => { state.items = action.payload; state.status = 'succeeded'; })
            .addCase(addSuggestion.fulfilled, (state, action) => { state.items.unshift(action.payload); })
            .addCase(resolveSuggestion.fulfilled, (state, action) => {
                const index = state.items.findIndex(s => s.id === action.payload.id);
                if (index !== -1) state.items[index] = action.payload;
            });
    }
});

export const selectAllSuggestions = (state) => state.suggestions.items;
export default suggestionsSlice.reducer;
