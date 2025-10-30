import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchOrientationCenters, selectOrientationCenters } from '../../../features/orientation/orientationSlice';
import PageHeader from '../../../components/common/PageHeader';

const OrientationCentersListPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const centers = useAppSelector(selectOrientationCenters);

  useEffect(() => {
    dispatch(fetchOrientationCenters());
  }, [dispatch]);

  const columns = useMemo(() => [
    { field: 'name', headerName: 'Center Name', flex: 1.5 },
    { field: 'contact_person', headerName: 'Contact Person', flex: 1 },
    { field: 'phone_number', headerName: 'Phone Number', flex: 1 },
    { field: 'address', headerName: 'Address', flex: 2 },
  ], []);

  return (
    <Box>
      <PageHeader
        title="Orientation Centers"
        buttonText="Add New Center"
        onButtonClick={() => alert('Navigate to New Center Form')}
      />
      <Paper sx={{ height: 650, width: '100%' }}>
        <DataGrid
          rows={centers}
          columns={columns}
          slots={{ toolbar: GridToolbar }}
        />
      </Paper>
    </Box>
  );
};
export default OrientationCentersListPage;