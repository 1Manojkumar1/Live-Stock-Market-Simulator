import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { TrendingUp, TrendingDown, Briefcase, Info } from 'lucide-react';

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
        <div className="bg-white border border-gray-100 shadow-sm rounded-3xl p-6 h-full">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
                        <Briefcase size={20} />
                    </div>
                    Portfolio Holdings
                </h3>
                {summary && (
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${summary.totalProfitLoss >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        {summary.totalProfitLoss >= 0 ? '+' : ''}{summary.totalProfitLossPercent}%
                    </div>
                )}
            </div>

            {error ? (
                <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm flex items-center gap-2">
                    <Info size={16} />
                    {error}
                </div>
            ) : portfolio.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead>
                            <tr className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50">
                                <th className="pb-4 px-2">Asset</th>
                                <th className="pb-4 px-2">Quantity</th>
                                <th className="pb-4 px-2">Live Price</th>
                                <th className="pb-4 px-2 text-right">P/L</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {portfolio.map((item, idx) => {
                                const isProfit = item.profitLoss >= 0;

                                return (
                                    <tr key={item._id || idx} className="border-b border-gray-50 hover:bg-gray-50 transition-all duration-200 group">
                                        <td className="py-4 px-2">
                                            <p className="font-bold text-gray-900 group-hover:text-black">{item.stock?.symbol}</p>
                                            <p className="text-xs text-gray-400 font-medium">{item.stock?.stockName}</p>
                                        </td>
                                        <td className="py-4 px-2 font-bold text-gray-700">{item.quantity}</td>
                                        <td className="py-4 px-2">
                                            <p className="font-bold text-gray-900">₹{item.stock?.price?.toLocaleString('en-IN')}</p>
                                            <p className="text-xs text-gray-400">Avg: ₹{item.avgBuyPrice?.toLocaleString('en-IN')}</p>
                                        </td>
                                        <td className="py-4 px-2 text-right">
                                            <div className={`inline-flex items-center gap-1 font-black ${isProfit ? 'text-green-600' : 'text-red-500'}`}>
                                                {isProfit ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                                ₹{Math.abs(item.profitLoss).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                            </div>
                                            <p className={`text-xs font-bold ${isProfit ? 'text-green-600' : 'text-red-500'}`}>
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
                <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
                    <p className="text-gray-400 font-bold mb-1">No active positions</p>
                    <p className="text-xs text-gray-400 px-10">Your portfolio is currently empty. Visit the market to start trading.</p>
                </div>
            )}
        </div>
    );
};

export default Portfolio;