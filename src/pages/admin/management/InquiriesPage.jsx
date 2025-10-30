import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Chip } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import PageHeader from '../../../components/common/PageHeader';
// Assuming an inquiriesSlice exists and is set up
import { fetchInquiries, selectAllInquiries, selectInquiriesStatus } from '../../../features/inquiries/inquiriesSlice';

const statusColors = {
  New: 'info',
  'In Progress': 'warning',
  Resolved: 'success',
  Closed: 'default',
};

const InquiriesPage = () => {
    const navigate = useNavigate();
    // const dispatch = useAppDispatch();
    // const inquiries = useAppSelector(selectAllInquiries);
    // const status = useAppSelector(selectInquiriesStatus);

    // Mock data until slice is created
    const inquiries = [];
    const status = 'succeeded';
    
    // useEffect(() => {
    //     dispatch(fetchInquiries());
    // }, [dispatch]);

    const columns = useMemo(() => [
        { field: 'subject', headerName: 'Subject', flex: 2 },
        { field: 'inquirer_name', headerName: 'Inquirer Name', flex: 1 },
        { field: 'inquirer_email', headerName: 'Email', flex: 1 },
        { field: 'status', headerName: 'Status', width: 120, renderCell: (p) => <Chip label={p.value} color={statusColors[p.value]} size="small" /> },
        // { field: 'assigned_to', headerName: 'Assigned To', flex: 1 },
    ], []);

    return (
        <Box>
            <PageHeader title="Inquiry Management" buttonText="Log New Inquiry" onButtonClick={() => alert("Open Inquiry Form Dialog")} />
            <Paper sx={{ height: 650, width: '100%' }}>
                <DataGrid
                    rows={inquiries}
                    columns={columns}
                    loading={status === 'loading'}
                    slots={{ toolbar: GridToolbar }}
                     onRowClick={(params) => alert(`Navigate to Inquiry Detail Page for ${params.id}`)}
                     sx={{ '& .MuiDataGrid-row:hover': { cursor: 'pointer' } }}
                />
            </Paper>
        </Box>
    );
};
export default InquiriesPage;