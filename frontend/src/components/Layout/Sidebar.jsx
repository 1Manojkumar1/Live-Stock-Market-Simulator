import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, Eye, Award, ShieldAlert, UserCog } from 'lucide-react';
import { AuthContext } from '../../contexts/AuthContext';

const Sidebar = () => {
    const { user } = useContext(AuthContext);
    const isAdmin = user?.role === 'ADMIN';

    const traderLinks = [
        { path: '/', name: 'Overview', icon: <LayoutDashboard size={20} /> },
        { path: '/market', name: 'Live Market', icon: <TrendingUp size={20} /> },
        { path: '/watchlist', name: 'Watchlist', icon: <Eye size={20} /> },
        { path: '/leaderboard', name: 'Leaderboard', icon: <Award size={20} /> },
    ];

    const adminLinks = [
        { path: '/admin', name: 'Control Panel', icon: <ShieldAlert size={20} /> },
        { path: '/leaderboard', name: 'Rankings', icon: <Award size={20} /> },
    ];

    const navLinks = isAdmin ? adminLinks : traderLinks;

    return (
        <aside className="w-16 lg:w-72 bg-white border-r border-gray-100 shrink-0 flex flex-col h-screen sticky top-0">
            <div className="p-4 lg:p-6 flex-1 overflow-y-auto">
                <div className="mb-10 px-2 hidden lg:block">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">
                        {isAdmin ? 'Administration' : 'Trading Desk'}
                    </p>
                </div>

                <ul className="space-y-1.5">
                    {navLinks.map((link) => (
                        <li key={link.path}>
                            <NavLink
                                to={link.path}
                                end={link.path === '/'}
                                className={({ isActive }) =>
                                    `flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all duration-300 group ${
                                        isActive
                                            ? 'bg-black text-white shadow-xl shadow-black/10 translate-x-1'
                                            : 'text-gray-400 hover:bg-gray-50 hover:text-black'
                                    }`
                                }
                                title={link.name}
                            >
                                <div className="transition-transform group-hover:scale-110">
                                    {link.icon}
                                </div>
                                <span className="hidden lg:block text-sm tracking-tight">{link.name}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>

                {isAdmin && (
                    <div className="mt-10 lg:mt-12 px-4 py-6 bg-blue-50 rounded-3xl border border-blue-100 hidden lg:block">
                        <div className="flex items-center gap-2 text-blue-600 mb-2">
                            <UserCog size={18} />
                            <span className="font-black text-xs uppercase tracking-wider">Admin Status</span>
                        </div>
                        <p className="text-[10px] text-blue-400 font-bold leading-relaxed">
                            Full system access granted. Monitor all trades and user activity.
                        </p>
                    </div>
                )}
            </div>
            
            <div className="p-6 border-t border-gray-50 hidden lg:block">
                <div className="bg-gray-50 p-4 rounded-2xl flex items-center gap-3">
                    <div className="w-8 h-8 bg-black rounded-xl flex items-center justify-center text-white font-black text-xs">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="truncate">
                        <p className="text-xs font-black text-gray-900 truncate">{user?.name}</p>
                        <p className="text-[10px] font-bold text-gray-400 truncate">{user?.role}</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;