import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AppRouter from './routes/AppRouter';
import { theme } from './theme/theme';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { checkUserSession, selectAuthStatus } from './features/auth/authSlice';
import { fetchAllSettings } from './features/settings/settingsSlice';
import { HelmetProvider } from 'react-helmet-async';
import ErrorBoundary from './components/common/ErrorBoundary';
import Notification from './components/common/Notification';
import LoadingSpinner from './components/common/LoadingSpinner';
import NetworkStatusBanner from './components/common/NetworkStatusBanner';

function App() {
  const dispatch = useAppDispatch();
  const authStatus = useAppSelector(selectAuthStatus);

  useEffect(() => {
    dispatch(checkUserSession());
    dispatch(fetchAllSettings());
  }, [dispatch]);

  if (authStatus === 'loading') {
    return <LoadingSpinner fullPage />;
  }

  return (
    // ErrorBoundary must be the outermost component to catch all render errors
    <ErrorBoundary>
      <HelmetProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <NetworkStatusBanner />
          <BrowserRouter>
            <AppRouter />
          </BrowserRouter>
          <Notification />
        </ThemeProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;