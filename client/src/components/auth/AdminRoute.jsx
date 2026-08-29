import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from '../common/Loader';

const AdminRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cyber-dark">
        <Loader size="large" />
      </div>
    );
  }

  // If user is not logged in or is not an admin, redirect to homepage/landing
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Render admin pages
  return <Outlet />;
};

export default AdminRoute;
