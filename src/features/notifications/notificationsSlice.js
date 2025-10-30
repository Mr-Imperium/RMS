import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../api/supabaseClient';

export const fetchNotifications = createAsyncThunk('notifications/fetchAll', async (_, { rejectWithValue }) => {
    const { data, error } = await supabase
        .from('notifications')
        .select('*, sender:sender_id(full_name)')
        .order('created_at', { ascending: false });
    if (error) return rejectWithValue(error.message);
    return data;
});

export const markNotificationAsRead = createAsyncThunk('notifications/markAsRead', async (notificationId, { rejectWithValue }) => {
    const { data, error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .select()
        .single();
    if (error) return rejectWithValue(error.message);
    return data;
});

export const markAllNotificationsAsRead = createAsyncThunk('notifications/markAllAsRead', async (_, { getState, rejectWithValue }) => {
    const { auth } = getState();
    if (!auth.profile) return rejectWithValue('User not authenticated');
    
    const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('recipient_id', auth.profile.id)
        .eq('is_read', false);
    if (error) return rejectWithValue(error.message);
    return true; // Indicates success
});

const initialState = {
    items: [],
    unreadCount: 0,
    status: 'idle',
};

const notificationsSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        // Action to handle a new notification from a realtime subscription
        newNotificationReceived: (state, action) => {
            state.items.unshift(action.payload);
            state.unreadCount += 1;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.items = action.payload;
                state.unreadCount = action.payload.filter(n => !n.is_read).length;
                state.status = 'succeeded';
            })
            .addCase(markNotificationAsRead.fulfilled, (state, action) => {
                const index = state.items.findIndex(n => n.id === action.payload.id);
                if (index !== -1 && !state.items[index].is_read) {
                    state.items[index].is_read = true;
                    state.unreadCount -= 1;
                }
            })
            .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
                state.items.forEach(item => item.is_read = true);
                state.unreadCount = 0;
            });
    }
});

export const { newNotificationReceived } = notificationsSlice.actions;
export const selectAllNotifications = (state) => state.notifications.items;
export const selectUnreadNotificationCount = (state) => state.notifications.unreadCount;
export default notificationsSlice.reducer;