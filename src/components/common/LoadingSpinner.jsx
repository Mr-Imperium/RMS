import React from 'react';
import { Box, CircularProgress, Backdrop } from '@mui/material';

/**
 * A loading indicator component.
 * @param {object} props
 * @param {boolean} [props.fullPage=false] - If true, displays as a full-page backdrop overlay.
 */
const LoadingSpinner = ({ fullPage = false }) => {
  if (fullPage) {
    return (
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
      <CircularProgress />
    </Box>
  );
};

export default LoadingSpinner;