import React, { useState } from 'react';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import TradingModal from '../trading/TradingModal';

const StockCard = ({ stock }) => {
    const [showModal, setShowModal] = useState(false);
    const [tradeType, setTradeType] = useState('BUY');
    const isPositive = stock.priceChange >= 0;

    const openTrade = (type) => {
        setTradeType(type);
        setShowModal(true);
    };

    return (
        <>
            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
                {/* Decorative background element */}
                <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-3xl opacity-10 transition-opacity group-hover:opacity-20 ${isPositive ? 'bg-green-500' : 'bg-red-500'}`} />

                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-xl font-black text-gray-900 group-hover:text-black transition-colors tracking-tight">{stock.symbol}</h3>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest truncate max-w-[150px]">{stock.stockName}</p>
                    </div>
                    <div className={`p-2.5 rounded-xl ${isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        {isPositive ? <TrendingUp size={22} /> : <TrendingDown size={22} />}
                    </div>
                </div>

                <div className="flex items-end justify-between mb-6">
                    <div>
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Current Value</p>
                        <p className="text-3xl font-black text-gray-900 leading-none">₹{stock.price?.toLocaleString('en-IN')}</p>
                        <div className={`flex items-center gap-1 mt-2 text-xs font-black ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
                            {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                            <span>{isPositive ? '+' : ''}{stock.priceChange?.toFixed(2)} ({((stock.priceChange / (stock.price - stock.priceChange)) * 100).toFixed(2)}%)</span>
                        </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                        <button 
                            onClick={() => openTrade('BUY')}
                            className="bg-black text-white px-5 py-2.5 rounded-xl text-xs font-black hover:bg-gray-800 transition-all shadow-lg shadow-black/10 active:scale-95 uppercase tracking-wider"
                        >
                            Buy
                        </button>
                        <button 
                            onClick={() => openTrade('SELL')}
                            className="bg-white text-gray-900 border-2 border-gray-100 px-5 py-2.5 rounded-xl text-xs font-black hover:border-gray-900 transition-all active:scale-95 uppercase tracking-wider"
                        >
                            Sell
                        </button>
                    </div>
                </div>
                
                <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
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
