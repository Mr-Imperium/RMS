import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Paper, Grid, TextField, Button, Box, Typography, MenuItem } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { addClient, updateClient, selectClientsStatus } from '../../../features/clients/clientsSlice';
import { supabase } from '../../../api/supabaseClient';

const schema = yup.object().shape({
  company_name: yup.string().required('Company name is required'),
  lt_number: yup.number().typeError('LT# must be a number').nullable(),
  focal_person_name: yup.string(),
  email: yup.string().email('Enter a valid email'),
  phone: yup.string(),
  address: yup.string(),
  country: yup.string(),
  visibility: yup.string().oneOf(['Public', 'Private']).required(),
});

const CompanyFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectClientsStatus);
  const isEditMode = Boolean(id);

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      company_name: '',
      lt_number: '',
      focal_person_name: '',
      email: '',
      phone: '',
      address: '',
      country: '',
      visibility: 'Private',
    },
  });

  useEffect(() => {
    if (isEditMode) {
      const fetchClient = async () => {
        const { data } = await supabase.from('clients').select('*').eq('id', id).single();
        if (data) {
          reset(data);
        }
      };
      fetchClient();
    }
  }, [id, isEditMode, reset]);

  const onSubmit = (formData) => {
    if (isEditMode) {
      dispatch(updateClient({ id, ...formData })).unwrap().then(() => navigate('/clients'));
    } else {
      dispatch(addClient(formData)).unwrap().then(() => navigate('/clients'));
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" component="h1" sx={{ mb: 3 }}>
        {isEditMode ? 'Edit Company' : 'Add New Company'}
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Controller name="company_name" control={control} render={({ field }) => (
              <TextField {...field} label="Company Name" fullWidth required error={!!errors.company_name} helperText={errors.company_name?.message} />
            )} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller name="lt_number" control={control} render={({ field }) => (
              <TextField {...field} label="LT Number" fullWidth type="number" error={!!errors.lt_number} helperText={errors.lt_number?.message} />
            )} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller name="focal_person_name" control={control} render={({ field }) => (
              <TextField {...field} label="Contact Person" fullWidth />
            )} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller name="email" control={control} render={({ field }) => (
              <TextField {...field} label="Email Address" fullWidth error={!!errors.email} helperText={errors.email?.message} />
            )} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller name="phone" control={control} render={({ field }) => (
              <TextField {...field} label="Phone Number" fullWidth />
            )} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller name="country" control={control} render={({ field }) => (
              <TextField {...field} label="Country" fullWidth />
            )} />
          </Grid>
          <Grid item xs={12}>
            <Controller name="address" control={control} render={({ field }) => (
              <TextField {...field} label="Address" fullWidth multiline rows={3} />
            )} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller name="visibility" control={control} render={({ field }) => (
              <TextField {...field} label="Visibility" select fullWidth required>
                <MenuItem value="Public">Public</MenuItem>
                <MenuItem value="Private">Private</MenuItem>
              </TextField>
            )} />
          </Grid>
        </Grid>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button variant="outlined" onClick={() => navigate('/clients')}>Cancel</Button>
          <LoadingButton type="submit" variant="contained" loading={status === 'loading'}>
            {isEditMode ? 'Save Changes' : 'Create Company'}
          </LoadingButton>
        </Box>
      </form>
    </Paper>
  );
};

export default CompanyFormPage;