import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { LogOut, User } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        if(logout) logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-30 px-4 py-3 flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black text-white flex items-center justify-center rounded-lg font-bold text-xl">
                    C
                </div>
                <Link to="/" className="text-xl font-bold text-gray-900 tracking-tight hidden sm:block">
                    Cruzz
                </Link>
            </div>

            <div className="flex items-center gap-4 md:gap-6">
                {user?.role === 'TRADER' && (
                    <>
                        <div className="hidden sm:flex items-center gap-3">
                            <div className="flex flex-col items-end">
                                <span className="text-sm font-semibold text-gray-900">{user?.name}</span>
                                <span className="text-xs text-gray-500 font-medium">₹{user?.balance?.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 border border-gray-200">
                                <User size={20} />
                            </div>
                        </div>
                        <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>
                    </>
                )}

                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black transition-colors bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-lg border border-gray-200"
                >
                    <LogOut size={16} />
                    <span className="hidden sm:inline">Logout</span>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;