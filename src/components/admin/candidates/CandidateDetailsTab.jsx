import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Grid, TextField, Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useAppDispatch } from '../../../app/hooks';
import { setNotification } from '../../../features/ui/uiSlice';
import { supabase } from '../../../api/supabaseClient';

const schema = yup.object().shape({
  given_name: yup.string().required('Given name is required'),
  family_name: yup.string(),
  passport_no: yup.string().required('Passport number is required'),
  national_id: yup.string(),
  mobile_number: yup.string(),
  email: yup.string().email('Enter a valid email'),
  destination_country: yup.string(),
});

const CandidateDetailsTab = ({ candidate, onUpdate }) => {
    const dispatch = useAppDispatch();
    const [loading, setLoading] = React.useState(false);

    const { control, handleSubmit, reset, formState: { errors, isDirty } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: candidate || {},
    });

    useEffect(() => {
        reset(candidate);
    }, [candidate, reset]);

    const onSubmit = async (formData) => {
        setLoading(true);
        const { error } = await supabase
            .from('candidates')
            .update(formData)
            .eq('id', candidate.id);

        if (error) {
            dispatch(setNotification({ message: `Error updating details: ${error.message}`, severity: 'error' }));
        } else {
            dispatch(setNotification({ message: 'Candidate details updated successfully!', severity: 'success' }));
            onUpdate(); // Callback to refresh the parent component's state
        }
        setLoading(false);
    };

    return (
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
                    <Controller name="national_id" control={control} render={({ field }) => (
                        <TextField {...field} label="National ID" fullWidth />
                    )} />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Controller name="mobile_number" control={control} render={({ field }) => (
                        <TextField {...field} label="Mobile Number" fullWidth />
                    )} />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Controller name="email" control={control} render={({ field }) => (
                        <TextField {...field} label="Email Address" fullWidth error={!!errors.email} helperText={errors.email?.message} />
                    )} />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Controller name="destination_country" control={control} render={({ field }) => (
                        <TextField {...field} label="Preferred Destination" fullWidth />
                    )} />
                </Grid>
            </Grid>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <LoadingButton type="submit" variant="contained" loading={loading} disabled={!isDirty}>
                    Save Changes
                </LoadingButton>
            </Box>
        </form>
    );
};

export default CandidateDetailsTab;