import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';
import WalletCard from '../components/dashboard/WalletCard';
import RecentTrades from '../components/dashboard/RecentTrades';
import { TrendingUp, TrendingDown, Briefcase, Wallet, PieChart } from 'lucide-react';
import { Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

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
    
    // Prepare data for Portfolio Allocation Chart
    const allocationData = {
        labels: portfolio?.holdings?.map(h => h.symbol) || [],
        datasets: [{
            data: portfolio?.holdings?.map(h => h.currentValue) || [],
            backgroundColor: [
                '#18181b', // Zinc-900
                '#3f3f46', // Zinc-700
                '#71717a', // Zinc-500
                '#a1a1aa', // Zinc-400
                '#d4d4d8', // Zinc-300
                '#e4e4e7', // Zinc-200
            ],
            borderWidth: 0,
            hoverOffset: 10
        }]
    };

    const chartOptions = {
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: '#18181b',
                titleFont: { size: 10, weight: 'bold' },
                bodyFont: { size: 10 },
                padding: 10,
                displayColors: false,
                callbacks: {
                    label: (context) => ` ₹${context.raw.toLocaleString('en-IN')}`
                }
            }
        },
        cutout: '75%',
        responsive: true,
        maintainAspectRatio: false
    };

    return (
        <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-8">
            <header>
                <h1 className="text-2xl font-bold text-zinc-900 tracking-tight uppercase">Dashboard</h1>
                <p className="text-sm text-zinc-500 font-medium mt-1">Welcome back, {user?.name || 'Trader'}. Here's your market summary.</p>
            </header>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <WalletCard />
                </div>
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl p-6 border border-zinc-200 h-full flex flex-col justify-center">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="col-span-2 grid grid-cols-2 gap-6">
                                <div>
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Portfolio Value</p>
                                    <p className="text-2xl font-bold text-zinc-900">
                                        {portfolio ? `₹${portfolio.totalCurrentValue.toLocaleString('en-IN')}` : '—'}
                                    </p>
                                    {portfolio && (
                                        <div className={`flex items-center gap-1 mt-1.5 text-[10px] font-bold ${portfolio.totalProfitLoss >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                                            {portfolio.totalProfitLoss >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                            {portfolio.totalProfitLoss >= 0 ? '+' : ''}{portfolio.totalProfitLossPercent}%
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Active Assets</p>
                                    <p className="text-2xl font-bold text-zinc-900">{portfolio?.totalStocksOwned ?? '—'}</p>
                                </div>
                                <div className="col-span-2 pt-4 border-t border-zinc-100">
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Total Invested</p>
                                    <p className="text-xl font-bold text-zinc-900">
                                        {portfolio ? `₹${portfolio.totalInvested.toLocaleString('en-IN')}` : '—'}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex flex-col items-center justify-center relative">
                                {portfolio?.holdings?.length > 0 ? (
                                    <>
                                        <div className="w-28 h-28">
                                            <Doughnut data={allocationData} options={chartOptions} />
                                        </div>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                            <PieChart size={14} className="text-zinc-200" />
                                        </div>
                                    </>
                                ) : (
                                    <div className="w-28 h-28 rounded-full border-2 border-dashed border-zinc-100 flex items-center justify-center text-zinc-200">
                                        <PieChart size={20} />
                                    </div>
                                )}
                                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-3">Allocation</p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <RecentTrades userId={userId} />
            </div>
        </div>
    );
};

export default Dashboard;
