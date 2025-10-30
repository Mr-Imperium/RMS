import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Paper, Grid, TextField, Button, Box, Typography, MenuItem, Autocomplete, Chip } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { addProject } from '../../../features/projects/projectSlice';
import { selectAllStaff, fetchStaff } from '../../../features/staff/staffSlice';
import { supabase } from '../../../api/supabaseClient';

const schema = yup.object().shape({
  name: yup.string().required('Project name is required'),
  client_id: yup.string().required('A client company must be selected'),
  status: yup.string().required('Status is required'),
  start_date: yup.date().nullable(),
  end_date: yup.date().nullable().min(yup.ref('start_date'), "End date can't be before start date"),
  description: yup.string(),
});

const ProjectFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isEditMode = Boolean(id);
  const staffList = useAppSelector(selectAllStaff);
  const [clients, setClients] = useState([]);
  const [assignedStaff, setAssignedStaff] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchStaff());
    // Fetch clients logic...
  }, [dispatch]);

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { name: '', client_id: '', status: 'Planning', description: '' },
  });

  const onSubmit = async (formData) => {
    setLoading(true);
    const projectData = { ...formData };
    const staffIds = assignedStaff.map(s => s.id);
    await dispatch(addProject({ projectData, staffIds })).unwrap();
    setLoading(false);
    navigate('/projects');
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" component="h1" sx={{ mb: 3 }}>
          {isEditMode ? 'Edit Project' : 'Create New Project'}
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={8}>
              <Controller name="name" control={control} render={({ field }) => (
                <TextField {...field} label="Project Name" fullWidth required error={!!errors.name} helperText={errors.name?.message} />
              )} />
            </Grid>
            <Grid item xs={12} sm={4}>
               <Controller name="status" control={control} render={({ field }) => (
                <TextField {...field} label="Status" select fullWidth required>
                  {['Planning', 'In Progress', 'On Hold', 'Completed', 'Cancelled'].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                </TextField>
              )} />
            </Grid>
            <Grid item xs={12} sm={6}>
              {/* Client Autocomplete would go here, similar to JobFormPage */}
              <TextField label="Client Company (Autocomplete)" fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                multiple
                options={staffList}
                getOptionLabel={(option) => option.full_name}
                value={assignedStaff}
                onChange={(_, newValue) => setAssignedStaff(newValue)}
                renderInput={(params) => <TextField {...params} label="Assign Staff" />}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip variant="outlined" label={option.full_name} {...getTagProps({ index })} />
                  ))
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller name="start_date" control={control} render={({ field }) => (
                <DatePicker {...field} label="Start Date" renderInput={(params) => <TextField {...params} fullWidth />} />
              )} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller name="end_date" control={control} render={({ field }) => (
                <DatePicker {...field} label="End Date" renderInput={(params) => <TextField {...params} fullWidth error={!!errors.end_date} helperText={errors.end_date?.message} />} />
              )} />
            </Grid>
            <Grid item xs={12}>
              <Controller name="description" control={control} render={({ field }) => (
                <TextField {...field} label="Project Description" fullWidth multiline rows={4} />
              )} />
            </Grid>
          </Grid>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined" onClick={() => navigate('/projects')}>Cancel</Button>
            <LoadingButton type="submit" variant="contained" loading={loading}>
              {isEditMode ? 'Save Changes' : 'Create Project'}
            </LoadingButton>
          </Box>
        </form>
      </Paper>
    </LocalizationProvider>
  );
};
export default ProjectFormPage;