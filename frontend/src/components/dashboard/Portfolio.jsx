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
            <div className="bg-white border border-zinc-200 shadow-sm rounded-xl p-6 h-full min-h-[300px] flex flex-col">
                <div className="animate-pulse flex-1">
                    <div className="h-6 bg-zinc-100 rounded w-40 mb-6"></div>
                    <div className="space-y-3">
                         {[1, 2, 3, 4].map(i => <div key={i} className="h-12 bg-zinc-50 rounded-lg w-full"></div>)}
                    </div>
                </div>
            </div>
        );
    }

    const { portfolio, summary } = data;

    return (
        <div className="bg-white border border-zinc-200 shadow-sm rounded-xl p-6 h-full">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2 tracking-tight uppercase">
                    <div className="p-2 bg-zinc-900 rounded text-white shadow-sm">
                        <Briefcase size={14} />
                    </div>
                    Current Holdings
                </h3>
                {summary && (
                    <div className={`px-3 py-1 rounded text-[10px] font-bold border ${summary.totalProfitLoss >= 0 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                        {summary.totalProfitLoss >= 0 ? '+' : ''}{summary.totalProfitLossPercent}% P/L
                    </div>
                )}
            </div>

            {error ? (
                <div className="bg-rose-50 text-rose-600 p-4 rounded-lg text-[10px] font-bold border border-rose-100 flex items-center gap-2">
                    <Info size={14} />
                    {error}
                </div>
            ) : portfolio.length > 0 ? (
                <div className="overflow-x-auto -mx-1">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead>
                            <tr className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-100">
                                <th className="pb-3 px-4 font-bold">Asset</th>
                                <th className="pb-3 px-4 w-24 font-bold">Trend</th>
                                <th className="pb-3 px-4 font-bold">Qty</th>
                                <th className="pb-3 px-4 font-bold">Value</th>
                                <th className="pb-3 px-4 text-right font-bold">Profit/Loss</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {portfolio.map((item, idx) => {
                                const isProfit = item.profitLoss >= 0;

                                return (
                                    <tr key={item._id || idx} className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors group">
                                        <td className="py-4 px-4">
                                            <p className="font-bold text-zinc-900 leading-tight">{item.stock?.symbol}</p>
                                            <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">{item.stock?.stockName}</p>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="w-16 h-8 opacity-75">
                                                <StockChart stockId={item.stock?._id} compact={true} />
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 font-bold text-zinc-700">{item.quantity}</td>
                                        <td className="py-4 px-4">
                                            <p className="font-bold text-zinc-900 leading-tight">₹{item.stock?.price?.toLocaleString('en-IN')}</p>
                                            <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">Avg: ₹{item.avgBuyPrice?.toLocaleString('en-IN')}</p>
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <div className={`inline-flex items-center gap-1 font-bold ${isProfit ? 'text-emerald-600' : 'text-rose-500'}`}>
                                                {isProfit ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                                ₹{Math.abs(item.profitLoss).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                            </div>
                                            <p className={`text-[9px] font-bold ${isProfit ? 'text-emerald-600' : 'text-rose-500'} leading-none mt-0.5`}>
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
                <div className="text-center py-20 bg-zinc-50/50 rounded-xl border border-zinc-200">
                    <p className="text-zinc-900 font-bold mb-1 uppercase tracking-tight text-xs">No active positions</p>
                    <p className="text-[10px] text-zinc-400 px-10 font-bold uppercase tracking-widest leading-relaxed">
                        Your portfolio is empty. Explore the market to start trading.
                    </p>
                </div>
            )}
        </div>
    );
};

export default Portfolio;