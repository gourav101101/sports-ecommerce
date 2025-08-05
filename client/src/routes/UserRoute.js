import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const UserRoute = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>; // Wait for authentication check
    }

    // If the user is authenticated, show the content. Otherwise, redirect to login.
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default UserRoute;