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
import PortfolioPage from './pages/PortfolioPage';
import Market from './pages/Market';
import Watchlist from './pages/Watchlist';
import Leaderboard from './pages/Leaderboard';
import Admin from './pages/Admin';
import Home from './pages/Home';
import Loader from './components/Loader';

const AppRoutes = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader />
            </div>
        );
    }

    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={
                    user ? (
                        user.role === 'ADMIN' ? <Navigate to="/admin" replace /> : <Navigate to="/dashboard" replace />
                    ) : <Home />
                } />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Layout Routes */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<Layout />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/portfolio" element={<PortfolioPage />} />
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

import { Toaster } from 'react-hot-toast';

function App() {
    return (
        <AuthProvider>
            <SocketProvider>
                <Toaster position="top-right" reverseOrder={false} />
                <AppRoutes />
            </SocketProvider>
        </AuthProvider>
    );
}


export default App;