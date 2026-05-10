import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import Loader from './Loader';

const ProtectedRoute = ({ role, children }) => {
    const { user, loading } = useContext(AuthContext);

    // Show loader while checking auth state
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <Loader />
            </div>
        );
    }

    // Not logged in → redirect to login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Role-based protection
    if (role && user.role !== role) {
        return <Navigate to="/" replace />;
    }

    return children ? children : <Outlet />;
};

export default ProtectedRoute;