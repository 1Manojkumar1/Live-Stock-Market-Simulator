import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Trophy, Medal, Crown, TrendingUp, User, Calendar, Clock, Award, Percent } from 'lucide-react';

const Leaderboard = () => {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [period, setPeriod] = useState('all'); // 'all', 'weekly', 'monthly'
    const [showROIInfo, setShowROIInfo] = useState(false);

    useEffect(() => {
        fetchLeaderboard();
    }, [period]);

    const fetchLeaderboard = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/user-api/leaderboard?period=${period}`);
            setLeaders(response.data.leaderboard);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch leaderboard:', err);
            setError('Unable to load leaderboard. Please check your connection.');
            setLoading(false);
        }
    };

    const getRankIcon = (rank) => {
        switch (rank) {
            case 1: return <Crown className="text-yellow-400" size={24} />;
            case 2: return <Medal className="text-gray-400" size={24} />;
            case 3: return <Medal className="text-orange-400" size={24} />;
            default: return <span className="font-black text-gray-400 w-6 text-center">{rank}</span>;
        }
    };

    const getPeriodLabel = () => {
        if (period === 'weekly') return "Weekly Return";
        if (period === 'monthly') return "Monthly Return";
        return "Total Return";
    };

    return (
        <div className="p-4 lg:p-6 max-w-4xl mx-auto space-y-8">
            <header className="text-center">
                <div className="inline-flex p-2.5 bg-zinc-900 text-white rounded-lg mb-3">
                    <Trophy size={20} />
                </div>
                <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Trading Champions</h1>
                <p className="text-sm text-zinc-500 font-medium mt-1">Ranked by Percentage ROI (Return on Investment)</p>
            </header>

            {/* TAB NAVIGATION */}
            <div className="flex justify-center">
                <div className="bg-zinc-100/50 p-1 rounded-lg flex items-center gap-1">
                    {[
                        { id: 'weekly', name: 'Weekly', icon: <Clock size={12} /> },
                        { id: 'monthly', name: 'Monthly', icon: <Calendar size={12} /> },
                        { id: 'all', name: 'All Time', icon: <Award size={12} /> }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setPeriod(tab.id)}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${
                                period === tab.id 
                                ? 'bg-white text-zinc-900 shadow-sm' 
                                : 'text-zinc-500 hover:text-zinc-700'
                            }`}
                        >
                            {tab.icon}
                            {tab.name}
                        </button>
                    ))}
                </div>
            </div>
            
            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
                </div>
            ) : error ? (
                <div className="bg-red-50 text-red-600 p-6 rounded-3xl text-center shadow-sm border border-red-100">
                    {error}
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-zinc-50/50 border-b border-zinc-200">
                                    <th className="py-3.5 px-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest w-20">Rank</th>
                                    <th className="py-3.5 px-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Trader</th>
                                    <th className="py-3.5 px-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{getPeriodLabel()}</th>
                                    <th className="py-3.5 px-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">Profit Amount</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-zinc-100">
                                {leaders.length > 0 ? (
                                    leaders.map((trader) => (
                                        <tr
                                            key={trader.userId}
                                            className="group hover:bg-zinc-50/50 transition-colors"
                                        >
                                            <td className="py-4 px-6 text-center font-bold text-zinc-400 text-sm">
                                                {trader.rank <= 3 ? getRankIcon(trader.rank) : trader.rank}
                                            </td>

                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-zinc-50 rounded flex items-center justify-center text-zinc-400 border border-zinc-200 group-hover:bg-zinc-900 group-hover:text-white group-hover:border-zinc-900 transition-colors duration-200">
                                                        <User size={16} />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-zinc-900 leading-tight text-sm">{trader.name}</p>
                                                        <p className="text-[10px] text-zinc-500 mt-0.5">{trader.email}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="py-4 px-6">
                                                <div className={`flex items-center gap-1 font-bold text-lg ${trader.roi >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                                    {trader.roi >= 0 ? '+' : ''}
                                                    {trader.roi}%
                                                </div>
                                                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-tight">
                                                    Performance ROI
                                                </p>
                                            </td>

                                            <td className="py-4 px-6 text-right">
                                                <div className={`font-bold text-sm ${trader.profitAmount >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                                    {trader.profitAmount >= 0 ? '+' : '-'} ₹{Math.abs(trader.profitAmount || 0).toLocaleString('en-IN')}
                                                </div>
                                                <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-tight">
                                                    {period === 'all' ? 'Total P/L' : `${period} profit`}
                                                </p>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="py-24 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <Trophy size={40} className="text-gray-100" />
                                                <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No activity recorded for this period</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            
            {/* HOW RANKING WORKS */}
<div className="flex flex-col items-center mt-6">
    <button
        onClick={() => setShowROIInfo(!showROIInfo)}
        className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-lg font-bold uppercase tracking-widest text-[10px] transition-colors"
    >
        {showROIInfo ? 'Hide Details' : 'How Rankings Work'}
    </button>

    {showROIInfo && (
        <div className="mt-4 max-w-2xl w-full bg-zinc-50 border border-zinc-200 rounded-xl p-5 text-sm text-zinc-700 leading-relaxed">
            <h3 className="font-bold text-zinc-900 uppercase tracking-widest text-xs mb-3">
                ROI Ranking System
            </h3>

            <p className="mb-4">
                Traders are ranked based on their ROI (Return on Investment), which measures how efficiently they grow their capital over time.
            </p>

            <div className="space-y-3">
                <div>
                    <p className="font-bold text-gray-900">Initial Capital</p>
                    <p>
                        Every trader starts with an initial investment amount. If no deposits are made, the default starting capital is ₹10,000.
                    </p>
                </div>

                <div>
                    <p className="font-bold text-gray-900">Current Net Worth</p>
                    <p>
                        Net worth includes available cash balance plus the live market value of all held stocks.
                    </p>
                </div>

                <div>
                    <p className="font-bold text-gray-900">ROI Formula</p>
                    <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 mt-2 font-mono text-sm text-gray-900">
                        ROI = ((Current Net Worth − Initial Investment) / Initial Investment) × 100
                    </div>
                </div>

                <div>
                    <p className="font-bold text-gray-900">Example</p>
                    <p>
                        If a trader starts with ₹10,000 and grows it to ₹12,500, their ROI becomes
                        <span className="text-green-600 font-black"> +25%</span>.
                    </p>
                </div>

                <div>
                    <p className="font-bold text-gray-900">Fair Rankings</p>
                    <p>
                        Rankings are based on percentage returns instead of total money earned, ensuring fair competition between traders with different portfolio sizes.
                    </p>
                </div>
            </div>
        </div>
    )}
</div>
        </div>
    );
};

export default Leaderboard;