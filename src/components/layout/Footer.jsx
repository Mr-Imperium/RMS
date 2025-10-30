import React from 'react';
import { Box, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        px: 2,
        mt: 'auto',
        backgroundColor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
        textAlign: 'center',
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {'© '}
        {new Date().getFullYear()}{' '}
        <Link color="inherit" href="#">
          Overseas Employment Pvt. Ltd.
        </Link>
        {' All rights reserved.'}
      </Typography>
    </Box>
  );
};

export default Footer;