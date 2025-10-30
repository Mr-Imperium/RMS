import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectNotification, clearNotification } from '../../features/ui/uiSlice';

const Notification = () => {
  const dispatch = useAppDispatch();
  const notification = useAppSelector(selectNotification);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(clearNotification());
  };

  return (
    <Snackbar
      open={Boolean(notification)}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      {notification && (
        <Alert onClose={handleClose} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      )}
    </Snackbar>
  );
};

export default Notification;