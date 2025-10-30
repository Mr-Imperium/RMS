import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Paper, Typography, Avatar, Tabs, Tab } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import DescriptionIcon from '@mui/icons-material/Description';
import CommentIcon from '@mui/icons-material/Comment';
import { supabase } from '../../../api/supabaseClient';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import CandidateDetailsTab from '../../../components/admin/candidates/CandidateDetailsTab';
import CandidateEducationTab from '../../../components/admin/candidates/CandidateEducationTab';
import CandidateExperienceTab from '../../../components/admin/candidates/CandidateExperienceTab';
import CandidateDocumentsTab from '../../../components/admin/candidates/CandidateDocumentsTab';
import CandidateRemarksTab from '../../../components/admin/candidates/CandidateRemarksTab';
import ActivityLog from '../../../components/common/ActivityLog';
import PrintButton from '../../../components/common/PrintButton';


const CandidateProfilePage = () => {
  const { id } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  const fetchCandidate = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('candidates').select('*').eq('id', id).single();
    setCandidate(data);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    if(id) fetchCandidate();
  }, [id, fetchCandidate]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading) return <LoadingSpinner fullPage />;
  if (!candidate) return <Typography sx={{p: 3}}>Candidate not found.</Typography>;

  const fullName = `${candidate.given_name || ''} ${candidate.family_name || ''}`;

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ width: 64, height: 64, mr: 2, bgcolor: 'primary.main' }}>
              <PersonIcon sx={{ fontSize: 40 }}/>
            </Avatar>
            <Box>
              <Typography variant="h4" component="h1">{/* ... Full Name ... */}</Typography>
              <Typography variant="body1" color="text.secondary">Passport #: {candidate.passport_no || 'N/A'}</Typography>
            </Box>
        </Box>
        {/* Add the Print Button here */}
        <PrintButton printUrl={`/print/candidate/${id}`} />
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
          <Tab icon={<PersonIcon />} iconPosition="start" label="Details" />
          <Tab icon={<SchoolIcon />} iconPosition="start" label="Education" />
          <Tab icon={<WorkIcon />} iconPosition="start" label="Experience" />
          <Tab icon={<DescriptionIcon />} iconPosition="start" label="Documents" />
          <Tab icon={<CommentIcon />} iconPosition="start" label="Remarks" />
          <Tab icon={<HistoryIcon />} iconPosition="start" label="Activity" /> {/* New Tab */}
        </Tabs>
      </Box>

      <Box sx={{ pt: 3 }}>
        {activeTab === 0 && <CandidateDetailsTab candidate={candidate} onUpdate={fetchCandidate} />}
        {activeTab === 1 && <CandidateEducationTab candidateId={id} />}
        {activeTab === 2 && <CandidateExperienceTab candidateId={id} />}
        {activeTab === 3 && <CandidateDocumentsTab candidateId={id} />}
        {activeTab === 4 && <CandidateRemarksTab candidateId={id} />}
        {activeTab === 5 && <ActivityLog entityTable="candidates" recordId={id} />} {/* New Content */}
      </Box>
    </Paper>
  );
};
export default CandidateProfilePage;