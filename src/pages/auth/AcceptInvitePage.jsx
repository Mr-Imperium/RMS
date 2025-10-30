import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextField, Box, Alert, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/layout/AuthLayout';
import { supabase } from '../../api/supabaseClient';

const schema = yup.object().shape({
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
});

const AcceptInvitePage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    const { error: updateError } = await supabase.auth.updateUser({ password: data.password });

    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 3000);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <AuthLayout title="Account Activated!">
        <Alert severity="success">
          Your account has been successfully set up. You will be redirected to the dashboard.
        </Alert>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Set Your Password">
      <Typography variant="body2" sx={{ mb: 2 }}>
        Welcome! Please set a password to activate your account.
      </Typography>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <TextField
          margin="normal" required fullWidth name="password" label="Password"
          type="password" id="password" {...register('password')}
          error={!!errors.password} helperText={errors.password?.message}
        />
        <LoadingButton type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} loading={loading}>
          Activate Account
        </LoadingButton>
      </Box>
    </AuthLayout>
  );
};
export default AcceptInvitePage;