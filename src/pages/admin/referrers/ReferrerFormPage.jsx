import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Paper, Grid, TextField, Button, Box, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useAppDispatch } from '../../../app/hooks';
import { addReferrer, fetchReferrers } from '../../../features/referrers/referrersSlice';

const schema = yup.object().shape({
  full_name: yup.string().required('Full name is required'),
  phone_number: yup.string(),
  email: yup.string().email('Enter a valid email'),
  address: yup.string(),
  notes: yup.string(),
});

const ReferrerFormPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = React.useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { full_name: '', phone_number: '', email: '', address: '', notes: '' },
  });

  const onSubmit = async (formData) => {
    setLoading(true);
    await dispatch(addReferrer(formData)).unwrap();
    await dispatch(fetchReferrers()); // Refetch the list to update counts
    setLoading(false);
    navigate('/referrers');
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" component="h1" sx={{ mb: 3 }}>
        Add New Referrer
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Controller name="full_name" control={control} render={({ field }) => (
              <TextField {...field} label="Full Name" fullWidth required error={!!errors.full_name} helperText={errors.full_name?.message} />
            )} />
          </Grid>
           <Grid item xs={12} sm={6}>
            <Controller name="phone_number" control={control} render={({ field }) => (
              <TextField {...field} label="Phone Number" fullWidth />
            )} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller name="email" control={control} render={({ field }) => (
              <TextField {...field} label="Email Address" fullWidth error={!!errors.email} helperText={errors.email?.message} />
            )} />
          </Grid>
           <Grid item xs={12} sm={6}>
            <Controller name="address" control={control} render={({ field }) => (
              <TextField {...field} label="Address" fullWidth />
            )} />
          </Grid>
           <Grid item xs={12}>
            <Controller name="notes" control={control} render={({ field }) => (
              <TextField {...field} label="Notes / Remarks" fullWidth multiline rows={4} />
            )} />
          </Grid>
        </Grid>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button variant="outlined" onClick={() => navigate('/referrers')}>Cancel</Button>
          <LoadingButton type="submit" variant="contained" loading={loading}>
            Save Referrer
          </LoadingButton>
        </Box>
      </form>
    </Paper>
  );
};
export default ReferrerFormPage;