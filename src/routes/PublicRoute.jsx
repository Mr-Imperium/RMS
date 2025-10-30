import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { selectIsAuthenticated } from '../features/auth/authSlice';

/**
 * A component that handles public-only routes, like the login page.
 * If the user is already logged in, it redirects them away from the login page.
 * @param {object} props
 *- @param {React.ReactNode} props.children - The component to render if not authenticated.
 */
const PublicRoute = ({ children }) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  if (isAuthenticated) {
    // Redirect logged-in users to the dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;