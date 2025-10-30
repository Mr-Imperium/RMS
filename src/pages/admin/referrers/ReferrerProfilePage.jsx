import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Paper, Typography, Avatar, Grid, CircularProgress } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { DataGrid } from '@mui/x-data-grid';
import { supabase } from '../../../api/supabaseClient';

const ReferrerProfilePage = () => {
  const { id } = useParams();
  const [referrer, setReferrer] = useState(null);
  const [referredCandidates, setReferredCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      // Fetch referrer details
      const { data: referrerData } = await supabase.from('referrers').select('*').eq('id', id).single();
      setReferrer(referrerData);
      
      // Fetch candidates referred by this person
      const { data: candidatesData } = await supabase.from('candidates').select('*').eq('referrer_id', id);
      setReferredCandidates(candidatesData || []);
      
      setLoading(false);
    };
    fetchProfileData();
  }, [id]);

  const candidateColumns = [
    { field: 'given_name', headerName: 'Name', flex: 1, valueGetter: (params) => `${params.row.given_name || ''} ${params.row.family_name || ''}` },
    { field: 'passport_no', headerName: 'Passport #', flex: 1 },
    // A 'status' column would require joining with the lineups table
    { field: 'status', headerName: 'Status', flex: 1, renderCell: () => "Pending" },
  ];

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;
  }

  return (
    <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
                 <Avatar sx={{ width: 100, height: 100, margin: '0 auto 16px' }} src={referrer?.photo_url}>
                    <PersonIcon sx={{ fontSize: 60 }}/>
                </Avatar>
                <Typography variant="h5">{referrer?.full_name}</Typography>
                <Typography color="text.secondary">{referrer?.email}</Typography>
                <Typography color="text.secondary">{referrer?.phone_number}</Typography>
            </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Referred Candidates</Typography>
                <Box sx={{ height: 400, width: '100%' }}>
                    <DataGrid
                        rows={referredCandidates}
                        columns={candidateColumns}
                        pageSizeOptions={[5]}
                    />
                </Box>
            </Paper>
        </Grid>
    </Grid>
  );
};
export default ReferrerProfilePage;