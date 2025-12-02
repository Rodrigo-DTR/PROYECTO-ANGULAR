import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '/src/context/AuthContext.jsx';

export default function ProtectedRoute({ children, requiredRole }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.rol !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}
