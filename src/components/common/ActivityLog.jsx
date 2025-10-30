//import React, { useState, useEffect } from 'react';
//import { Box, Typography } from '@mui/material';
//import { Timeline, TimelineItem, TimelineSeparator, TimelineDot, TimelineConnector, TimelineContent, TimelineOppositeContent } from '@mui/lab';
//import { supabase } from '../../api/supabaseClient';
//import { format } from 'date-fns';

import React, { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Divider, Avatar } from '@mui/material';
import { supabase } from '../../api/supabaseClient';
import { format } from 'date-fns';

// Then restructure your component to use List instead of Timeline

const ActivityLog = ({ entityTable, recordId }) => {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const fetchLogs = async () => {
            const { data } = await supabase
                .from('activity_log')
                .select('*')
                .eq('entity_table', entityTable)
                .eq('record_id', recordId)
                .order('created_at', { ascending: false });
            setLogs(data || []);
        };
        fetchLogs();
    }, [entityTable, recordId]);

    return (
        <Box>
            <Typography variant="h6">Activity Log</Typography>
            <Timeline position="right">
                {logs.map(log => (
                    <TimelineItem key={log.id}>
                        <TimelineSeparator>
                            <TimelineDot />
                            <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>
                            <Typography variant="subtitle2">{log.user_name || 'A user'}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Performed action: <strong>{log.action}</strong>
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {format(new Date(log.created_at), 'MMM d, yyyy h:mm a')}
                            </Typography>
                        </TimelineContent>
                    </TimelineItem>
                ))}
            </Timeline>
        </Box>
    );
};
export default ActivityLog;