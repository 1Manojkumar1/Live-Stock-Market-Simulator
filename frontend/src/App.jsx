import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/layout/Layout';

// Import Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Market from './pages/Market';
import Leaderboard from './pages/Leaderboard';
import Admin from './pages/Admin';

function App() {
    return (
        <AuthProvider>
            <SocketProvider>
                <Router>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* Private Routes (Trader & Admin) */}
                        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/market" element={<Market />} />
                            <Route path="/leaderboard" element={<Leaderboard />} />
                            
                            {/* Admin Only Route */}
                            <Route path="/admin" element={<ProtectedRoute role="ADMIN"><Admin /></ProtectedRoute>} />
                        </Route>
                    </Routes>
                </Router>
            </SocketProvider>
        </AuthProvider>
    );
}

export default App;
