import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';

import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/layout/Layout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Market from './pages/Market';
import Watchlist from './pages/Watchlist';
import Leaderboard from './pages/Leaderboard';
import Admin from './pages/Admin';

const AppRoutes = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
        );
    }

    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
                <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />

                {/* Protected Layout Routes */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<Layout />}>
                        {/* Redirect based on role at root path */}
                        <Route path="/" element={
                            user?.role === 'ADMIN' ? <Navigate to="/admin" replace /> : <Dashboard />
                        } />
                        <Route path="/market" element={<Market />} />
                        <Route path="/watchlist" element={<Watchlist />} />
                        <Route path="/leaderboard" element={<Leaderboard />} />
                        
                        {/* Admin Routes within Layout */}
                        <Route
                            path="/admin"
                            element={
                                <ProtectedRoute role="ADMIN">
                                    <Admin />
                                </ProtectedRoute>
                            }
                        />
                    </Route>
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
};

function App() {
    return (
        <AuthProvider>
            <SocketProvider>
                <AppRoutes />
            </SocketProvider>
        </AuthProvider>
    );
}

export default App;