import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { selectIsAuthenticated, selectCurrentUserProfile } from '../features/auth/authSlice';
import { hasPermission } from '../utils/permissions';
import LoadingSpinner from '../components/common/LoadingSpinner';

/**
 * A component that guards routes requiring authentication and a specific permission level.
 * @param {object} props
 * @param {React.ReactNode} props.children - The component to render if authorized.
 * @param {string} props.requiredRole - The minimum role required to access this route (from PERMISSIONS).
 */
const ProtectedRoute = ({ children, requiredRole }) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const userProfile = useAppSelector(selectCurrentUserProfile);
  const authStatus = useAppSelector(state => state.auth.status);
  const location = useLocation();

  // Show a loader while the session is being checked
  if (authStatus === 'loading') {
    return <LoadingSpinner fullPage />;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated but the profile hasn't loaded yet, show a loader
  if (!userProfile) {
    return <LoadingSpinner fullPage />;
  }
  
  // Check for the required role using our permission logic
  if (requiredRole && !hasPermission(userProfile.role, requiredRole)) {
    // User is logged in but doesn't have permission. Redirect to a 'not authorized' page or dashboard.
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }
  
  // If authorized, render the child component
  return children;
};

export default ProtectedRoute;