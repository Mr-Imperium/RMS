import React, { useEffect, useState, useMemo } from 'react';
import { Box, Paper, IconButton, Tooltip, Chip } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchStaff, inviteStaff, selectAllStaff, selectStaffStatus } from '../../../features/staff/staffSlice';
import PageHeader from '../../../components/common/PageHeader';
import InviteStaffDialog from '../../../components/admin/staff/InviteStaffDialog';
import usePermissions from '../../../hooks/usePermissions'; // Import hook
import { PERMISSIONS } from '../../../utils/permissions'; // Import permissions

const StaffListPage = () => {
  const dispatch = useAppDispatch();
  const staff = useAppSelector(selectAllStaff);
  const status = useAppSelector(selectStaffStatus);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const { can } = usePermissions(); // Use hook

  useEffect(() => {
    dispatch(fetchStaff());
  }, [dispatch]);

  const handleInvite = async (inviteData) => {
    await dispatch(inviteStaff(inviteData));
    setInviteDialogOpen(false);
    dispatch(fetchStaff());
  };
  
  const columns = useMemo(() => [
    { field: 'full_name', headerName: 'Full Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1.5 },
    {
      field: 'role', headerName: 'Role', width: 150,
      renderCell: (params) => <Chip label={params.row.user_roles.role_name} size="small" />
    },
    // Actions column would also be conditionally rendered based on permissions
  ], []);

  return (
    <Box>
      <PageHeader
        title="Staff Management"
        buttonText={can(PERMISSIONS.MANAGE_STAFF) ? "Invite New Staff" : null}
        onButtonClick={can(PERMISSIONS.MANAGE_STAFF) ? () => setInviteDialogOpen(true) : null}
      />
      <Paper sx={{ height: 650, width: '100%' }}>
        <DataGrid rows={staff} columns={columns} loading={status === 'loading'} slots={{ toolbar: GridToolbar }} />
      </Paper>
      {can(PERMISSIONS.MANAGE_STAFF) && (
        <InviteStaffDialog open={inviteDialogOpen} onClose={() => setInviteDialogOpen(false)} onInvite={handleInvite} />
      )}
    </Box>
  );
};
export default StaffListPage;