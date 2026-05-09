import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Activity, Globe } from 'lucide-react';
import TradingModal from '../trading/TradingModal';
import StockChart from './StockChart';
import api from '../../services/api';

const StockCard = ({ stock }) => {
    const [showModal, setShowModal] = useState(false);
    const [tradeType, setTradeType] = useState('BUY');
    const [history, setHistory] = useState([]);
    const isPositive = stock.priceChange >= 0;

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await api.get(`/stock-api/stocks/${stock._id}/history`);
                setHistory(res.data.priceHistory || []);
            } catch (err) {
                console.error("Failed to fetch history for card", err);
            }
        };
        fetchHistory();
    }, [stock._id]);

    const openTrade = (type) => {
        setTradeType(type);
        setShowModal(true);
    };

    return (
        <>
            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group relative overflow-hidden flex flex-col h-full">
                {/* Decorative background element */}
                <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-3xl opacity-10 transition-opacity group-hover:opacity-20 ${isPositive ? 'bg-emerald-500' : 'bg-rose-500'}`} />

                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                        {stock.logo ? (
                            <img src={stock.logo} alt={stock.symbol} className="w-12 h-12 rounded-2xl object-contain bg-gray-50 p-1 border border-gray-100" />
                        ) : (
                            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100">
                                <Globe size={24} />
                            </div>
                        )}
                        <div>
                            <h3 className="text-xl font-black text-gray-900 tracking-tight">{stock.symbol}</h3>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest truncate max-w-[120px]">{stock.stockName}</p>
                        </div>
                    </div>
                    <div className={`p-2 rounded-xl ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        {isPositive ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                    </div>
                </div>

                <div className="mb-6 flex-1">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Performance</p>
                        <div className={`flex items-center gap-1 text-[10px] font-black ${isPositive ? 'text-emerald-600' : 'text-rose-500'}`}>
                            {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                            {isPositive ? '+' : ''}{stock.priceChange?.toFixed(2)}
                        </div>
                    </div>
                    <div className="h-24 -mx-2">
                        <StockChart stockId={stock._id} initialHistory={history} compact={true} />
                    </div>
                </div>

                <div className="flex items-end justify-between mb-6">
                    <div>
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Market Price</p>
                        <p className="text-2xl font-black text-gray-900 leading-none">₹{stock.price?.toLocaleString('en-IN')}</p>
                    </div>
                    
                    <div className="flex gap-2">
                        <button 
                            onClick={() => openTrade('BUY')}
                            className="bg-zinc-900 text-white px-5 py-2.5 rounded-xl text-[10px] font-black hover:bg-zinc-800 transition-all active:scale-95 uppercase tracking-wider shadow-lg shadow-zinc-200"
                        >
                            Buy
                        </button>
                        <button 
                            onClick={() => openTrade('SELL')}
                            className="bg-white text-zinc-900 border-2 border-zinc-100 px-5 py-2.5 rounded-xl text-[10px] font-black hover:border-zinc-900 transition-all active:scale-95 uppercase tracking-wider"
                        >
                            Sell
                        </button>
                    </div>
                </div>
                
                <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isPositive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stock.category || 'MARKET'}</span>
                    </div>
                    <Activity size={14} className="text-gray-200" />
                </div>
            </div>

            {showModal && (
                <TradingModal 
                    stock={stock} 
                    type={tradeType} 
                    onClose={() => setShowModal(false)} 
                />
            )}
        </>
    );
};

export default StockCard;


