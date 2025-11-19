import React, { useState, useEffect, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { authAPI } from '../lib/api';

function ProtectedRoute({ children, requiredRole }) {
  const [isValid, setIsValid] = useState(null);
  const [userRole, setUserRole] = useState(null);

  // Memoize requiredRole to prevent unnecessary re-renders
  const memoizedRequiredRole = useMemo(() => requiredRole, [requiredRole]);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setIsValid(false);
          return;
        }

        // Verify token with backend
        const response = await authAPI.getCurrentUser();
        
        if (response.data.success) {
          const user = response.data.user;
          setUserRole(user.role);
          
          // Check if user has required role
          if (memoizedRequiredRole && user.role !== memoizedRequiredRole) {
            setIsValid(false);
          } else {
            setIsValid(true);
          }
        } else {
          setIsValid(false);
        }
      } catch (error) {
        console.error('Token verification failed:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsValid(false);
      }
    };

    verifyToken();
  }, [memoizedRequiredRole]);

  // Still verifying
  if (isValid === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Token is invalid - redirect to login
  if (!isValid) {
    return <Navigate to="/login" replace />;
  }

  // User doesn't have required role
  if (memoizedRequiredRole && userRole !== memoizedRequiredRole) {
    // Redirect to appropriate dashboard based on role
    if (userRole === 'admin') return <Navigate to="/admin" replace />;
    if (userRole === 'manager') return <Navigate to="/manager" replace />;
    return <Navigate to="/user" replace />;
  }

  // All checks passed - render children
  return children;
}

export default ProtectedRoute;
