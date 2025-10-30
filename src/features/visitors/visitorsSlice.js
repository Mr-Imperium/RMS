import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../api/supabaseClient';
import { setNotification } from '../ui/uiSlice';

export const fetchVisitors = createAsyncThunk('visitors/fetchAll', async (_, { rejectWithValue }) => {
  const { data, error } = await supabase.from('visitors').select('*, profiles(full_name)');
  if (error) return rejectWithValue(error.message);
  return data;
});

export const addVisitor = createAsyncThunk('visitors/add', async (visitorData, { dispatch, rejectWithValue }) => {
  const { data, error } = await supabase.from('visitors').insert(visitorData).select('*, profiles(full_name)').single();
  if (error) return rejectWithValue(error.message);
  dispatch(setNotification({ message: 'Visitor logged successfully', severity: 'success' }));
  return data;
});

export const convertVisitorToCandidate = createAsyncThunk('visitors/convertToCandidate', async (visitor, { dispatch, rejectWithValue }) => {
    // 1. Create a new candidate record
    const { data: newCandidate, error: candidateError } = await supabase
        .from('candidates')
        .insert({
            given_name: visitor.full_name,
            mobile_number: visitor.phone_number,
        })
        .select()
        .single();

    if (candidateError) {
        dispatch(setNotification({ message: `Failed to create candidate: ${candidateError.message}`, severity: 'error' }));
        return rejectWithValue(candidateError.message);
    }
    
    // 2. Update the visitor record to link it to the new candidate
    const { data: updatedVisitor, error: visitorError } = await supabase
        .from('visitors')
        .update({ status: 'Converted', converted_to_candidate_id: newCandidate.id })
        .eq('id', visitor.id)
        .select('*, profiles(full_name)')
        .single();

    if (visitorError) return rejectWithValue(visitorError.message);
    
    dispatch(setNotification({ message: 'Visitor successfully converted to Candidate!', severity: 'success' }));
    return { updatedVisitor, newCandidateId: newCandidate.id };
});

const visitorsSlice = createSlice({
  name: 'visitors',
  initialState: { items: [], status: 'idle' },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVisitors.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchVisitors.fulfilled, (state, action) => { state.items = action.payload; state.status = 'succeeded'; })
      .addCase(addVisitor.fulfilled, (state, action) => { state.items.unshift(action.payload); })
      .addCase(convertVisitorToCandidate.fulfilled, (state, action) => {
          const index = state.items.findIndex(v => v.id === action.payload.updatedVisitor.id);
          if (index !== -1) {
              state.items[index] = action.payload.updatedVisitor;
          }
      });
  },
});

export const selectAllVisitors = (state) => state.visitors.items;
export const selectVisitorsStatus = (state) => state.visitors.status;
export default visitorsSlice.reducer;