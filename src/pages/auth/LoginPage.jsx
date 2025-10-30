import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextField, Button, Box, Typography, Link as MuiLink, Alert } from '@mui/material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { loginUser, selectAuthStatus, selectAuthError } from '../../features/auth/authSlice';
import AuthLayout from '../../components/layout/AuthLayout';
import { LoadingButton } from '@mui/lab';

const schema = yup.object().shape({
  email: yup.string().email('Email must be a valid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

const LoginPage = () => {
  const dispatch = useAppAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const authStatus = useAppSelector(selectAuthStatus);
  const authError = useAppSelector(selectAuthError);
  
  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    dispatch(loginUser(data))
      .unwrap()
      .then(() => {
        navigate(from, { replace: true });
      })
      .catch(() => {
        // Error is handled by the authError selector
      });
  };

  const isLoading = authStatus === 'loading';

  return (
    <AuthLayout title="Sign In">
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        {authError && <Alert severity="error" sx={{ mb: 2 }}>{authError}</Alert>}
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
          disabled={isLoading}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          {...register('password')}
          error={!!errors.password}
          helperText={errors.password?.message}
          disabled={isLoading}
        />
        <LoadingButton
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          loading={isLoading}
        >
          Sign In
        </LoadingButton>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <MuiLink component={RouterLink} to="/forgot-password" variant="body2">
            Forgot password?
          </MuiLink>
        </Box>
      </Box>
    </AuthLayout>
  );
};

export default LoginPage;