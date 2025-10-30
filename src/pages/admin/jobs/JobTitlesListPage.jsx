import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, IconButton, Tooltip, Chip } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchJobs, deleteJob, selectAllJobs, selectJobsStatus, jobUpserted, jobDeleted } from '../../../features/jobs/jobsSlice';
import PageHeader from '../../../components/common/PageHeader';
import DeleteConfirmDialog from '../../../components/common/DeleteConfirmDialog';
import { supabase } from '../../../api/supabaseClient';
import { format } from 'date-fns';

const JobTitlesListPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const jobs = useAppSelector(selectAllJobs);
  const status = useAppSelector(selectJobsStatus);

  const [deleteInfo, setDeleteInfo] = useState({ open: false, id: null });

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchJobs({ page: 1 }));
    }

    const subscription = supabase.channel('public:jobs')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'jobs' }, async (payload) => {
        // Refetch the row with client data since the payload doesn't contain it
        if (payload.new?.id) {
          const { data } = await supabase.from('jobs').select('*, clients(company_name, lt_number)').eq('id', payload.new.id).single();
          if (data) {
            dispatch(jobUpserted(data));
          }
        } else if (payload.eventType === 'DELETE') {
          dispatch(jobDeleted(payload.old));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [status, dispatch]);

  const handleDeleteClick = (id) => setDeleteInfo({ open: true, id });
  const handleDeleteConfirm = () => {
    if (deleteInfo.id) {
      dispatch(deleteJob(deleteInfo.id));
    }
    setDeleteInfo({ open: false, id: null });
  };
  
  const columns = useMemo(() => [
    { field: 'job_title', headerName: 'Job Title', flex: 1.5 },
    {
      field: 'company_name',
      headerName: 'Company',
      flex: 1.5,
      valueGetter: (params) => params.row.clients?.company_name || 'N/A',
    },
    {
      field: 'lt_number',
      headerName: 'LT#',
      width: 100,
      valueGetter: (params) => params.row.clients?.lt_number || 'N/A',
    },
    { field: 'positions_required', headerName: 'Required', type: 'number', width: 100 },
    { field: 'placements_filled', headerName: 'Placed', type: 'number', width: 100 },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => {
        const isOpen = params.row.positions_required > params.row.placements_filled;
        return <Chip label={isOpen ? 'Open' : 'Closed'} color={isOpen ? 'success' : 'default'} size="small" />;
      },
    },
     {
      field: 'created_at',
      headerName: 'Date Posted',
      width: 150,
      valueFormatter: (params) => format(new Date(params.value), 'MMM d, yyyy'),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Box>
           <Tooltip title="View Details">
            <IconButton onClick={() => alert('View Details ' + params.id)}>
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton onClick={() => navigate(`/job-titles/${params.id}/edit`)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={() => handleDeleteClick(params.id)} color="error">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ], [navigate]);

  return (
    <Box>
      <PageHeader
        title="Job Title Management"
        buttonText="Add New Job"
        onButtonClick={() => navigate('/job-titles/new')}
      />
      <Paper sx={{ height: 650, width: '100%' }}>
        <DataGrid
          rows={jobs}
          columns={columns}
          loading={status === 'loading'}
          pageSizeOptions={[10, 25, 50]}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: { showQuickFilter: true, quickFilterProps: { debounceMs: 500 } },
          }}
          disableRowSelectionOnClick
        />
      </Paper>
      <DeleteConfirmDialog
        open={deleteInfo.open}
        onClose={() => setDeleteInfo({ open: false, id: null })}
        onConfirm={handleDeleteConfirm}
      />
    </Box>
  );
};

export default JobTitlesListPage;