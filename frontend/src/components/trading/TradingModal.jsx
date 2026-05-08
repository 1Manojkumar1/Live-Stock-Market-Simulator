import { useState, useEffect, useContext } from 'react';
import api from '../../services/api';
import { AuthContext } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { X, ArrowRight, Wallet, Info, Layers } from 'lucide-react';

const TradingModal = ({ stock, type, onClose, onRefresh }) => {
    const { user, setUser } = useContext(AuthContext);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const [ownedQty, setOwnedQty] = useState(null);

    const userId = user?.id || user?._id;
    const totalCost = quantity * (stock?.price || 0);
    const isAffordable = type === 'BUY' ? user?.balance >= totalCost : true;
    const maxSell = ownedQty ?? Infinity;

    useEffect(() => {
        if (type !== 'SELL' || !userId || !stock?._id) return;
        const fetchHolding = async () => {
            try {
                const res = await api.get(`/user-api/portfolio/${userId}`);
                const holding = res.data.portfolio?.find(p => p.stock?._id === stock._id);
                setOwnedQty(holding?.quantity || 0);
            } catch (err) {
                console.error(err);
                setOwnedQty(0);
            }
        };
        fetchHolding();
    }, [type, userId, stock?._id]);

    const handleTrade = async () => {
        if (quantity <= 0) return toast.error("Quantity must be greater than 0");
        if (type === 'SELL' && quantity > maxSell) return toast.error(`You only have ${maxSell} shares to sell`);
        if (type === 'BUY' && !isAffordable) return toast.error("Insufficient balance");

        try {
            setLoading(true);
            const endpoint = type === 'BUY' ? '/user-api/buy' : '/user-api/sell';
            const payload = { userId, stockId: stock._id, quantity: Number(quantity) };

            const res = await api.post(endpoint, payload);
            toast.success(`${type} order executed for ${quantity} shares of ${stock.symbol}`);

            setUser({ ...user, balance: res.data.newBalance });
            if (onRefresh) onRefresh();
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.message || `Failed to ${type.toLowerCase()} stock`);
        } finally {
            setLoading(false);
        }
    };

    const cantSell = type === 'SELL' && ownedQty === 0;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-100 flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-300">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
                            type === 'BUY' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}>
                            Market {type} Order
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-3xl font-black text-gray-900 tracking-tight mb-1">{stock.symbol}</h3>
                        <p className="text-gray-500 font-medium">{stock.stockName}</p>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Market Price</span>
                                <span className="text-xl font-black text-gray-900">₹{stock.price?.toLocaleString('en-IN')}</span>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Quantity to {type}</label>
                                <input
                                    type="number"
                                    min="1"
                                    max={type === 'SELL' ? maxSell : undefined}
                                    value={quantity}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value) || 0;
                                        setQuantity(type === 'SELL' ? Math.max(0, Math.min(val, maxSell)) : Math.max(0, val));
                                    }}
                                    className="w-full bg-white border-2 border-gray-100 rounded-2xl px-5 py-4 focus:border-black transition-all outline-none font-black text-2xl text-center"
                                />
                            </div>
                        </div>

                        <div className="space-y-3 px-2">
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-bold text-gray-400">
                                    {type === 'SELL' ? 'Total Sale Value' : 'Total Est. Cost'}
                                </span>
                                <span className="font-black text-gray-900">₹{totalCost.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="flex items-center gap-1.5 font-bold text-gray-400">
                                    <Wallet size={14} />
                                    Available Balance
                                </span>
                                <span className="font-black text-gray-900">₹{user?.balance?.toLocaleString('en-IN')}</span>
                            </div>
                            {type === 'SELL' && ownedQty !== null && (
                                <div className="flex justify-between items-center text-sm">
                                    <span className="flex items-center gap-1.5 font-bold text-gray-400">
                                        <Layers size={14} />
                                        Your Holdings
                                    </span>
                                    <span className="font-black text-gray-900">{ownedQty} shares</span>
                                </div>
                            )}
                        </div>

                        {type === 'BUY' && !isAffordable && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold flex items-center gap-2 border border-red-100">
                                <Info size={16} />
                                Insufficient balance for this transaction.
                            </div>
                        )}

                        {type === 'SELL' && cantSell && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold flex items-center gap-2 border border-red-100">
                                <Info size={16} />
                                You don't own this stock. Visit the Market to buy.
                            </div>
                        )}

                        <button
                            onClick={handleTrade}
                            disabled={loading || (type === 'BUY' && !isAffordable) || (type === 'SELL' && cantSell)}
                            className={`w-full py-5 rounded-3xl font-black text-lg shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 ${
                                type === 'BUY' 
                                    ? 'bg-green-600 text-white shadow-green-200 hover:bg-green-700 disabled:bg-gray-200 disabled:shadow-none' 
                                    : 'bg-red-500 text-white shadow-red-200 hover:bg-red-600 disabled:bg-gray-200 disabled:shadow-none'
                            }`}
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-6 w-6 border-2 border-white/30 border-t-white"></div>
                            ) : (
                                <>
                                    CONFIRM {type}
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <div className="bg-gray-50 p-6 text-center border-t border-gray-100">
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest leading-relaxed">
                        By confirming, you agree to execute this market order at the current live price. 
                        Trading involves risk.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TradingModal;
