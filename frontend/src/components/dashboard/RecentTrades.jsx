import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { ArrowUpRight, ArrowDownRight, Clock, History } from 'lucide-react';
import Loader from '../Loader';

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
            <div className="bg-white border border-zinc-200 shadow-sm rounded-xl p-6 h-full min-h-[400px] flex items-center justify-center">
                <Loader />
            </div>
        );
    }

    return (
        <div className="bg-white border border-zinc-200 rounded-xl p-5 h-full shadow-sm">
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                    <div className="p-2 bg-zinc-100 rounded text-zinc-600">
                        <History size={16} />
                    </div>
                    Recent Activity
                </h3>
            </div>
            
            {error ? (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg text-xs">
                    {error}
                </div>
            ) : trades.length > 0 ? (
                <div className="space-y-3">
                    {trades.map((trade) => (
                        <div key={trade._id} className="flex items-center justify-between p-3 bg-zinc-50/50 rounded-lg hover:bg-zinc-50 transition-colors group border border-transparent hover:border-zinc-100">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded ${trade.type === 'BUY' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                                    {trade.type === 'BUY' ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
                                </div>
                                <div>
                                    <p className="font-bold text-zinc-900 text-sm">{trade.stockId?.symbol || 'STOCK'}</p>
                                    <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
                                        <Clock size={10} />
                                        {new Date(trade.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-zinc-900 text-sm">
                                    ₹{trade.totalAmount?.toLocaleString('en-IN')}
                                </p>
                                <p className="text-[10px] text-zinc-400 font-medium">
                                    {trade.quantity} @ ₹{trade.price?.toLocaleString('en-IN')}
                                </p>
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                                    trade.type === 'BUY' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                                }`}>
                                    {trade.type}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-zinc-50 rounded-xl border-2 border-dashed border-zinc-100">
                    <p className="text-zinc-400 text-sm font-bold mb-1">No recent activity</p>
                    <p className="text-[10px] text-zinc-400 px-6">Your trade history will appear here once you make your first move.</p>
                </div>
            )}
        </div>
    );
};

export default RecentTrades;