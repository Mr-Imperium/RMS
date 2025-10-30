import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, IconButton, Tooltip, Chip } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchClients, deleteClient, selectAllClients, selectClientsStatus, clientUpserted, clientDeleted, fetchSingleClient } from '../../../features/clients/clientsSlice';
import PageHeader from '../../../components/common/PageHeader';
import DeleteConfirmDialog from '../../../components/common/DeleteConfirmDialog';
import { supabase } from '../../../api/supabaseClient';
import useRealtime from '../../../hooks/useRealtime';

const CompaniesListPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const clients = useAppSelector(selectAllClients);
  const status = useAppSelector(selectClientsStatus);

  const [deleteInfo, setDeleteInfo] = useState({ open: false, id: null });

  useRealtime({
    channelName: 'public:clients',
    tableName: 'clients',
    upsertAction: clientUpserted,
    deleteAction: clientDeleted,
    refetcher: fetchSingleClient // Pass the refetcher thunk
  });

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchClients({ page: 1 }));
    }

    // Supabase Realtime subscription
    const subscription = supabase.channel('public:clients')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'clients' }, payload => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
              dispatch(clientUpserted(payload.new));
          }
          if (payload.eventType === 'DELETE') {
              dispatch(clientDeleted(payload.old));
          }
      })
      .subscribe();

    // Cleanup subscription on component unmount
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [status, dispatch]);

  const handleDeleteClick = (id) => {
    setDeleteInfo({ open: true, id });
  };

  const handleDeleteConfirm = () => {
    if (deleteInfo.id) {
      dispatch(deleteClient(deleteInfo.id));
    }
    setDeleteInfo({ open: false, id: null });
  };

  const columns = useMemo(() => [
    { field: 'lt_number', headerName: 'LT#', width: 100 },
    { field: 'company_name', headerName: 'Company Name', flex: 1 },
    { field: 'focal_person_name', headerName: 'Contact Person', flex: 1 },
    { field: 'country', headerName: 'Country', width: 150 },
    {
      field: 'visibility',
      headerName: 'Visibility',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === 'Public' ? 'success' : 'warning'}
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Edit">
            <IconButton onClick={() => navigate(`/clients/${params.id}/edit`)}>
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
        title="Company Management"
        buttonText="Add New Company"
        onButtonClick={() => navigate('/clients/new')}
      />
      <DataTable
        rows={clients}
        columns={columns}
        loading={status === 'loading'}
        onRowClick={(params) => navigate(`/clients/${params.id}`)}
      />
      <ConfirmDialog
        open={deleteInfo.open}
        onClose={() => setDeleteInfo({ open: false, id: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Company?"
        description="Are you sure you want to delete this company? This may also affect related job listings."
        confirmText="Delete"
        confirmColor="error"
      />
    </Box>
  );
};

export default CompaniesListPage;