import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Grid, Paper, Divider } from '@mui/material';
import { supabase } from '../../api/supabaseClient';
import PrintLayout from '../../components/print/PrintLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const CandidateProfilePrint = () => {
    const { id } = useParams();
    const [candidate, setCandidate] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllData = async () => {
            const { data: candidateData } = await supabase.from('candidates').select('*').eq('id', id).single();
            // In a real scenario, you'd fetch education, experience, etc. in parallel
            // const { data: educationData } = await supabase.from('candidate_education')...
            
            setCandidate(candidateData);
            setLoading(false);
        };
        fetchAllData();
    }, [id]);

    if (loading) return <LoadingSpinner fullPage />;
    if (!candidate) return <Typography>Candidate Not Found</Typography>;
    
    const fullName = `${candidate.given_name} ${candidate.family_name || ''}`;

    return (
        <PrintLayout documentTitle={`Candidate Profile: ${fullName}`}>
            <Box>
                <Grid container spacing={2}>
                    <Grid item xs={6}><Typography><strong>Name:</strong> {fullName}</Typography></Grid>
                    <Grid item xs={6}><Typography><strong>Passport No:</strong> {candidate.passport_no}</Typography></Grid>
                    <Grid item xs={6}><Typography><strong>National ID:</strong> {candidate.national_id || 'N/A'}</Typography></Grid>
                    <Grid item xs={6}><Typography><strong>Mobile:</strong> {candidate.mobile_number || 'N/A'}</Typography></Grid>
                </Grid>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>Work Experience</Typography>
                {/* Placeholder for experience list */}
                <Typography variant="body2" color="text.secondary">Work history would be listed here...</Typography>
                
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>Education</Typography>
                {/* Placeholder for education list */}
                 <Typography variant="body2" color="text.secondary">Education records would be listed here...</Typography>
            </Box>
        </PrintLayout>
    );
};

export default CandidateProfilePrint;