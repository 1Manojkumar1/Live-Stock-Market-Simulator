import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Activity, Globe } from 'lucide-react';
import TradingModal from '../trading/TradingModal';
import StockDetailsModal from './StockDetailsModal';
import StockChart from './StockChart';
import api from '../../services/api';

const StockCard = ({ stock }) => {
    const [showModal, setShowModal] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
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

    const openTrade = (e, type) => {
        if (e) e.stopPropagation();
        setTradeType(type);
        setShowModal(true);
    };

    return (
        <>
            <div 
                onClick={() => setShowDetails(true)}
                className="bg-white rounded-xl p-5 border border-zinc-200 hover:border-zinc-300 transition-all duration-200 group relative overflow-hidden flex flex-col h-full shadow-sm cursor-pointer active:scale-[0.99] hover:shadow-md"
            >
                
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        {stock.logo ? (
                            <img src={stock.logo} alt={stock.symbol} className="w-10 h-10 rounded-lg object-contain bg-zinc-50 p-1 border border-zinc-100" />
                        ) : (
                            <div className="w-10 h-10 rounded-lg bg-zinc-50 flex items-center justify-center text-zinc-400 border border-zinc-100">
                                <Globe size={18} />
                            </div>
                        )}
                        <div>
                            <h3 className="text-lg font-bold text-zinc-900 tracking-tight">{stock.symbol}</h3>
                            <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest truncate max-w-[100px]">{stock.stockName}</p>
                        </div>
                    </div>
                    <div className={`p-2 rounded ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    </div>
                </div>

                <div className="mb-4 flex-1">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Performance</p>
                        <div className={`flex items-center gap-1 text-[9px] font-bold ${isPositive ? 'text-emerald-600' : 'text-rose-500'}`}>
                            {isPositive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                            {isPositive ? '+' : ''}{stock.priceChange?.toFixed(2)}
                        </div>
                    </div>
                    <div className="h-20 -mx-1">
                        <StockChart stockId={stock._id} initialHistory={history} compact={true} />
                    </div>
                </div>

                <div className="flex items-end justify-between mb-4">
                    <div className="flex gap-4">
                        <div>
                            <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-0.5">Price</p>
                            <p className="text-xl font-bold text-zinc-900 leading-none">₹{stock.price?.toLocaleString('en-IN')}</p>
                        </div>
                        {stock.avgBuyPrice && (
                            <div>
                                <p className="text-[9px] font-bold text-amber-500 uppercase tracking-widest mb-0.5">Avg Buy</p>
                                <p className="text-sm font-bold text-zinc-600 leading-none">₹{stock.avgBuyPrice?.toLocaleString('en-IN')}</p>
                            </div>
                        )}
                    </div>
                    
                    <div className="flex gap-2">
                        <button 
                            onClick={(e) => openTrade(e, 'BUY')}
                            className="bg-zinc-900 text-white px-4 py-1.5 rounded text-[10px] font-bold hover:bg-zinc-800 transition-colors uppercase tracking-wider shadow-sm"
                        >
                            Buy
                        </button>
                        <button 
                            onClick={(e) => openTrade(e, 'SELL')}
                            className="bg-white text-zinc-900 border border-zinc-200 px-4 py-1.5 rounded text-[10px] font-bold hover:bg-zinc-50 transition-colors uppercase tracking-wider"
                        >
                            Sell
                        </button>
                    </div>
                </div>
                
                <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                        <div className={`w-1 h-1 rounded-full ${isPositive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">{stock.category || 'MARKET'}</span>
                    </div>
                    <Activity size={12} className="text-zinc-300" />
                </div>
            </div>

            {showModal && (
                <TradingModal 
                    stock={stock} 
                    type={tradeType} 
                    onClose={() => setShowModal(false)} 
                />
            )}
            {showDetails && (
                <StockDetailsModal 
                    stock={stock}
                    onClose={() => setShowDetails(false)}
                />
            )}
        </>
    );
};

export default StockCard;


