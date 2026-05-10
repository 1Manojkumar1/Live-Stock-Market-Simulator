import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Package, TrendingUp, Plus, RefreshCw, Layers, DollarSign, Activity, Tag, Trash2 } from 'lucide-react';
import Loader from '../Loader';

const StockManager = () => {
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newStock, setNewStock] = useState({
        stockid: '',
        stockName: '',
        symbol: '',
        price: '',
        category: '',
    });
    const [updateData, setUpdateData] = useState({
        stockId: '',
        newPrice: '',
    });

    useEffect(() => {
        fetchStocks();
    }, []);

    const fetchStocks = async () => {
        try {
            setLoading(true);
            const res = await api.get("/stock-api/stocks");
            setStocks(res.data.stocks);
        } catch (err) {
            toast.error("Failed to fetch stocks");
        } finally {
            setLoading(false);
        }
    };

    const handleNewStockChange = (e) => {
        setNewStock({ ...newStock, [e.target.name]: e.target.value });
    };

    const handleUpdateChange = (e) => {
        setUpdateData({ ...updateData, [e.target.name]: e.target.value });
    };

    const handleAddStock = async (e) => {
        e.preventDefault();
        try {
            await api.post('/stock-api/addStock', {
                ...newStock,
                price: Number(newStock.price)
            });
            toast.success('Asset created and listed successfully!');
            setNewStock({ stockid: '', stockName: '', symbol: '', price: '', category: '' });
            fetchStocks();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to add asset');
        }
    };

    const handleUpdatePrice = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/stock-api/updateStock/${updateData.stockId}`, {
                price: Number(updateData.newPrice)
            });
            toast.success('Market value recalibrated!');
            setUpdateData({ stockId: '', newPrice: '' });
            fetchStocks();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to recalibrate price');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-40">
                <Loader />
            </div>
        );
    }

    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* CREATE ASSET */}
                <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-zinc-900 text-white rounded shadow-sm">
                            <Plus size={16} />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-zinc-900 tracking-tight uppercase">Forge New Asset</h2>
                            <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">List a new company on the exchange</p>
                        </div>
                    </div>

                    <form onSubmit={handleAddStock} className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 ml-0.5">Unique Identifier</label>
                            <input
                                type="text"
                                name="stockid"
                                value={newStock.stockid}
                                onChange={handleNewStockChange}
                                placeholder="ID-7721-MARKET"
                                required
                                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-2 text-sm focus:bg-white focus:ring-1 focus:ring-zinc-900 transition-all outline-none font-bold"
                            />
                        </div>
                        <div>
                            <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 ml-0.5">Symbol</label>
                            <input
                                type="text"
                                name="symbol"
                                value={newStock.symbol}
                                onChange={handleNewStockChange}
                                placeholder="TICKER"
                                required
                                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-2 text-sm focus:bg-white focus:ring-1 focus:ring-zinc-900 transition-all outline-none font-bold"
                            />
                        </div>
                        <div>
                            <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 ml-0.5">Base (₹)</label>
                            <input
                                type="number"
                                name="price"
                                value={newStock.price}
                                onChange={handleNewStockChange}
                                placeholder="100.00"
                                required
                                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-2 text-sm focus:bg-white focus:ring-1 focus:ring-zinc-900 transition-all outline-none font-bold"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 ml-0.5">Entity Name</label>
                            <input
                                type="text"
                                name="stockName"
                                value={newStock.stockName}
                                onChange={handleNewStockChange}
                                placeholder="Global Industries Corp."
                                required
                                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-2 text-sm focus:bg-white focus:ring-1 focus:ring-zinc-900 transition-all outline-none font-bold"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 ml-0.5">Sector</label>
                            <select
                                name="category"
                                value={newStock.category}
                                onChange={handleNewStockChange}
                                required
                                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-2 text-sm focus:bg-white focus:ring-1 focus:ring-zinc-900 transition-all outline-none font-bold cursor-pointer"
                            >
                                <option value="">SELECT SECTOR</option>
                                <option value="Technology">TECHNOLOGY</option>
                                <option value="Finance">FINANCE</option>
                                <option value="Energy">ENERGY</option>
                                <option value="Healthcare">HEALTHCARE</option>
                                <option value="Consumer">CONSUMER GOODS</option>
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="col-span-2 bg-zinc-900 text-white font-bold py-3 rounded-lg shadow-sm hover:bg-zinc-800 transition-all active:scale-95 mt-2 tracking-widest uppercase text-xs"
                        >
                            Authorize Listing
                        </button>
                    </form>
                </div>

                {/* PRICE CALIBRATION */}
                <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6 h-fit">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-zinc-900 text-white rounded shadow-sm">
                            <RefreshCw size={16} />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-zinc-900 tracking-tight uppercase">Calibrate Value</h2>
                            <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">Manual market price override</p>
                        </div>
                    </div>

                    <form onSubmit={handleUpdatePrice} className="space-y-6">
                        <div>
                            <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 ml-0.5">Target Asset</label>
                            <select
                                name="stockId"
                                value={updateData.stockId}
                                onChange={handleUpdateChange}
                                required
                                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-2 text-sm focus:bg-white focus:ring-1 focus:ring-zinc-900 transition-all outline-none font-bold cursor-pointer"
                            >
                                <option value="">SELECT ACTIVE STOCK</option>
                                {stocks.map((stock) => (
                                    <option key={stock._id} value={stock._id}>
                                        {stock.symbol} — {stock.stockName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 ml-0.5">New Valuation (₹)</label>
                            <input
                                type="number"
                                name="newPrice"
                                value={updateData.newPrice}
                                onChange={handleUpdateChange}
                                placeholder="0.00"
                                required
                                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-2 text-sm focus:bg-white focus:ring-1 focus:ring-zinc-900 transition-all outline-none font-bold"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-zinc-900 text-white font-bold py-3 rounded-lg shadow-sm hover:bg-zinc-800 transition-all active:scale-95 tracking-widest uppercase text-xs"
                        >
                            Commit Valuation
                        </button>
                    </form>
                </div>
            </div>

            {/* ASSET REGISTRY */}
            <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-lg font-bold text-zinc-900 tracking-tight uppercase">Asset Registry</h2>
                        <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mt-1">Live market inventory monitoring</p>
                    </div>
                    <div className="bg-zinc-900 text-white px-4 py-1.5 rounded text-[10px] font-bold tracking-widest border border-zinc-900">
                        {stocks.length} LISTED
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {stocks.map((stock) => (
                        <div key={stock._id} className="group bg-zinc-50/50 rounded-xl p-6 border border-zinc-100 hover:bg-white hover:shadow-md hover:border-zinc-300 transition-all duration-300 relative overflow-hidden">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-10 h-10 bg-white rounded border border-zinc-200 flex items-center justify-center text-zinc-900 text-lg font-bold shadow-sm group-hover:scale-105 transition-transform">
                                    {stock.symbol?.charAt(0)}
                                </div>
                                <span className="bg-zinc-100 text-zinc-500 text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded border border-zinc-200">
                                    {stock.category}
                                </span>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-zinc-900 leading-none mb-1.5">{stock.symbol}</h3>
                                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider truncate">{stock.stockName}</p>
                            </div>

                            <div className="flex items-end justify-between pt-4 border-t border-zinc-100">
                                <div>
                                    <p className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest mb-0.5">Market Cap</p>
                                    <p className="text-lg font-bold text-zinc-900">₹{stock.price?.toLocaleString('en-IN')}</p>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                                    (stock.priceChange || 0) >= 0
                                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                        : 'bg-rose-50 text-rose-600 border-rose-100'
                                }`}>
                                    {(stock.priceChange || 0) >= 0 ? '+' : ''}{stock.priceChange?.toFixed(2)}%
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StockManager;