import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Paper, Grid, TextField, Box, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectAllSettings, updateSettings } from '../../../features/settings/settingsSlice';

const GeneralSettingsPage = () => {
    const dispatch = useAppDispatch();
    const settings = useAppSelector(selectAllSettings);
    const [loading, setLoading] = React.useState(false);

    const { control, handleSubmit, reset } = useForm({
        defaultValues: {
            company_name: '',
            system_timezone: '',
        }
    });

    useEffect(() => {
        // Populate form with settings from Redux store
        if (settings) {
            reset({
                company_name: settings.company_name || '',
                system_timezone: settings.system_timezone || 'UTC',
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
            <Typography variant="h5" component="h1" sx={{ mb: 3 }}>
                General Settings
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <Controller name="company_name" control={control} render={({ field }) => (
                            <TextField {...field} label="Company Name" fullWidth />
                        )} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Controller name="system_timezone" control={control} render={({ field }) => (
                            <TextField {...field} label="System Timezone" fullWidth />
                        )} />
                    </Grid>
                    {/* Add other general settings fields here */}
                </Grid>
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <LoadingButton type="submit" variant="contained" loading={loading}>
                        Save Changes
                    </LoadingButton>
                </Box>
            </form>
        </Paper>
    );
};

export default GeneralSettingsPage;