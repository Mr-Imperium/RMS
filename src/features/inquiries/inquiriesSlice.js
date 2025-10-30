import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// Assuming 'supabaseClient' and 'uiSlice' paths are correct for your project
import { supabase } from '../../api/supabaseClient';
import { setNotification } from '../ui/uiSlice';

// --- ASYNC THUNKS ---

/**
 * Fetches all inquiry records from Supabase, joining with profile data.
 */
export const fetchInquiries = createAsyncThunk('inquiries/fetchAll', async (_, { rejectWithValue }) => {
  const { data, error } = await supabase
    .from('inquiries')
    .select('*, profiles(full_name)');
    
  if (error) return rejectWithValue(error.message);
  return data;
});

/**
 * Adds a new inquiry record to Supabase.
 */
export const addInquiry = createAsyncThunk('inquiries/add', async (inquiryData, { dispatch, rejectWithValue }) => {
  // Ensure 'select()' and 'single()' are used to return the newly inserted record
  const { data, error } = await supabase
    .from('inquiries')
    .insert(inquiryData)
    .select('*, profiles(full_name)')
    .single();

  if (error) return rejectWithValue(error.message);
  
  dispatch(setNotification({ message: 'Inquiry logged successfully', severity: 'success' }));
  return data;
});

/**
 * Converts an inquiry into a candidate, updates the inquiry status, and links the records.
 * NOTE: The data passed to the thunk must be the inquiry object.
 */
export const convertInquiryToCandidate = createAsyncThunk(
  'inquiries/convertToCandidate', 
  async (inquiry, { dispatch, rejectWithValue }) => {
    
    // Assuming the inquiry object has fields like 'full_name' and 'phone_number'
    
    // 1. Create a new candidate record
    const { data: newCandidate, error: candidateError } = await supabase
      .from('candidates')
      .insert({
        given_name: inquiry.full_name,          // Adjust field names as per your 'inquiries' table
        mobile_number: inquiry.phone_number,    // Adjust field names as per your 'inquiries' table
        // Add other relevant fields (e.g., email, inquiry source)
      })
      .select()
      .single();

    if (candidateError) {
      dispatch(setNotification({ message: `Failed to create candidate: ${candidateError.message}`, severity: 'error' }));
      return rejectWithValue(candidateError.message);
    }
    
    // 2. Update the inquiry record to link it to the new candidate
    const { data: updatedInquiry, error: inquiryError } = await supabase
      .from('inquiries')
      .update({ 
        status: 'Converted', 
        converted_to_candidate_id: newCandidate.id 
      })
      .eq('id', inquiry.id)
      .select('*, profiles(full_name)')
      .single(); // Use single() to return the updated object

    if (inquiryError) {
        // If the update fails, handle notification and rejection
        dispatch(setNotification({ message: `Failed to update inquiry: ${inquiryError.message}`, severity: 'error' }));
        return rejectWithValue(inquiryError.message);
    }
    
    dispatch(setNotification({ message: 'Inquiry successfully converted to Candidate!', severity: 'success' }));
    
    // Return both the updated inquiry and the ID of the new candidate for state management
    return { updatedInquiry, newCandidateId: newCandidate.id };
});

// --- SLICE DEFINITION ---

const inquiriesSlice = createSlice({
  name: 'inquiries',
  initialState: { 
    items: [], 
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null 
  },
  reducers: {}, // No sync reducers needed here

  extraReducers: (builder) => {
    builder
      // Fetch Inquiries
      .addCase(fetchInquiries.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchInquiries.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(fetchInquiries.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Add Inquiry
      .addCase(addInquiry.fulfilled, (state, action) => {
        // Add the new inquiry to the start of the list
        state.items.unshift(action.payload);
      })
      // The rejected case is implicitly handled by the notification in the thunk

      // Convert Inquiry
      .addCase(convertInquiryToCandidate.fulfilled, (state, action) => {
        // Find the index of the old inquiry and replace it with the updated one
        const index = state.items.findIndex(i => i.id === action.payload.updatedInquiry.id);
        if (index !== -1) {
          state.items[index] = action.payload.updatedInquiry;
        }
      });
  },
});

// --- SELECTORS ---

export const selectAllInquiries = (state) => state.inquiries.items;
export const selectInquiriesStatus = (state) => state.inquiries.status;
export const selectInquiriesError = (state) => state.inquiries.error;

export default inquiriesSlice.reducer;