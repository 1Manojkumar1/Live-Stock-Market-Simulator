import React, { useState, useEffect, useContext, useCallback } from 'react';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import { SocketContext } from '../contexts/SocketContext';
import StockCard from '../components/stocks/StockCard';
import toast from 'react-hot-toast';
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
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
        );
    }

    const gainers = watchlist.filter(s => (s.priceChange || 0) > 0).length;
    const losers = watchlist.filter(s => (s.priceChange || 0) < 0).length;

    return (
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
            <header className="mb-10">
                <div className="flex items-center gap-4 mb-2">
                    <div className="p-3 bg-black text-white rounded-2xl shadow-lg shadow-black/20">
                        <Eye size={24} />
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">WATCHLIST</h1>
                </div>
                <p className="text-gray-500 font-medium ml-1">
                    {watchlist.length > 0
                        ? `Tracking ${watchlist.length} asset${watchlist.length !== 1 ? 's' : ''} · `
                        : 'Monitor your favorite assets in real-time.'}
                    {watchlist.length > 0 && (
                        <>
                            <span className="text-green-600 font-bold">{gainers} gaining</span>
                            <span className="text-gray-400"> · </span>
                            <span className="text-red-500 font-bold">{losers} losing</span>
                        </>
                    )}
                </p>
            </header>

            {watchlist.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-gray-100 shadow-sm">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <EyeOff size={32} className="text-gray-200" />
                    </div>
                    <p className="text-gray-400 font-black text-lg mb-2">Your watchlist is empty</p>
                    <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
                        Head over to the <span className="font-bold text-gray-600">Market</span> page and click on any stock to start tracking it here.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {watchlist.map((stock) => {
                        const isPos = (stock.priceChange || 0) >= 0;
                        return (
                            <div key={stock._id} className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
                                <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-3xl opacity-10 ${isPos ? 'bg-green-500' : 'bg-red-500'}`} />

                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-xl font-black text-gray-900 tracking-tight">{stock.symbol}</h3>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest truncate max-w-[160px]">{stock.stockName}</p>
                                    </div>
                                    <div className={`p-2.5 rounded-xl ${isPos ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                        {isPos ? <TrendingUp size={22} /> : <TrendingDown size={22} />}
                                    </div>
                                </div>

                                <div className="flex items-end justify-between mb-6">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">LIVE PRICE</p>
                                        <p className="text-3xl font-black text-gray-900 leading-none">₹{stock.price?.toLocaleString('en-IN')}</p>
                                        <div className={`flex items-center gap-1 mt-2 text-sm font-black ${isPos ? 'text-green-600' : 'text-red-500'}`}>
                                            {isPos ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                                            <span>{isPos ? '+' : ''}{stock.priceChange?.toFixed(2)}</span>
                                            <span className="text-xs font-bold opacity-75">
                                                ({stock.price > 0 ? ((stock.priceChange / (stock.price - stock.priceChange)) * 100).toFixed(2) : 0}%)
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100">{stock.category || 'MARKET'}</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Live Feed</span>
                                    </div>
                                    <div className="text-gray-200">
                                        <Activity size={14} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Watchlist;