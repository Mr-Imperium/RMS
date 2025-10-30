import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextField, Box, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import AuthLayout from '../../components/layout/AuthLayout';
import { updateUserPassword } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../api/supabaseClient';

const schema = yup.object().shape({
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required('Confirm Password is required'),
});

const ResetPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Supabase auth listener to handle the password recovery event from the URL
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'PASSWORD_RECOVERY') {
        // This event confirms the user has a valid session from the email link
      }
    });
    return () => subscription?.unsubscribe();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    const { error } = await updateUserPassword(data.password);
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <AuthLayout title="Password Reset Successful">
        <Alert severity="success">
          Your password has been updated. You will be redirected to the login page shortly.
        </Alert>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Reset Your Password">
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="New Password"
          type="password"
          id="password"
          {...register('password')}
          error={!!errors.password}
          helperText={errors.password?.message}
          disabled={loading}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="confirmPassword"
          label="Confirm New Password"
          type="password"
          id="confirmPassword"
          {...register('confirmPassword')}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
          disabled={loading}
        />
        <LoadingButton
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          loading={loading}
        >
          Update Password
        </LoadingButton>
      </Box>
    </AuthLayout>
  );
};

export default ResetPasswordPage;