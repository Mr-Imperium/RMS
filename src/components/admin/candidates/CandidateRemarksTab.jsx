import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, TextField, Button, Paper } from '@mui/material';
import { 
    Timeline, 
    TimelineItem, 
    TimelineSeparator, 
    TimelineConnector, 
    TimelineContent, 
    TimelineDot, 
    TimelineOppositeContent 
} from '@mui/lab';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { addRemark, fetchRemarksForEntity, selectRemarksByEntityId } from '../../../features/remarks/remarksSlice';
import { selectCurrentUserProfile } from '../../../features/auth/authSlice';
import { format } from 'date-fns';

const CandidateRemarksTab = ({ candidateId }) => {
    const dispatch = useAppDispatch();
    const remarks = useAppSelector(selectRemarksByEntityId(candidateId));
    const userProfile = useAppSelector(selectCurrentUserProfile);
    const [newRemark, setNewRemark] = useState('');

    useEffect(() => {
        dispatch(fetchRemarksForEntity({ entityId: candidateId, entityType: 'candidate' }));
    }, [dispatch, candidateId]);

    const handleAddRemark = () => {
        if (newRemark.trim() && userProfile) {
            dispatch(addRemark({
                remark_text: newRemark,
                user_id: userProfile.id,
                entity_id: candidateId,
                entity_type: 'candidate',
            }));
            setNewRemark('');
        }
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>Activity & Remarks</Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <TextField label="Add a new remark..." value={newRemark} onChange={(e) => setNewRemark(e.target.value)} fullWidth multiline/>
                <Button variant="contained" onClick={handleAddRemark}>Add</Button>
            </Box>
            <Timeline position="alternate">
                {remarks.map((remark) => (
                    <TimelineItem key={remark.id}>
                        <TimelineOppositeContent color="text.secondary">
                            {format(new Date(remark.created_at), 'MMM d, yyyy h:mm a')}
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                            <TimelineDot color="primary" />
                            <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent sx={{ py: '12px', px: 2 }}>
                            <Typography variant="h6" component="span">{remark.profiles.full_name}</Typography>
                            <Typography>{remark.remark_text}</Typography>
                        </TimelineContent>
                    </TimelineItem>
                ))}
            </Timeline>
        </Box>
    );
};

export default CandidateRemarksTab;