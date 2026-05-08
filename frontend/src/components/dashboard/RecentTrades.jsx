import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { ArrowUpRight, ArrowDownRight, Clock, History } from 'lucide-react';

const RecentTrades = ({ userId }) => {
    const [trades, setTrades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTrades = async () => {
            if (!userId) return;
            try {
                setLoading(true);
                const response = await api.get(`/user-api/transactions/${userId}`);
                setTrades(response.data.transactions || []);
                setError('');
            } catch (error) {
                console.error("Error fetching trades:", error);
                setError('Failed to load transaction history.');
            } finally {
                setLoading(false);
            }
        };

        fetchTrades();
    }, [userId]);

    if (loading) {
        return (
            <div className="bg-white border border-gray-100 shadow-sm rounded-3xl p-6 h-full min-h-[400px] flex flex-col">
                <div className="animate-pulse flex-1">
                    <div className="h-8 bg-gray-100 rounded-xl w-48 mb-6"></div>
                    <div className="space-y-4">
                         {[1, 2, 3, 4].map(i => <div key={i} className="h-16 bg-gray-50 rounded-2xl w-full"></div>)}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white border border-gray-100 shadow-sm rounded-3xl p-6 h-full">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
                        <History size={20} />
                    </div>
                    Recent Activity
                </h3>
                <button className="text-xs font-bold text-gray-400 hover:text-black transition-colors uppercase tracking-widest">
                    View All
                </button>
            </div>
            
            {error ? (
                <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm">
                    {error}
                </div>
            ) : trades.length > 0 ? (
                <div className="space-y-4">
                    {trades.map((trade) => (
                        <div key={trade._id} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl hover:bg-gray-50 transition-all duration-200 group border border-transparent hover:border-gray-100">
                            <div className="flex items-center gap-4">
                                <div className={`p-2.5 rounded-xl ${trade.type === 'BUY' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                    {trade.type === 'BUY' ? <ArrowDownRight size={20} /> : <ArrowUpRight size={20} />}
                                </div>
                                <div>
                                    <p className="font-black text-gray-900 group-hover:text-black">{trade.stockId?.symbol || 'STOCK'}</p>
                                    <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                                        <Clock size={12} />
                                        {new Date(trade.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-gray-900">
                                    ₹{trade.totalAmount?.toLocaleString('en-IN')}
                                </p>
                                <p className="text-[10px] text-gray-400 font-medium">
                                    {trade.quantity} @ ₹{trade.price?.toLocaleString('en-IN')}
                                </p>
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${
                                    trade.type === 'BUY' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                    {trade.type}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
                    <p className="text-gray-400 font-bold mb-1">No recent activity</p>
                    <p className="text-xs text-gray-400 px-10">Your trade history will appear here once you make your first move.</p>
                </div>
            )}
        </div>
    );
};

export default RecentTrades;