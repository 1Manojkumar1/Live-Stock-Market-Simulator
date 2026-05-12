import React, { useState, useEffect, useContext, useCallback } from 'react';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import { SocketContext } from '../contexts/SocketContext';
import StockCard from '../components/stocks/StockCard';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';
import { Eye, EyeOff, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';

const Watchlist = () => {
    const { user } = useContext(AuthContext);
    const socket = useContext(SocketContext);
    const [watchlist, setWatchlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const userId = user?._id || user?.id;

    const fetchWatchlist = useCallback(async () => {
        if (!userId) return;
        try {
            setLoading(true);
            const response = await api.get(`/user-api/watchlist/${userId}`);
            setWatchlist(response.data.watchlist || []);
        } catch (error) {
            console.error("Error fetching watchlist:", error);
            toast.error("Failed to load watchlist");
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchWatchlist();
    }, [fetchWatchlist]);

    useEffect(() => {
        if (!socket) return;
        const handler = (data) => {
            setWatchlist(prev => prev.map(s =>
                s._id === data.stockId
                    ? { ...s, price: data.newPrice, priceChange: data.priceChange }
                    : s
            ));
        };
        socket.on('stockPriceUpdate', handler);
        return () => socket.off('stockPriceUpdate', handler);
    }, [socket]);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader />
            </div>
        );
    }

    const gainers = watchlist.filter(s => (s.priceChange || 0) > 0).length;
    const losers = watchlist.filter(s => (s.priceChange || 0) < 0).length;

    return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-8">
        <header>
            <div className="flex items-center gap-3 mb-1">
                <div className="p-2 bg-zinc-900 text-white rounded shadow-sm">
                    <Eye size={18} />
                </div>
                <h1 className="text-xl font-bold text-zinc-900 tracking-tight uppercase">Watchlist</h1>
            </div>
            <p className="text-zinc-500 text-[11px] font-medium ml-1">
                {watchlist.length > 0
                    ? `Tracking ${watchlist.length} asset${watchlist.length !== 1 ? 's' : ''} · `
                    : 'Monitor your favorite assets in real-time.'}
                {watchlist.length > 0 && (
                    <>
                        <span className="text-emerald-600 font-bold">{gainers} gaining</span>
                        <span className="text-zinc-300"> · </span>
                        <span className="text-rose-500 font-bold">{losers} losing</span>
                    </>
                )}
            </p>
        </header>

        {watchlist.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-zinc-200 shadow-sm">
                <div className="w-12 h-12 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <EyeOff size={24} className="text-zinc-300" />
                </div>
                <p className="text-zinc-900 font-bold text-sm mb-1 uppercase tracking-tight">Your watchlist is empty</p>
                <p className="text-zinc-400 text-[10px] max-w-xs mx-auto leading-relaxed uppercase font-bold tracking-widest">
                    Explore the market and start tracking assets.
                </p>
            </div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {watchlist.map((stock) => (
                    <StockCard key={stock._id} stock={stock} />
                ))}
            </div>
            )}
        </div>
    );
};

export default Watchlist;