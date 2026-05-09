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
        <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-10">
            <header className="text-center">
                <div className="inline-flex p-3 bg-black text-white rounded-2xl mb-4 shadow-lg shadow-black/20">
                    <Trophy size={32} />
                </div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Trading Champions</h1>
                <p className="text-gray-500 font-medium mt-2">Ranked by Percentage ROI (Return on Investment)</p>
            </header>

            {/* TAB NAVIGATION */}
            <div className="flex justify-center">
                <div className="bg-gray-100 p-1.5 rounded-2xl flex items-center gap-2">
                    {[
                        { id: 'weekly', name: 'Weekly', icon: <Clock size={14} /> },
                        { id: 'monthly', name: 'Monthly', icon: <Calendar size={14} /> },
                        { id: 'all', name: 'All Time', icon: <Award size={14} /> }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setPeriod(tab.id)}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                                period === tab.id 
                                ? 'bg-white text-black shadow-sm' 
                                : 'text-gray-400 hover:text-gray-600'
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
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="py-6 px-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] w-24">Rank</th>
                                    <th className="py-6 px-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Trader</th>
                                    <th className="py-6 px-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{getPeriodLabel()}</th>
                                    <th className="py-6 px-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Profit Amount</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-50">
                                {leaders.length > 0 ? (
                                    leaders.map((trader) => (
                                        <tr
                                            key={trader.userId}
                                            className="group hover:bg-gray-50/50 transition-all duration-200"
                                        >
                                            <td className="py-6 px-8">
                                                <div className="flex justify-center">
                                                    {getRankIcon(trader.rank)}
                                                </div>
                                            </td>

                                            <td className="py-6 px-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 border border-gray-100 group-hover:bg-black group-hover:text-white group-hover:border-black transition-all duration-300">
                                                        <User size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-gray-900 leading-tight text-base">{trader.name}</p>
                                                        <p className="text-xs text-gray-400 font-bold mt-0.5">{trader.email}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="py-6 px-8">
                                                <div className={`flex items-center gap-1.5 font-black text-2xl ${trader.roi >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                                    {trader.roi >= 0 ? '+' : ''}
                                                    {trader.roi}%
                                                </div>
                                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">
                                                    Performance ROI
                                                </p>
                                            </td>

                                            <td className="py-6 px-8 text-right">
                                                <div className={`font-black text-sm ${trader.profitAmount >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                                    {trader.profitAmount >= 0 ? '+' : '-'} ₹{Math.abs(trader.profitAmount || 0).toLocaleString('en-IN')}
                                                </div>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mt-1">
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
<div className="flex flex-col items-center mt-8">
    <button
        onClick={() => setShowROIInfo(!showROIInfo)}
        className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-2xl font-black uppercase tracking-widest text-xs transition-all duration-200"
    >
        click here to know How Rankings Work
    </button>

    {showROIInfo && (
        <div className="mt-5 max-w-3xl w-full bg-gray-50 border border-gray-100 rounded-[2rem] p-6 shadow-sm text-sm text-gray-700 leading-relaxed">
            <h3 className="font-black text-gray-900 uppercase tracking-widest text-xs mb-4">
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