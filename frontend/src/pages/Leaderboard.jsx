import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Trophy, Medal, Crown, TrendingUp, User } from 'lucide-react';

const Leaderboard = () => {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        try {
            setLoading(true);
            const response = await api.get('/user-api/leaderboard');
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

    return (
        <div className="p-6 lg:p-8 max-w-5xl mx-auto">
            <header className="mb-10 text-center">
                <div className="inline-flex p-3 bg-black text-white rounded-2xl mb-4 shadow-lg shadow-black/20">
                    <Trophy size={32} />
                </div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">GLOBAL LEADERBOARD</h1>
                <p className="text-gray-500 font-medium">Top performing traders in the Cruz community.</p>
            </header>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
                </div>
            ) : error ? (
                <div className="bg-red-50 text-red-600 p-6 rounded-3xl text-center shadow-sm border border-red-100">
                    {error}
                </div>
            ) : (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="py-5 px-6 text-xs font-black text-gray-400 uppercase tracking-widest w-20">Rank</th>
                                    <th className="py-5 px-6 text-xs font-black text-gray-400 uppercase tracking-widest">Trader</th>
                                    <th className="py-5 px-6 text-xs font-black text-gray-400 uppercase tracking-widest">Profit / Loss</th>
                                    <th className="py-5 px-6 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Trades</th>
                                </tr>
                            </thead>

                            <tbody>
                                {leaders.length > 0 ? (
                                    leaders.map((trader) => (
                                        <tr
                                            key={trader.userId}
                                            className="border-b border-gray-50 hover:bg-gray-50 transition-all duration-200"
                                        >
                                            <td className="py-5 px-6">
                                                <div className="flex justify-center">
                                                    {getRankIcon(trader.rank)}
                                                </div>
                                            </td>

                                            <td className="py-5 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 border border-gray-200">
                                                        <User size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 leading-tight">{trader.name}</p>
                                                        <p className="text-xs text-gray-400 font-medium">{trader.email}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="py-5 px-6">
                                                <div className={`flex items-center gap-1 font-black ${trader.profit >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                                    {trader.profit >= 0 ? <TrendingUp size={16} /> : null}
                                                    ₹{Math.abs(trader.profit || 0).toLocaleString('en-IN')}
                                                </div>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase">Net Worth: ₹{trader.netWorth?.toLocaleString('en-IN')}</p>
                                            </td>

                                            <td className="py-5 px-6 text-right">
                                                <span className="font-bold text-gray-700 bg-gray-100 px-3 py-1 rounded-full text-xs">
                                                    {trader.totalTrades || 0}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="py-20 text-center text-gray-400 font-bold">
                                            No leaderboard data available yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            
            <div className="mt-8 flex items-center gap-4 bg-blue-50 p-4 rounded-2xl border border-blue-100 text-blue-600">
                <div className="bg-blue-600 text-white p-2 rounded-lg">
                    <Trophy size={16} />
                </div>
                <p className="text-sm font-medium">
                    <span className="font-bold">Pro Tip:</span> Ranks are calculated based on total profit and portfolio performance. Keep trading to climb the ladder!
                </p>
            </div>
        </div>
    );
};

export default Leaderboard;