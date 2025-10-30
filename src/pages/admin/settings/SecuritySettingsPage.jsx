import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Paper, Grid, TextField, Box, Typography, FormControlLabel, Switch } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectAllSettings, updateSettings } from '../../../features/settings/settingsSlice';

const SecuritySettingsPage = () => {
    const dispatch = useAppDispatch();
    const settings = useAppSelector(selectAllSettings);
    const [loading, setLoading] = React.useState(false);

    const { control, handleSubmit, reset } = useForm({
        defaultValues: {
            password_policy_min_length: 8,
            password_policy_requires_uppercase: true,
            password_policy_requires_number: true,
            session_timeout_minutes: 60,
        }
    });

    useEffect(() => {
        if (settings) {
            reset({
                password_policy_min_length: settings.password_policy_min_length || 8,
                password_policy_requires_uppercase: settings.password_policy_requires_uppercase || false,
                password_policy_requires_number: settings.password_policy_requires_number || false,
                session_timeout_minutes: settings.session_timeout_minutes || 60,
            });
        }
    }, [settings, reset]);

    const onSubmit = async (formData) => {
        setLoading(true);
        const settingsToUpdate = Object.entries(formData).map(([key, value]) => ({ key, value }));
        await dispatch(updateSettings(settingsToUpdate));
        setLoading(false);
    };

    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h5" component="h1" sx={{ mb: 3 }}>Security Settings</Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Typography variant="h6" gutterBottom>Password Policy</Typography>
                <Grid container spacing={3} sx={{mb: 3}}>
                    <Grid item xs={12} sm={4}>
                        <Controller name="password_policy_min_length" control={control} render={({ field }) => (
                            <TextField {...field} label="Minimum Length" fullWidth type="number" />
                        )} />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                         <Controller name="password_policy_requires_uppercase" control={control} render={({ field }) => (
                            <FormControlLabel control={<Switch checked={field.value} {...field} />} label="Require Uppercase" />
                        )} />
                    </Grid>
                     <Grid item xs={12} sm={4}>
                         <Controller name="password_policy_requires_number" control={control} render={({ field }) => (
                            <FormControlLabel control={<Switch checked={field.value} {...field} />} label="Require Number" />
                        )} />
                    </Grid>
                </Grid>
                 <Typography variant="h6" gutterBottom>Session Management</Typography>
                 <Grid container spacing={3}>
                     <Grid item xs={12} sm={6}>
                        <Controller name="session_timeout_minutes" control={control} render={({ field }) => (
                            <TextField {...field} label="Session Timeout (minutes)" fullWidth type="number" helperText="User will be logged out after this period of inactivity."/>
                        )} />
                    </Grid>
                 </Grid>
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <LoadingButton type="submit" variant="contained" loading={loading}>Save Security Settings</LoadingButton>
                </Box>
            </form>
        </Paper>
    );
};

export default SecuritySettingsPage;