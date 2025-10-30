import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Paper, Grid, TextField, Button, Box, Typography, MenuItem, Autocomplete, CircularProgress } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { addJob, updateJob, selectJobsStatus } from '../../../features/jobs/jobsSlice';
import { supabase } from '../../../api/supabaseClient';

const schema = yup.object().shape({
  job_title: yup.string().required('Job title is required'),
  client_id: yup.string().required('A client company must be selected'),
  category_id: yup.string().nullable(),
  positions_required: yup.number().typeError('Must be a number').min(1, 'At least one position is required').required(),
  description: yup.string().nullable(),
});

const JobFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectJobsStatus);
  const isEditMode = Boolean(id);

  const [clients, setClients] = useState([]);
  const [categories, setCategories] = useState([]);
  const [clientSearchText, setClientSearchText] = useState('');

  const { control, handleSubmit, reset, setValue, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      job_title: '',
      client_id: '',
      category_id: '',
      positions_required: 1,
      description: '',
    },
  });

  // Fetch clients for autocomplete
  useEffect(() => {
    const fetchClients = async () => {
      const { data } = await supabase.from('clients').select('id, company_name').ilike('company_name', `%${clientSearchText}%`).limit(10);
      setClients(data || []);
    };
    fetchClients();
  }, [clientSearchText]);

  // Fetch job categories
  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from('job_categories').select('*');
      setCategories(data || []);
    };
    fetchCategories();
  }, []);

  // Fetch job data in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchJob = async () => {
        const { data } = await supabase.from('jobs').select('*, clients(id, company_name)').eq('id', id).single();
        if (data) {
          reset({
            ...data,
            client_id: data.clients.id, // Set client_id for the form
          });
          // Set the initial value for the autocomplete component
          if (data.clients) {
            setClients([data.clients]);
          }
        }
      };
      fetchJob();
    }
  }, [id, isEditMode, reset]);
  
  const selectedClient = watch('client_id');

  const onSubmit = (formData) => {
    if (isEditMode) {
      dispatch(updateJob({ id, ...formData })).unwrap().then(() => navigate('/job-titles'));
    } else {
      dispatch(addJob(formData)).unwrap().then(() => navigate('/job-titles'));
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" component="h1" sx={{ mb: 3 }}>
        {isEditMode ? 'Edit Job' : 'Create New Job'}
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={8}>
            <Controller name="job_title" control={control} render={({ field }) => (
              <TextField {...field} label="Job Title" fullWidth required error={!!errors.job_title} helperText={errors.job_title?.message} />
            )} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Controller name="positions_required" control={control} render={({ field }) => (
              <TextField {...field} label="Positions Required" fullWidth required type="number" error={!!errors.positions_required} helperText={errors.positions_required?.message} />
            )} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="client_id"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  options={clients}
                  getOptionLabel={(option) => option.company_name || ''}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  value={clients.find(c => c.id === field.value) || null}
                  onChange={(_, newValue) => field.onChange(newValue ? newValue.id : '')}
                  onInputChange={(_, newInputValue) => setClientSearchText(newInputValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Client Company"
                      required
                      error={!!errors.client_id}
                      helperText={errors.client_id?.message}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {status === 'loading' ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
             <Controller name="category_id" control={control} render={({ field }) => (
              <TextField {...field} label="Job Category" select fullWidth>
                <MenuItem value=""><em>None</em></MenuItem>
                {categories.map(cat => <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>)}
              </TextField>
            )} />
          </Grid>
          <Grid item xs={12}>
            <Typography sx={{ mb: 1, color: 'text.secondary' }}>Job Description</Typography>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <ReactQuill theme="snow" value={field.value} onChange={field.onChange} />
              )}
            />
          </Grid>
        </Grid>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button variant="outlined" onClick={() => navigate('/job-titles')}>Cancel</Button>
          <LoadingButton type="submit" variant="contained" loading={status === 'loading'}>
            {isEditMode ? 'Save Changes' : 'Create Job'}
          </LoadingButton>
        </Box>
      </form>
    </Paper>
  );
};

export default JobFormPage;