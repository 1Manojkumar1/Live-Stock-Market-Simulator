import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    return (
        <aside className="sidebar">
            {/* 
                DESCRIPTION: 
                Left navigation menu with links to:
                - Dashboard (Portfolio/Wallet)
                - Market (Browse Stocks)
                - Watchlist
                - Leaderboard
                - Admin Panel (Visible only to Admin users)
            */}
            <p>Component: Sidebar with links to Dashboard, Market, Watchlist, Leaderboard, and Admin.</p>
        </aside>
    );
};

export default Sidebar;
