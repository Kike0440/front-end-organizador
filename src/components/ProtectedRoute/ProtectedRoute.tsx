import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
    allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
    const userRole = localStorage.getItem('userRole');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (!isLoggedIn) {
        return <Navigate to="/" replace />;
    }

    if (userRole && allowedRoles.includes(userRole)) {
        return <Outlet />;
    } else {
        alert('Acceso denegado. No tienes permisos para ver esta página.');
        if (userRole === 'admin') {
            return <Navigate to="/admin/dashboard" replace />;
        } else if (userRole === 'employee') {
            return <Navigate to="/employee/my-locals" replace />;
        }
        return <Navigate to="/" replace />;
    }
};

export default ProtectedRoute;