import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextField, Box, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import AuthLayout from '../../components/layout/AuthLayout';
import { sendPasswordResetEmail } from '../../services/authService';

const schema = yup.object().shape({
  email: yup.string().email('Must be a valid email').required('Email is required'),
});

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setMessage('');
    setError('');
    const { error } = await sendPasswordResetEmail(data.email);
    if (error) {
      setError(error.message);
    } else {
      setMessage('If an account with this email exists, a password reset link has been sent.');
    }
    setLoading(false);
  };

  return (
    <AuthLayout title="Forgot Password">
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Enter your email address and we will send you a link to reset your password.
        </Typography>
        {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email?.message}
          disabled={loading}
        />
        <LoadingButton
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          loading={loading}
        >
          Send Reset Link
        </LoadingButton>
      </Box>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;