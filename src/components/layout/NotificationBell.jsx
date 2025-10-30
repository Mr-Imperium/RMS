import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, IconButton, Popover, List, ListItem, ListItemText, Typography, Divider, Button } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectAllNotifications, selectUnreadNotificationCount, fetchNotifications, markNotificationAsRead, newNotificationReceived } from '../../features/notifications/notificationsSlice';
import { selectCurrentUserProfile } from '../../features/auth/authSlice';
import { supabase } from '../../api/supabaseClient';
import { formatDistanceToNow } from 'date-fns';

const NotificationBell = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const notifications = useAppSelector(selectAllNotifications);
    const unreadCount = useAppSelector(selectUnreadNotificationCount);
    const userProfile = useAppSelector(selectCurrentUserProfile);

    const [anchorEl, setAnchorEl] = useState(null);

    useEffect(() => {
        dispatch(fetchNotifications());
    }, [dispatch]);

    useEffect(() => {
        if (!userProfile) return;
        
        const channel = supabase.channel(`public:notifications:recipient_id=eq.${userProfile.id}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'notifications',
                filter: `recipient_id=eq.${userProfile.id}`
            }, async (payload) => {
                // The payload is minimal, so we fetch the full notification
                const { data } = await supabase.from('notifications').select('*, sender:sender_id(full_name)').eq('id', payload.new.id).single();
                if (data) {
                    dispatch(newNotificationReceived(data));
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userProfile, dispatch]);
    
    const handleOpen = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const handleNotificationClick = (notification) => {
        handleClose();
        if (!notification.is_read) {
            dispatch(markNotificationAsRead(notification.id));
        }
        if (notification.link_url) {
            navigate(notification.link_url);
        }
    };

    const open = Boolean(anchorEl);

    return (
        <>
            <IconButton color="inherit" onClick={handleOpen}>
                <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon />
                </Badge>
            </IconButton>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Box sx={{ width: 360 }}>
                    <Typography sx={{ p: 2, fontWeight: 'bold' }}>Notifications</Typography>
                    <Divider />
                    <List dense>
                        {notifications.slice(0, 5).map(notification => (
                            <ListItem button key={notification.id} onClick={() => handleNotificationClick(notification)} sx={{ backgroundColor: notification.is_read ? 'transparent' : 'action.hover' }}>
                                <ListItemText
                                    primary={notification.message}
                                    secondary={`${formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}`}
                                />
                            </ListItem>
                        ))}
                    </List>
                    <Divider />
                    <Button fullWidth onClick={() => { handleClose(); navigate('/notifications'); }}>View All Notifications</Button>
                </Box>
            </Popover>
        </>
    );
};
export default NotificationBell;