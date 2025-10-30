import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { executeGlobalSearch } from '../../services/searchService';

export const performSearch = createAsyncThunk('search/execute', async (searchTerm, { rejectWithValue }) => {
    const { data, error } = await executeGlobalSearch(searchTerm);
    if (error) return rejectWithValue(error.message);
    return data;
});

const initialState = {
    query: '',
    results: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
};

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        clearSearch: (state) => {
            state.query = '';
            state.results = [];
            state.status = 'idle';
        },
        setSearchQuery: (state, action) => {
            state.query = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(performSearch.pending, (state) => { state.status = 'loading'; })
            .addCase(performSearch.fulfilled, (state, action) => {
                state.results = action.payload;
                state.status = 'succeeded';
            })
            .addCase(performSearch.rejected, (state) => { state.status = 'failed'; });
    }
});

export const { clearSearch, setSearchQuery } = searchSlice.actions;
export const selectSearchResults = (state) => state.search.results;
export const selectSearchStatus = (state) => state.search.status;
export default searchSlice.reducer;