import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { TrendingUp, TrendingDown, Briefcase, Info } from 'lucide-react';
import StockChart from '../stocks/StockChart';

const Portfolio = ({ userId }) => {
    const [data, setData] = useState({ portfolio: [], summary: {} });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPortfolio = async () => {
            if (!userId) return;
            try {
                setLoading(true);
                const response = await api.get(`/user-api/portfolio/${userId}`);
                setData(response.data);
                setError('');
            } catch (error) {
                console.error("Error fetching portfolio:", error);
                setError('Failed to load portfolio data.');
            } finally {
                setLoading(false);
            }
        };

        fetchPortfolio();
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

    const { portfolio, summary } = data;

    return (
        <div className="bg-white border border-gray-100 shadow-sm rounded-[2rem] p-8 h-full">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-gray-900 flex items-center gap-3 tracking-tight uppercase">
                    <div className="p-2 bg-zinc-900 rounded-xl text-white">
                        <Briefcase size={20} />
                    </div>
                    Portfolio
                </h3>
                {summary && (
                    <div className={`px-4 py-1.5 rounded-full text-xs font-black ${summary.totalProfitLoss >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        {summary.totalProfitLoss >= 0 ? '+' : ''}{summary.totalProfitLossPercent}%
                    </div>
                )}
            </div>

            {error ? (
                <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl text-xs font-bold flex items-center gap-2">
                    <Info size={16} />
                    {error}
                </div>
            ) : portfolio.length > 0 ? (
                <div className="overflow-x-auto -mx-2">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead>
                            <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                                <th className="pb-4 px-4">Asset</th>
                                <th className="pb-4 px-4 w-24">Trend</th>
                                <th className="pb-4 px-4">Qty</th>
                                <th className="pb-4 px-4">Price</th>
                                <th className="pb-4 px-4 text-right">P/L</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {portfolio.map((item, idx) => {
                                const isProfit = item.profitLoss >= 0;

                                return (
                                    <tr key={item._id || idx} className="border-b border-gray-50 hover:bg-gray-50/50 transition-all duration-200 group">
                                        <td className="py-5 px-4">
                                            <p className="font-black text-gray-900">{item.stock?.symbol}</p>
                                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">{item.stock?.stockName}</p>
                                        </td>
                                        <td className="py-5 px-4">
                                            <div className="w-20 h-10">
                                                <StockChart stockId={item.stock?._id} compact={true} />
                                            </div>
                                        </td>
                                        <td className="py-5 px-4 font-black text-gray-700">{item.quantity}</td>
                                        <td className="py-5 px-4">
                                            <p className="font-black text-gray-900">₹{item.stock?.price?.toLocaleString('en-IN')}</p>
                                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">Avg: ₹{item.avgBuyPrice?.toLocaleString('en-IN')}</p>
                                        </td>
                                        <td className="py-5 px-4 text-right">
                                            <div className={`inline-flex items-center gap-1 font-black ${isProfit ? 'text-emerald-600' : 'text-rose-500'}`}>
                                                {isProfit ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                                ₹{Math.abs(item.profitLoss).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                            </div>
                                            <p className={`text-[10px] font-black ${isProfit ? 'text-emerald-600' : 'text-rose-500'}`}>
                                                {isProfit ? '+' : ''}{item.profitLossPercent}%
                                            </p>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100">
                    <p className="text-gray-400 font-black mb-1 uppercase tracking-widest text-[10px]">No active positions</p>
                    <p className="text-[10px] text-gray-400 px-10 font-medium">Your portfolio is currently empty. Visit the market to start trading.</p>
                </div>
            )}
        </div>
    );
};

export default Portfolio;