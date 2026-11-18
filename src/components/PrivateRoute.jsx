import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../services/authService';

// Protège les routes privées : redirige vers /login si aucun token JWT valide n'est présent
export default function PrivateRoute({ children }) {
  const isAuthenticated = authService.isLoggedIn();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
