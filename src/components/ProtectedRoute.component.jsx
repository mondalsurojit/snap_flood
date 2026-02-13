import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function ProtectedRoute({ children }) {
    const { currentUser } = useAuth();

    // If not logged in, redirect to home
    if (!currentUser) {
        return <Navigate to="/" replace />;
    }

    // If logged in, show the page
    return children;
}

export default ProtectedRoute;