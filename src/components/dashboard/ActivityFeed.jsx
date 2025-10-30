import React from 'react';
import { List, ListItem, ListItemText, ListItemAvatar, Avatar, Typography, Box } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import PersonIcon from '@mui/icons-material/Person';

const ActivityFeed = ({ activities }) => {
    return (
        <Box>
            <Typography variant="h6" gutterBottom>Recent Activity</Typography>
            <List>
                {activities.map((activity) => (
                    <ListItem key={activity.created_at}>
                        <ListItemAvatar>
                            <Avatar><PersonIcon /></Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={`${activity.user_name || 'A user'} performed action: ${activity.action}`}
                            secondary={`${activity.entity_table} - ${formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}`}
                        />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};
export default ActivityFeed;