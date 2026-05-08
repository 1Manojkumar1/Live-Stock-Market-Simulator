import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';
import WalletCard from '../components/dashboard/WalletCard';
import Portfolio from '../components/dashboard/Portfolio';
import RecentTrades from '../components/dashboard/RecentTrades';
import { TrendingUp, TrendingDown, Briefcase, Wallet } from 'lucide-react';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [summary, setSummary] = useState(null);
    const userId = user?.id || user?._id;

    useEffect(() => {
        const fetchDashboard = async () => {
            if (!userId) return;
            try {
                const res = await api.get(`/user-api/dashboard/${userId}`);
                setSummary(res.data.dashboard);
            } catch (err) {
                console.error("Failed to fetch dashboard", err);
            }
        };
        fetchDashboard();
    }, [userId]);

    const portfolio = summary?.portfolio;

    return (
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
            <header className="mb-10">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">TRADER DASHBOARD</h1>
                <p className="text-gray-500 font-medium">Welcome back, {user?.name || 'Trader'}. Here's your market summary.</p>
            </header>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                <div className="lg:col-span-1">
                    <WalletCard />
                </div>
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm h-full flex flex-col justify-center">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Portfolio Value</p>
                                <p className="text-2xl font-black text-gray-900">
                                    {portfolio ? `₹${portfolio.totalCurrentValue.toLocaleString('en-IN')}` : '—'}
                                </p>
                                {portfolio && (
                                    <div className={`flex items-center gap-1 mt-1 text-xs font-black ${portfolio.totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                        {portfolio.totalProfitLoss >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                        {portfolio.totalProfitLoss >= 0 ? '+' : ''}{portfolio.totalProfitLossPercent}%
                                    </div>
                                )}
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Active Positions</p>
                                <p className="text-2xl font-black text-gray-900">{portfolio?.totalStocksOwned ?? '—'}</p>
                            </div>
                            <div className="hidden md:block">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Invested</p>
                                <p className="text-2xl font-black text-gray-900">
                                    {portfolio ? `₹${portfolio.totalInvested.toLocaleString('en-IN')}` : '—'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <Portfolio userId={userId} />
                <RecentTrades userId={userId} />
            </div>
        </div>
    );
};

export default Dashboard;
