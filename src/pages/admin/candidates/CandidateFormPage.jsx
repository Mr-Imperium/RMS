import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Paper, Grid, TextField, Button, Box, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { addCandidate, selectCandidatesStatus } from '../../../features/candidates/candidatesSlice';

const schema = yup.object().shape({
  given_name: yup.string().required('Given name is required'),
  family_name: yup.string(),
  passport_no: yup.string().required('Passport number is required'),
  national_id: yup.string(),
  mobile_number: yup.string(),
  email: yup.string().email('Enter a valid email'),
  destination_country: yup.string(),
});

const CandidateFormPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectCandidatesStatus);

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { given_name: '', family_name: '', passport_no: '', mobile_number: '' },
  });

  const onSubmit = (formData) => {
    dispatch(addCandidate(formData)).unwrap().then((newCandidate) => {
      // Redirect to the new candidate's profile page
      navigate(`/candidates/${newCandidate.id}`);
    });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" component="h1" sx={{ mb: 3 }}>
        Add New Candidate
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Controller name="given_name" control={control} render={({ field }) => (
              <TextField {...field} label="Given Name" fullWidth required error={!!errors.given_name} helperText={errors.given_name?.message} />
            )} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller name="family_name" control={control} render={({ field }) => (
              <TextField {...field} label="Family Name" fullWidth />
            )} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller name="passport_no" control={control} render={({ field }) => (
              <TextField {...field} label="Passport Number" fullWidth required error={!!errors.passport_no} helperText={errors.passport_no?.message} />
            )} />
          </Grid>
           <Grid item xs={12} sm={6}>
            <Controller name="mobile_number" control={control} render={({ field }) => (
              <TextField {...field} label="Mobile Number" fullWidth />
            )} />
          </Grid>
        </Grid>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button variant="outlined" onClick={() => navigate('/candidates')}>Cancel</Button>
          <LoadingButton type="submit" variant="contained" loading={status === 'loading'}>
            Create Candidate
          </LoadingButton>
        </Box>
      </form>
    </Paper>
  );
};
export default CandidateFormPage;