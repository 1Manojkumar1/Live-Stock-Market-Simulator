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
        <nav className="bg-white border-b border-zinc-200 sticky top-0 z-30 px-6 py-2.5 flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-zinc-900 text-white flex items-center justify-center rounded font-bold text-lg">
                    C
                </div>
                <Link to="/" className="text-lg font-bold text-zinc-900 tracking-tight hidden sm:block">
                    Cruzz
                </Link>
            </div>

            <div className="flex items-center gap-4 md:gap-6">
                {user?.role === 'TRADER' && (
                    <>
                        <div className="hidden sm:flex items-center gap-3">
                            <div className="flex flex-col items-end">
                                <span className="text-xs font-semibold text-zinc-900">{user?.name}</span>
                                <span className="text-[10px] text-zinc-500 font-medium tracking-tight">₹{user?.balance?.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="w-8 h-8 bg-zinc-50 rounded flex items-center justify-center text-zinc-600 border border-zinc-200">
                                <User size={16} />
                            </div>
                        </div>
                        <div className="h-4 w-px bg-zinc-200 hidden sm:block"></div>
                    </>
                )}

                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-xs font-medium text-zinc-600 hover:text-zinc-900 transition-colors bg-zinc-50 hover:bg-zinc-100 px-2.5 py-1.5 rounded border border-zinc-200"
                >
                    <LogOut size={14} />
                    <span className="hidden sm:inline">Logout</span>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;