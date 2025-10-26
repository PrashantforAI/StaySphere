import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants';
import Spinner from '../ui/Spinner';
import { UserRole } from '../../types';

interface RoleProtectedRouteProps {
  children: React.ReactElement;
  role: UserRole;
}

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ children, role }) => {
  const { currentUser, userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (userProfile?.role !== role) {
    // User is logged in but does not have the required role
    // Redirect them to their default dashboard to avoid confusion
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return children;
};

export default RoleProtectedRoute;
