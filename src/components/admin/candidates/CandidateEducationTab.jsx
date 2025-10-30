import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button, List, ListItem, ListItemText, IconButton, Divider } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { supabase } from '../../../api/supabaseClient';
import LoadingSpinner from '../../common/LoadingSpinner';
// A form dialog for adding/editing would be created here or inline. For brevity, we'll imply it.

const CandidateEducationTab = ({ candidateId }) => {
    const [education, setEducation] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchEducation = useCallback(async () => {
        setLoading(true);
        const { data } = await supabase.from('candidate_education').select('*').eq('candidate_id', candidateId);
        setEducation(data || []);
        setLoading(false);
    }, [candidateId]);

    useEffect(() => {
        fetchEducation();
    }, [fetchEducation]);
    
    const handleDelete = async (id) => {
        await supabase.from('candidate_education').delete().eq('id', id);
        fetchEducation(); // Refresh list
    };

    if (loading) return <LoadingSpinner />;

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Educational History</Typography>
                <Button variant="outlined" startIcon={<AddIcon />}>Add Education</Button>
            </Box>
            <Divider />
            <List>
                {education.length > 0 ? education.map(edu => (
                    <ListItem key={edu.id} divider
                        secondaryAction={
                            <>
                                <IconButton edge="end" aria-label="edit"><EditIcon /></IconButton>
                                <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(edu.id)}><DeleteIcon /></IconButton>
                            </>
                        }
                    >
                        <ListItemText 
                            primary={`${edu.degree || 'Certificate'} in ${edu.field_of_study || 'N/A'}`}
                            secondary={edu.institution}
                        />
                    </ListItem>
                )) : <Typography sx={{ p: 2, textAlign: 'center' }}>No educational history added.</Typography>}
            </List>
        </Box>
    );
};

export default CandidateEducationTab;