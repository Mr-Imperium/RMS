import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Avatar } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchReferrers, selectAllReferrers, selectReferrersStatus } from '../../../features/referrers/referrersSlice';
import PageHeader from '../../../components/common/PageHeader';
import PersonIcon from '@mui/icons-material/Person';

const ReferrersListPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const referrers = useAppSelector(selectAllReferrers);
  const status = useAppSelector(selectReferrersStatus);

  useEffect(() => {
    dispatch(fetchReferrers());
  }, [dispatch]);

  const columns = useMemo(() => [
    {
      field: 'full_name',
      headerName: 'Name',
      flex: 1.5,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ width: 32, height: 32, mr: 1.5 }} src={params.row.photo_url}>
            <PersonIcon />
          </Avatar>
          {params.value}
        </Box>
      ),
    },
    { field: 'phone_number', headerName: 'Phone Number', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1.5 },
    {
      field: 'referral_count',
      headerName: 'Referrals',
      type: 'number',
      width: 120,
      align: 'center',
      headerAlign: 'center',
    },
    // Actions column for edit/delete would go here
  ], []);

  return (
    <Box>
      <PageHeader
        title="Referrer Management"
        buttonText="Add New Referrer"
        onButtonClick={() => navigate('/referrers/new')}
      />
      <Paper sx={{ height: 650, width: '100%' }}>
        <DataGrid
          rows={referrers}
          columns={columns}
          loading={status === 'loading'}
          slots={{ toolbar: GridToolbar }}
          onRowClick={(params) => navigate(`/referrers/${params.id}`)}
          sx={{ '& .MuiDataGrid-row:hover': { cursor: 'pointer' } }}
        />
      </Paper>
    </Box>
  );
};
export default ReferrersListPage;