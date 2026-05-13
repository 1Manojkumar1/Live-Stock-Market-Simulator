import React, { useState, useEffect } from 'react';
import { X, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Activity, Wallet, Layers, Globe } from 'lucide-react';
import StockChart from './StockChart';
import TradingModal from '../trading/TradingModal';
import api from '../../services/api';

const StockDetailsModal = ({ stock, onClose }) => {
    const [showTradeModal, setShowTradeModal] = useState(false);
    const [tradeType, setTradeType] = useState('BUY');
    const [history, setHistory] = useState([]);
    const [period, setPeriod] = useState('1D');
    const isPositive = stock.priceChange >= 0;

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await api.get(`/stock-api/stocks/${stock._id}/history?period=${period}`);
                setHistory(res.data.priceHistory || []);
            } catch (err) {
                console.error("Failed to fetch history for details", err);
            }
        };
        fetchHistory();
    }, [stock._id, period]);

    const openTrade = (type) => {
        setTradeType(type);
        setShowTradeModal(true);
    };

    return (
        <div className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden border border-zinc-200 animate-in zoom-in-95 duration-200 flex flex-col">
                
                {/* Header */}
                <div className="p-5 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                    <div className="flex items-center gap-3">
                        {stock.logo ? (
                            <img src={stock.logo} alt={stock.symbol} className="w-10 h-10 rounded-lg object-contain bg-white p-1 border border-zinc-200" />
                        ) : (
                            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-zinc-400 border border-zinc-200">
                                <Globe size={20} />
                            </div>
                        )}
                        <div>
                            <h2 className="text-xl font-black text-zinc-900 tracking-tight leading-none">{stock.symbol}</h2>
                            <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{stock.stockName}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1.5 hover:bg-zinc-200 rounded-full transition-colors text-zinc-400">
                        <X size={18} />
                    </button>
                </div>

                {/* Main Layout: Fixed Height, No Scroll */}
                <div className="p-6 space-y-6">
                    
                    {/* Top Section: Price and Trading Side-by-Side */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                        {/* Left: Price Data */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-0.5">
                                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Market Price</p>
                                <p className="text-xl font-black text-zinc-900">₹{stock.price?.toLocaleString('en-IN')}</p>
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Day Change</p>
                                <div className={`flex items-center gap-1 text-base font-bold ${isPositive ? 'text-emerald-600' : 'text-rose-500'}`}>
                                    {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                    {isPositive ? '+' : ''}{stock.priceChange?.toFixed(2)}
                                </div>
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Category</p>
                                <p className="text-sm font-bold text-zinc-900 uppercase">{stock.category || 'Equity'}</p>
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Market Status</p>
                                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                                    <Activity size={12} />
                                    LIVE
                                </div>
                            </div>
                        </div>

                        {/* Right: Execute Trade (Beside price) */}
                        <div className="flex flex-col gap-3">
                            <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest text-right">Execute Trade</p>
                            <div className="flex gap-3 justify-end">
                                <button 
                                    onClick={() => openTrade('BUY')}
                                    className="bg-zinc-900 text-white px-8 py-2.5 rounded-lg font-bold text-[11px] uppercase tracking-widest hover:bg-zinc-800 transition-all active:scale-95 shadow-sm"
                                >
                                    Buy
                                </button>
                                <button 
                                    onClick={() => openTrade('SELL')}
                                    className="bg-white text-zinc-900 border border-zinc-200 px-8 py-2.5 rounded-lg font-bold text-[11px] uppercase tracking-widest hover:bg-zinc-50 transition-all active:scale-95"
                                >
                                    Sell
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Section: Full Width Chart */}
                    <div className="bg-zinc-50/50 rounded-xl p-5 border border-zinc-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                                <TrendingUp size={12} />
                                Price Action ({period})
                            </h3>
                            <div className="flex gap-1.5">
                                {['1D', '1W', '1M', '1Y'].map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => setPeriod(p)}
                                        className={`px-2 py-0.5 rounded text-[9px] font-bold transition-all ${
                                            period === p 
                                            ? 'bg-zinc-900 text-white' 
                                            : 'bg-white text-zinc-400 border border-zinc-200'
                                        }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="h-56">
                            <StockChart stockId={stock._id} initialHistory={history} compact={false} />
                        </div>
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
