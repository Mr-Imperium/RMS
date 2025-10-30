import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button, List, ListItem, ListItemText, IconButton, Divider } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { supabase } from '../../../api/supabaseClient';
import LoadingSpinner from '../../common/LoadingSpinner';

const CandidateExperienceTab = ({ candidateId }) => {
    const [experience, setExperience] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchExperience = useCallback(async () => {
        setLoading(true);
        const { data } = await supabase.from('candidate_experience').select('*').eq('candidate_id', candidateId);
        setExperience(data || []);
        setLoading(false);
    }, [candidateId]);

    useEffect(() => {
        fetchExperience();
    }, [fetchExperience]);
    
    const handleDelete = async (id) => {
        await supabase.from('candidate_experience').delete().eq('id', id);
        fetchExperience(); // Refresh list
    };

    if (loading) return <LoadingSpinner />;

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Work Experience</Typography>
                <Button variant="outlined" startIcon={<AddIcon />}>Add Experience</Button>
            </Box>
            <Divider />
            <List>
                {experience.length > 0 ? experience.map(exp => (
                    <ListItem key={exp.id} divider
                        secondaryAction={
                             <>
                                <IconButton edge="end"><EditIcon /></IconButton>
                                <IconButton edge="end" onClick={() => handleDelete(exp.id)}><DeleteIcon /></IconButton>
                            </>
                        }
                    >
                        <ListItemText 
                            primary={exp.job_title}
                            secondary={exp.company_name}
                        />
                    </ListItem>
                )) : <Typography sx={{ p: 2, textAlign: 'center' }}>No work experience added.</Typography>}
            </List>
        </Box>
    );
};

export default CandidateExperienceTab;