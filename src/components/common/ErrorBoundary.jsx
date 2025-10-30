import React from 'react';
import { Box, Typography, Paper, Button, Grid } from '@mui/material';
import ErrorIcon from '@mui/icons-material/ErrorOutline';
import { logSystemEvent } from '../../services/auditService';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    try {
      logSystemEvent('ERROR', 'Uncaught React render error', {
        message: error.toString(),
        componentStack: errorInfo.componentStack,
      });
    } catch (logError) {
      console.error('Failed to log error to audit service:', logError);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 4, m: 'auto', maxWidth: 700, mt: '10vh', height: '100vh' }}>
            <Paper sx={{ p: 4, textAlign: 'center' }}>
                <ErrorIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h4" gutterBottom>
                    Application Error
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                    A critical error has occurred, and our team has been automatically notified.
                    Please use the options below to recover.
                </Typography>
                <Grid container spacing={2} justifyContent="center">
                    <Grid item>
                        <Button variant="contained" onClick={() => window.location.reload()}>
                            Reload Page
                        </Button>
                    </Grid>
                     <Grid item>
                        <Button variant="outlined" onClick={() => window.history.back()}>
                            Go to Previous Page
                        </Button>
                    </Grid>
                </Grid>
                 {process.env.NODE_ENV === 'development' && (
                    <Box sx={{ mt: 3, textAlign: 'left', backgroundColor: '#fbe9e7', p: 2, borderRadius: 1, maxHeight: 200, overflow: 'auto', fontFamily: 'monospace', fontSize: '12px' }}>
                        <strong>Error Details:</strong> {this.state.error?.message}
                    </Box>
                )}
            </Paper>
        </Box>
      );
    }
    return this.props.children; 
  }
}

export default ErrorBoundary;