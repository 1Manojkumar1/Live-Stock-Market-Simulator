import React, { useState, useEffect } from 'react';
import { X, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Activity, Wallet, Layers, Globe } from 'lucide-react';
import StockChart from './StockChart';
import TradingModal from '../trading/TradingModal';
import api from '../../services/api';

const StockDetailsModal = ({ stock, onClose }) => {
    const [showTradeModal, setShowTradeModal] = useState(false);
    const [tradeType, setTradeType] = useState('BUY');
    const [history, setHistory] = useState([]);
    const isPositive = stock.priceChange >= 0;

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await api.get(`/stock-api/stocks/${stock._id}/history`);
                setHistory(res.data.priceHistory || []);
            } catch (err) {
                console.error("Failed to fetch history for details", err);
            }
        };
        fetchHistory();
    }, [stock._id]);

    const openTrade = (type) => {
        setTradeType(type);
        setShowTradeModal(true);
    };

    return (
        <div className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-zinc-200 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                    <div className="flex items-center gap-4">
                        {stock.logo ? (
                            <img src={stock.logo} alt={stock.symbol} className="w-12 h-12 rounded-xl object-contain bg-white p-1.5 border border-zinc-200 shadow-sm" />
                        ) : (
                            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-zinc-400 border border-zinc-200 shadow-sm">
                                <Globe size={24} />
                            </div>
                        )}
                        <div>
                            <h2 className="text-2xl font-black text-zinc-900 tracking-tight leading-none mb-1">{stock.symbol}</h2>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{stock.stockName}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-zinc-200 rounded-full transition-colors text-zinc-400">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    
                    {/* Price Overview */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Market Price</p>
                            <p className="text-2xl font-black text-zinc-900">₹{stock.price?.toLocaleString('en-IN')}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Day Change</p>
                            <div className={`flex items-center gap-1 text-lg font-bold ${isPositive ? 'text-emerald-600' : 'text-rose-500'}`}>
                                {isPositive ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                                {isPositive ? '+' : ''}{stock.priceChange?.toFixed(2)}
                                <span className="text-xs opacity-75">
                                    ({stock.price > 0 ? ((stock.priceChange / (stock.price - stock.priceChange)) * 100).toFixed(2) : 0}%)
                                </span>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Category</p>
                            <p className="text-lg font-bold text-zinc-900 uppercase tracking-tight">{stock.category || 'Equity'}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Market Status</p>
                            <div className="flex items-center gap-2 text-lg font-bold text-emerald-600">
                                <Activity size={18} />
                                LIVE
                            </div>
                        </div>
                    </div>

                    {/* Interactive Chart */}
                    <div className="bg-zinc-50/50 rounded-2xl p-6 border border-zinc-100">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                <TrendingUp size={14} />
                                Price Action (Real-time)
                            </h3>
                            <div className="flex gap-2">
                                <div className="px-2 py-1 bg-white rounded border border-zinc-200 text-[10px] font-bold text-zinc-900">1D</div>
                            </div>
                        </div>
                        <div className="h-64">
                            <StockChart stockId={stock._id} initialHistory={history} compact={false} />
                        </div>
                    </div>

                    {/* Trading Actions Area */}
                    <div className="bg-zinc-900 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-zinc-200">
                        <div>
                            <h4 className="text-xl font-bold tracking-tight mb-1">Execute Trade</h4>
                            <p className="text-zinc-400 text-xs font-medium">Instant execution at market price</p>
                        </div>
                        <div className="flex gap-4 w-full md:w-auto">
                            <button 
                                onClick={() => openTrade('BUY')}
                                className="flex-1 md:flex-none bg-white text-zinc-900 px-8 py-3.5 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-zinc-100 transition-all active:scale-95"
                            >
                                Buy Stock
                            </button>
                            <button 
                                onClick={() => openTrade('SELL')}
                                className="flex-1 md:flex-none bg-zinc-800 text-white border border-zinc-700 px-8 py-3.5 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-zinc-700 transition-all active:scale-95"
                            >
                                Sell Stock
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex items-center justify-center gap-6">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                        <Wallet size={14} />
                        Risk-free simulation
                    </div>
                    <div className="w-1 h-1 rounded-full bg-zinc-300" />
                    <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                        <Layers size={14} />
                        Finnhub Real-time data
                    </div>
                </div>
            </div>

            {showTradeModal && (
                <TradingModal 
                    stock={stock} 
                    type={tradeType} 
                    onClose={() => setShowTradeModal(false)} 
                />
            )}
        </div>
    );
};

export default StockDetailsModal;
