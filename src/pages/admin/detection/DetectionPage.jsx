import React, { useState } from 'react';
import { Box, Paper, TextField, Typography, Alert, CircularProgress } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import SearchIcon from '@mui/icons-material/Search';
import { useForm, Controller } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { detectCandidate, selectDetectionResult, selectDetectionStatus, selectDetectionError } from '../../../features/detection/detectionSlice';
import DetectionResultCard from '../../../components/admin/detection/DetectionResultCard';
import PageHeader from '../../../components/common/PageHeader';

const DetectionPage = () => {
  const dispatch = useAppDispatch();
  const result = useAppSelector(selectDetectionResult);
  const status = useAppSelector(selectDetectionStatus);
  const error = useAppSelector(selectDetectionError);

  const { control, handleSubmit } = useForm({
    defaultValues: { nationalId: '' },
  });

  const onSubmit = ({ nationalId }) => {
    dispatch(detectCandidate(nationalId));
  };

  const isLoading = status === 'loading';

  return (
    <Box>
      <PageHeader title="Candidate Detection" />
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Search by National ID</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Enter a candidate's National ID to check for existing records, view their history, and prevent duplicate entries.
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
          <Controller
            name="nationalId"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="National ID Number"
                variant="outlined"
                fullWidth
                autoFocus
              />
            )}
          />
          <LoadingButton
            type="submit"
            variant="contained"
            size="large"
            loading={isLoading}
            startIcon={<SearchIcon />}
            sx={{ py: '15px' }}
          >
            Detect
          </LoadingButton>
        </Box>
      </Paper>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {status === 'not_found' && (
        <Alert severity="info" sx={{ mt: 3 }}>
          No candidate found with this National ID. You can proceed to add them as a new candidate.
        </Alert>
      )}
      
      {status === 'failed' && (
        <Alert severity="error" sx={{ mt: 3 }}>
          An error occurred: {error}
        </Alert>
      )}

      {status === 'succeeded' && result && (
        <>
            <Alert severity="warning" sx={{mt: 3}}>
                <strong>Duplicate Found!</strong> A candidate with this National ID already exists in the system. Review their history below.
            </Alert>
            <DetectionResultCard result={result} />
        </>
      )}
    </Box>
  );
};

export default DetectionPage;