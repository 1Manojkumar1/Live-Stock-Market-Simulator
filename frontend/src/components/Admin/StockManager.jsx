import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Package, TrendingUp, Plus, RefreshCw, Layers, DollarSign, Activity, Tag, Trash2 } from 'lucide-react';

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
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
        );
    }

    return (
        <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* CREATE ASSET */}
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-10">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="p-4 bg-black text-white rounded-[1.5rem] shadow-xl shadow-black/10">
                            <Plus size={28} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Forge New Asset</h2>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">List a new company on the exchange</p>
                        </div>
                    </div>

                    <form onSubmit={handleAddStock} className="grid grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Unique Asset Identifier</label>
                            <input
                                type="text"
                                name="stockid"
                                value={newStock.stockid}
                                onChange={handleNewStockChange}
                                placeholder="ID-7721-MARKET"
                                required
                                className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-6 py-4 focus:bg-white focus:border-black transition-all outline-none font-black"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Trading Symbol</label>
                            <input
                                type="text"
                                name="symbol"
                                value={newStock.symbol}
                                onChange={handleNewStockChange}
                                placeholder="TICKER"
                                required
                                className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-6 py-4 focus:bg-white focus:border-black transition-all outline-none font-black"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Base Valuation (₹)</label>
                            <input
                                type="number"
                                name="price"
                                value={newStock.price}
                                onChange={handleNewStockChange}
                                placeholder="100.00"
                                required
                                className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-6 py-4 focus:bg-white focus:border-black transition-all outline-none font-black"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Entity Full Name</label>
                            <input
                                type="text"
                                name="stockName"
                                value={newStock.stockName}
                                onChange={handleNewStockChange}
                                placeholder="Global Industries Corp."
                                required
                                className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-6 py-4 focus:bg-white focus:border-black transition-all outline-none font-black"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Market Classification</label>
                            <select
                                name="category"
                                value={newStock.category}
                                onChange={handleNewStockChange}
                                required
                                className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-6 py-4 focus:bg-white focus:border-black transition-all outline-none font-black appearance-none shadow-inner cursor-pointer"
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
                            className="col-span-2 bg-black text-white font-black py-5 rounded-[1.5rem] shadow-2xl shadow-black/20 hover:bg-gray-800 transition-all active:scale-95 mt-4 tracking-[0.2em] uppercase text-sm"
                        >
                            Authorize Listing
                        </button>
                    </form>
                </div>

                {/* PRICE CALIBRATION */}
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-10 h-fit">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="p-4 bg-black text-white rounded-[1.5rem] shadow-xl shadow-black/10">
                            <RefreshCw size={28} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Calibrate Value</h2>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Manual market price override</p>
                        </div>
                    </div>

                    <form onSubmit={handleUpdatePrice} className="space-y-8">
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Target Asset</label>
                            <select
                                name="stockId"
                                value={updateData.stockId}
                                onChange={handleUpdateChange}
                                required
                                className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-6 py-4 focus:bg-white focus:border-black transition-all outline-none font-black appearance-none shadow-inner cursor-pointer"
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
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">New Market Valuation (₹)</label>
                            <input
                                type="number"
                                name="newPrice"
                                value={updateData.newPrice}
                                onChange={handleUpdateChange}
                                placeholder="0.00"
                                required
                                className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-6 py-4 focus:bg-white focus:border-black transition-all outline-none font-black"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-black text-white font-black py-5 rounded-[1.5rem] shadow-2xl shadow-black/20 hover:bg-gray-800 transition-all active:scale-95 tracking-[0.2em] uppercase text-sm"
                        >
                            Commit Valuation
                        </button>
                    </form>
                </div>
            </div>

            {/* ASSET REGISTRY */}
            <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 p-10">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Asset Registry</h2>
                        <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mt-1">Live market inventory monitoring</p>
                    </div>
                    <div className="bg-black text-white px-8 py-3 rounded-2xl text-xs font-black tracking-[0.2em] shadow-xl shadow-black/10">
                        {stocks.length} LISTED ENTITIES
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {stocks.map((stock) => (
                        <div key={stock._id} className="group bg-gray-50/50 rounded-[2rem] p-8 border border-transparent hover:bg-white hover:shadow-2xl hover:border-gray-100 transition-all duration-500 relative overflow-hidden">
                            <div className="flex justify-between items-start mb-8 relative z-10">
                                <div className="w-16 h-16 bg-white rounded-[1.2rem] flex items-center justify-center text-gray-900 text-2xl font-black shadow-lg shadow-black/5 group-hover:scale-110 transition-transform">
                                    {stock.symbol?.charAt(0)}
                                </div>
                                <span className="bg-gray-900 text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full">
                                    {stock.category}
                                </span>
                            </div>

                            <div className="mb-8 relative z-10">
                                <h3 className="text-2xl font-black text-gray-900 leading-none mb-2">{stock.symbol}</h3>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider truncate">{stock.stockName}</p>
                            </div>

                            <div className="flex items-end justify-between pt-6 border-t border-gray-100 relative z-10">
                                <div>
                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Market Cap Per Unit</p>
                                    <p className="text-2xl font-black text-black">₹{stock.price?.toLocaleString('en-IN')}</p>
                                </div>
                                <span className={`text-xs font-black px-3 py-1.5 rounded-full ${
                                    (stock.priceChange || 0) >= 0
                                        ? 'bg-green-50 text-green-600 border border-green-100'
                                        : 'bg-red-50 text-red-600 border border-red-100'
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