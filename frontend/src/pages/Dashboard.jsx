import React from 'react';
import WalletCard from '../components/dashboard/WalletCard';
import Portfolio from '../components/dashboard/Portfolio';
import RecentTrades from '../components/dashboard/RecentTrades';

const Dashboard = () => {
    return (
        <div className="page-container">
            <h1>TRADER DASHBOARD</h1>
            {/* 
                DESCRIPTION: 
                High-level overview of the user's account.
                Imports and renders the WalletCard, Portfolio, and RecentTrades components.
            */}
            <WalletCard />
            <Portfolio />
            <RecentTrades />
        </div>
    );
};

export default Dashboard;
