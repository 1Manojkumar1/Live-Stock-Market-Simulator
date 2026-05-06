import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const ProtectedRoute = ({ role, children }) => {
    const { user, loading } = useContext(AuthContext);

    // DESCRIPTION: 
    // Security guard for routes.
    // 1. If loading, show a spinner.
    // 2. If no user, redirect to /login.
    // 3. If role is specified and doesn't match, redirect to unauthorized.

    return children ? children : <Outlet />;
};

export default ProtectedRoute;
