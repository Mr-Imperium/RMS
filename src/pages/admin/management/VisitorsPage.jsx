import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Chip, Tooltip, IconButton, Button } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import TransformIcon from '@mui/icons-material/Transform';
import PersonIcon from '@mui/icons-material/Person';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchVisitors, convertVisitorToCandidate, selectAllVisitors, selectVisitorsStatus } from '../../../features/visitors/visitorsSlice';
import PageHeader from '../../../components/common/PageHeader';
import { format } from 'date-fns';

const statusColors = {
  Pending: 'warning',
  'Follow-up': 'info',
  Converted: 'success',
  Archived: 'default',
};

const VisitorsPage = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const visitors = useAppSelector(selectAllVisitors);
    const status = useAppSelector(selectVisitorsStatus);

    useEffect(() => {
        dispatch(fetchVisitors());
    }, [dispatch]);
    
    const handleConvert = (visitor) => {
        dispatch(convertVisitorToCandidate(visitor))
            .unwrap()
            .then(result => {
                // Navigate to the newly created candidate's profile
                navigate(`/candidates/${result.newCandidateId}`);
            });
    };

    const columns = useMemo(() => [
        { field: 'full_name', headerName: 'Visitor Name', flex: 1.5 },
        { field: 'purpose_of_visit', headerName: 'Purpose', flex: 2 },
        { field: 'phone_number', headerName: 'Phone', flex: 1 },
        { field: 'visit_date', headerName: 'Visit Date', width: 150, valueFormatter: (p) => format(new Date(p.value), 'MMM d, yyyy')},
        { field: 'status', headerName: 'Status', width: 120, renderCell: (p) => <Chip label={p.value} color={statusColors[p.value]} size="small" /> },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            sortable: false,
            renderCell: (params) => (
                <Box>
                    {params.row.status !== 'Converted' && (
                        <Tooltip title="Convert to Candidate">
                            <IconButton onClick={() => handleConvert(params.row)}>
                                <TransformIcon color="primary" />
                            </IconButton>
                        </Tooltip>
                    )}
                    {params.row.converted_to_candidate_id && (
                        <Tooltip title="View Candidate Profile">
                            <IconButton onClick={() => navigate(`/candidates/${params.row.converted_to_candidate_id}`)}>
                                <PersonIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>
            )
        }
    ], [navigate]);

    return (
        <Box>
            <PageHeader title="Visitor Log" buttonText="Log New Visitor" onButtonClick={() => alert("Open Visitor Form Dialog")} />
            <Paper sx={{ height: 650, width: '100%' }}>
                <DataGrid
                    rows={visitors}
                    columns={columns}
                    loading={status === 'loading'}
                    slots={{ toolbar: GridToolbar }}
                />
            </Paper>
        </Box>
    );
};
export default VisitorsPage;