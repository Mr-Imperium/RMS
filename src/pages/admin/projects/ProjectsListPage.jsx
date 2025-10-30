import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Tooltip, Chip, Avatar, AvatarGroup, LinearProgress } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchProjects, selectAllProjects, selectProjectsStatus } from '../../../features/projects/projectSlice';
import PageHeader from '../../../components/common/PageHeader';
import { format } from 'date-fns';

const statusColors = {
  'Planning': 'default',
  'In Progress': 'info',
  'On Hold': 'warning',
  'Completed': 'success',
  'Cancelled': 'error',
};

const ProjectsListPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const projects = useAppSelector(selectAllProjects);
  const status = useAppSelector(selectProjectsStatus);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const columns = useMemo(() => [
    { field: 'name', headerName: 'Project Name', flex: 1.5 },
    {
      field: 'client',
      headerName: 'Client',
      flex: 1,
      valueGetter: (params) => params.row.clients?.company_name || 'N/A',
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      renderCell: (params) => <Chip label={params.value} color={statusColors[params.value] || 'default'} size="small" />,
    },
    {
        field: 'progress',
        headerName: 'Progress',
        flex: 1,
        renderCell: (params) => (
            <Box sx={{width: '100%', my: 2}}>
                <LinearProgress variant="determinate" value={50} /> {/* Placeholder value */}
            </Box>
        )
    },
    {
      field: 'end_date',
      headerName: 'Due Date',
      width: 150,
      valueFormatter: (params) => params.value ? format(new Date(params.value), 'MMM d, yyyy') : 'N/A',
    },
    {
      field: 'team',
      headerName: 'Team',
      width: 150,
      renderCell: (params) => (
        <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 28, height: 28, fontSize: 12 } }}>
            {/* Logic to map staff_ids to actual staff avatars would go here */}
            <Avatar>JD</Avatar>
            <Avatar>AS</Avatar>
        </AvatarGroup>
      ),
    },
  ], []);

  return (
    <Box>
      <PageHeader
        title="Projects Dashboard"
        buttonText="Add New Project"
        onButtonClick={() => navigate('/projects/new')}
      />
      <Paper sx={{ height: 650, width: '100%' }}>
        <DataGrid
          rows={projects}
          columns={columns}
          loading={status === 'loading'}
          slots={{ toolbar: GridToolbar }}
          onRowClick={(params) => navigate(`/projects/${params.id}`)}
          sx={{ '& .MuiDataGrid-row:hover': { cursor: 'pointer' } }}
        />
      </Paper>
    </Box>
  );
};
export default ProjectsListPage;