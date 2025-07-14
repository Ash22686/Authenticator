import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('userToken');

  if (!token) {
    // If no token is found, redirect to the login page
    return <Navigate to="/" replace />;
  }

  // If a token exists, render the child component (e.g., Dashboard)
  return children;
};

export default ProtectedRoute;