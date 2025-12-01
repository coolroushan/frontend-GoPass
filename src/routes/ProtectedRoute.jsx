import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // 1. Retrieve the token from local storage
  // Ensure this key matches what you set in AdminLogin.jsx ('token')
  const token = localStorage.getItem('token');

  // 2. Check if token exists
  if (!token) {
    // If no token, redirect to the login page immediately
    // 'replace' prevents them from hitting Back to return to the protected page
    return <Navigate to="/signin" replace />;
  }

  // 3. If token exists, render the child routes (The Layout & Dashboard)
  return <Outlet />;
};

export default ProtectedRoute;