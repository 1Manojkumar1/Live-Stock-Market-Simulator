import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, Eye, Award, ShieldAlert, UserCog, Briefcase, Brain, Bell } from 'lucide-react';
import { AuthContext } from '../../contexts/AuthContext';

const Sidebar = () => {
    const { user } = useContext(AuthContext);
    const isAdmin = user?.role === 'ADMIN';

    const traderLinks = [
        { path: '/', name: 'Overview', icon: <LayoutDashboard size={20} /> },
        { path: '/portfolio', name: 'Portfolio', icon: <Briefcase size={20} /> },
        { path: '/market', name: 'Live Market', icon: <TrendingUp size={20} /> },
        { path: '/watchlist', name: 'Watchlist', icon: <Eye size={20} /> },
        { path: '/leaderboard', name: 'Leaderboard', icon: <Award size={20} /> },
        { path: '/notifications', name: 'Notifications', icon: <Bell size={20} /> },
        { path: '/ai-insights', name: 'AI Insights', icon: <Brain size={20} /> },
    ];

    const adminLinks = [
        { path: '/admin', name: 'Control Panel', icon: <ShieldAlert size={20} /> },
        { path: '/leaderboard', name: 'Rankings', icon: <Award size={20} /> },
    ];

    const navLinks = isAdmin ? adminLinks : traderLinks;

    return (
        <aside className="w-16 lg:w-64 bg-white border-r border-gray-200 shrink-0 flex flex-col h-full overflow-hidden">

            <div className="p-3 lg:p-4 flex-1">

                <div className="mb-6 px-3 hidden lg:block pt-2">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 opacity-70">
                        {isAdmin ? 'Administration' : 'Trading Desk'}
                    </p>
                </div>

                <ul className="space-y-1">
                    {navLinks.map((link) => (
                        <li key={link.path}>
                            <NavLink
                                to={link.path}
                                end={link.path === '/'}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                        isActive
                                            ? 'bg-zinc-100 text-zinc-900'
                                            : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'
                                    }`
                                }
                                title={link.name}
                            >
                                <div className="shrink-0">
                                    {link.icon}
                                </div>
                                <span className="hidden lg:block">{link.name}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>
            
            <div className="p-4 border-t border-gray-100 hidden lg:block">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-8 h-8 bg-zinc-900 rounded flex items-center justify-center text-white font-bold text-xs">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="truncate">
                        <p className="text-xs font-semibold text-zinc-900 truncate">{user?.name}</p>
                        <p className="text-[10px] text-zinc-500 truncate uppercase tracking-tighter">{user?.role}</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;