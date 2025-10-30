import React, { useState, useEffect, useMemo } from 'react';
import { Box, Paper, Autocomplete, TextField, Typography, Checkbox, Tooltip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchLineupsForJob, updateLineupStatus, selectAllLineups, selectLineupsStatus } from '../../../features/lineups/lineupsSlice';
import { supabase } from '../../../api/supabaseClient';

// Define the stages of the pipeline
const pipelineStages = [
    { field: 'interview_status', header: 'Interview' },
    { field: 'selection_status', header: 'Selection' },
    { field: 'medical_status', header: 'Medical' },
    { field: 'visa_apply_status', header: 'Visa Apply' },
    { field: 'visa_approval_status', header: 'Visa Approval' },
    { field: 'ticket_status', header: 'Ticket' },
    { field: 'departure_status', header: 'Departed' }
];

const LineUpsPage = () => {
    const dispatch = useAppDispatch();
    const lineups = useAppSelector(selectAllLineups);
    const status = useAppSelector(selectLineupsStatus);
    
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);

    // Fetch all jobs for the selector
    useEffect(() => {
        const fetchJobs = async () => {
            const { data } = await supabase.from('jobs').select('id, job_title, clients(company_name)');
            setJobs(data || []);
        };
        fetchJobs();
    }, []);

    // Fetch lineups when a job is selected
    useEffect(() => {
        if (selectedJob) {
            dispatch(fetchLineupsForJob(selectedJob.id));
        }
    }, [selectedJob, dispatch]);

    const handleStatusChange = (lineupId, statusField, newValue) => {
        dispatch(updateLineupStatus({ lineupId, statusField, newValue }));
    };

    const columns = useMemo(() => [
        {
            field: 'candidate_name',
            headerName: 'Candidate',
            flex: 1.5,
            valueGetter: (params) => `${params.row.given_name} ${params.row.family_name || ''}`
        },
        { field: 'passport_no', headerName: 'Passport #', flex: 1 },
        ...pipelineStages.map(stage => ({
            field: stage.field,
            headerName: stage.header,
            width: 120,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => (
                <Tooltip title={`Mark as ${params.value ? 'Incomplete' : 'Complete'}`}>
                    <Checkbox
                        checked={params.value || false}
                        onChange={(e) => handleStatusChange(params.row.lineup_id, stage.field, e.target.checked)}
                    />
                </Tooltip>
            )
        }))
    ], []);

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Line Ups Management</Typography>
            <Paper sx={{ p: 2, mb: 3 }}>
                <Autocomplete
                    options={jobs}
                    getOptionLabel={(option) => `${option.clients.company_name} - ${option.job_title}`}
                    value={selectedJob}
                    onChange={(_, newValue) => setSelectedJob(newValue)}
                    renderInput={(params) => <TextField {...params} label="Select a Job to View Lineups" />}
                />
            </Paper>
            {selectedJob && (
                <Paper sx={{ height: 600, width: '100%' }}>
                    <DataGrid
                        rows={lineups}
                        columns={columns}
                        loading={status === 'loading'}
                        getRowId={(row) => row.lineup_id}
                        checkboxSelection
                        disableRowSelectionOnClick
                    />
                </Paper>
            )}
        </Box>
    );
};
export default LineUpsPage;