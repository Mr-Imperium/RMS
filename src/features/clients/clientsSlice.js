import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../api/supabaseClient';
import { setNotification } from '../ui/uiSlice';

const PAGE_SIZE = 15;
const CLIENT_SELECT_QUERY = 'id, company_name, focal_person_name, country, status, created_at'; // Define a standard select query

/**
 * Fetches a paginated and searchable list of clients.
 * @param {{ page: number, searchQuery?: string }} args
 */
export const fetchClients = createAsyncThunk(
  'clients/fetchClients',
  async ({ page, searchQuery }, { rejectWithValue }) => {
    try {
      let query = supabase
        .from('clients')
        // Use the defined partial select query for list views to improve performance
        .select(`${CLIENT_SELECT_QUERY}, count()`, { count: 'exact' }); 

      if (searchQuery) {
        // Use a single .or() or .filter() call for cleaner syntax
        query = query.or(`company_name.ilike.%${searchQuery}%,focal_person_name.ilike.%${searchQuery}%`);
      }
      
      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      
      query = query.range(from, to).order('created_at', { ascending: false });

      const { data, error, count } = await query;
      
      if (error) throw error;
      
      return { data, count, currentPage: page };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Adds a new client.
 * @param {object} newClientData - The data for the new client.
 */
export const addClient = createAsyncThunk(
  'clients/addClient',
  async (newClientData, { dispatch, rejectWithValue }) => {
    // Select the necessary columns for display after insert
    const { data, error } = await supabase.from('clients').insert(newClientData).select(CLIENT_SELECT_QUERY).single();
    if (error) {
      dispatch(setNotification({ message: `Error adding client: ${error.message}`, severity: 'error' }));
      return rejectWithValue(error.message);
    }
    dispatch(setNotification({ message: 'Client added successfully!', severity: 'success' }));
    return data;
  }
);

/**
 * Updates an existing client.
 * @param {object} updatedClientData - The updated client data, must include an `id`.
 */
export const updateClient = createAsyncThunk(
  'clients/updateClient',
  async (updatedClientData, { dispatch, rejectWithValue }) => {
    const { id, ...updateData } = updatedClientData;
    // Select the necessary columns for display after update
    const { data, error } = await supabase.from('clients').update(updateData).eq('id', id).select(CLIENT_SELECT_QUERY).single();
    if (error) {
      dispatch(setNotification({ message: `Error updating client: ${error.message}`, severity: 'error' }));
      return rejectWithValue(error.message);
    }
    dispatch(setNotification({ message: 'Client updated successfully!', severity: 'success' }));
    return data;
  }
);

/**
 * Deletes a client.
 * @param {string} clientId - The UUID of the client to delete.
 */
export const deleteClient = createAsyncThunk(
  'clients/deleteClient',
  async (clientId, { dispatch, rejectWithValue }) => {
    const { error } = await supabase.from('clients').delete().eq('id', clientId);
    if (error) {
      dispatch(setNotification({ message: `Error deleting client: ${error.message}`, severity: 'error' }));
      return rejectWithValue(error.message);
    }
    dispatch(setNotification({ message: 'Client deleted successfully!', severity: 'success' }));
    return clientId;
  }
);

/**
 * Fetches the full record for a single client (used for forms/detail views).
 */
export const fetchSingleClient = createAsyncThunk(
  'clients/fetchSingle',
  async (clientId, { rejectWithValue }) => {
    // Select all fields here as it's a detail view
    const { data, error } = await supabase.from('clients').select('*').eq('id', clientId).single();
    if (error) return rejectWithValue(error.message);
    return data;
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
  // Add a field to store the currently viewed/edited client (full data)
  singleClient: null, 
  singleClientStatus: 'idle',
};

const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    // FIX: Added setCurrentPage reducer definition
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    // Action for realtime inserts and updates
    clientUpserted: (state, action) => {
      const index = state.items.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload; // Update existing
      } else {
        state.items.unshift(action.payload); // Add new to the top
        state.pagination.totalCount += 1;
      }
    },
    // Action for realtime deletes
    clientDeleted: (state, action) => {
      state.items = state.items.filter(c => c.id !== action.payload); // Pass ID as payload
      state.pagination.totalCount -= 1;
    },
  }, // <-- FIX: Added missing comma here!

  extraReducers: (builder) => {
    builder
      // ------------------------------------
      // fetchClients
      // ------------------------------------
      .addCase(fetchClients.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        state.items = action.payload.data;
        state.pagination.totalCount = action.payload.count;
        state.pagination.currentPage = action.payload.currentPage;
        state.pagination.totalPages = Math.ceil(action.payload.count / PAGE_SIZE);
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // ------------------------------------
      // addClient
      // ------------------------------------
      .addCase(addClient.fulfilled, (state, action) => {
        // Since we rely on realtime `clientUpserted` for state update,
        // we can remove direct insertion here, but keeping it ensures consistency
        // if realtime is delayed or disabled.
        const index = state.items.findIndex(c => c.id === action.payload.id);
        if (index === -1) {
             state.items.unshift(action.payload);
             state.pagination.totalCount += 1;
        }
      })
      
      // ------------------------------------
      // updateClient
      // ------------------------------------
      .addCase(updateClient.fulfilled, (state, action) => {
        // Update the item in the list view
        const index = state.items.findIndex(client => client.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        // Update the singleClient detail view if it's the one being edited
        if (state.singleClient && state.singleClient.id === action.payload.id) {
            state.singleClient = { ...state.singleClient, ...action.payload };
        }
      })
      
      // ------------------------------------
      // deleteClient
      // ------------------------------------
      .addCase(deleteClient.fulfilled, (state, action) => {
        state.items = state.items.filter(client => client.id !== action.payload);
        state.pagination.totalCount -= 1;
      })

      // ------------------------------------
      // fetchSingleClient
      // ------------------------------------
      .addCase(fetchSingleClient.pending, (state) => {
        state.singleClientStatus = 'loading';
        state.singleClient = null;
      })
      .addCase(fetchSingleClient.fulfilled, (state, action) => {
        state.singleClientStatus = 'succeeded';
        state.singleClient = action.payload;
      })
      .addCase(fetchSingleClient.rejected, (state, action) => {
        state.singleClientStatus = 'failed';
        state.error = action.payload; // Use the general error field for the failure message
      });
  },
});

export const { setCurrentPage, clientUpserted, clientDeleted } = clientsSlice.actions;

// Selectors
export const selectAllClients = (state) => state.clients.items;
export const selectClientsStatus = (state) => state.clients.status;
export const selectClientsError = (state) => state.clients.error;
export const selectClientsPagination = (state) => state.clients.pagination;
export const selectSingleClient = (state) => state.clients.singleClient;
export const selectSingleClientStatus = (state) => state.clients.singleClientStatus;

export default clientsSlice.reducer;