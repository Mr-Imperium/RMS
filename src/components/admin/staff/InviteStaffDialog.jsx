import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, MenuItem } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { LoadingButton } from '@mui/lab';
import { supabase } from '../../../api/supabaseClient';

const schema = yup.object().shape({
  full_name: yup.string().required('Full name is required'),
  email: yup.string().email('Must be a valid email').required('Email is required'),
  role_id: yup.number().required('Role is required'),
});

const InviteStaffDialog = ({ open, onClose, onInvite }) => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRoles = async () => {
      const { data } = await supabase.from('user_roles').select('*');
      setRoles(data || []);
    };
    if (open) fetchRoles();
  }, [open]);

  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    await onInvite(data);
    setLoading(false);
    reset();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Invite New Staff Member</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Controller name="full_name" control={control} render={({ field }) => (
                <TextField {...field} label="Full Name" fullWidth required error={!!errors.full_name} helperText={errors.full_name?.message} />
              )} />
            </Grid>
            <Grid item xs={12}>
              <Controller name="email" control={control} render={({ field }) => (
                <TextField {...field} label="Email Address" fullWidth required error={!!errors.email} helperText={errors.email?.message} />
              )} />
            </Grid>
            <Grid item xs={12}>
              <Controller name="role_id" control={control} render={({ field }) => (
                <TextField {...field} label="Role" select fullWidth required error={!!errors.role_id} helperText={errors.role_id?.message}>
                  {roles.map((role) => <MenuItem key={role.id} value={role.id}>{role.role_name}</MenuItem>)}
                </TextField>
              )} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <LoadingButton type="submit" variant="contained" loading={loading}>Invite</LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};
export default InviteStaffDialog;