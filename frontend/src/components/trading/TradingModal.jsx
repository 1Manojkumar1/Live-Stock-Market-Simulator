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
        <div className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden border border-zinc-200 animate-in zoom-in-95 duration-200">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${
                            type === 'BUY' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                        }`}>
                            Market {type} Order
                        </div>
                        <button onClick={onClose} className="p-1.5 hover:bg-zinc-100 rounded-lg transition-colors text-zinc-400">
                            <X size={16} />
                        </button>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-xl font-bold text-zinc-900 tracking-tight leading-none mb-1.5">{stock.symbol}</h3>
                        <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">{stock.stockName}</p>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-zinc-50/50 p-5 rounded-lg border border-zinc-100">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Market Price</span>
                                <span className="text-lg font-bold text-zinc-900">₹{stock.price?.toLocaleString('en-IN')}</span>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-widest ml-0.5">Quantity to {type}</label>
                                <input
                                    type="number"
                                    min="1"
                                    max={type === 'SELL' ? maxSell : undefined}
                                    value={quantity}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value) || 0;
                                        setQuantity(type === 'SELL' ? Math.max(0, Math.min(val, maxSell)) : Math.max(0, val));
                                    }}
                                    className="w-full bg-white border border-zinc-200 rounded-lg px-4 py-2.5 focus:ring-1 focus:ring-zinc-900 transition-all outline-none font-bold text-xl text-center shadow-inner"
                                />
                            </div>
                        </div>

                        <div className="space-y-2.5 px-1">
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-bold text-zinc-400 uppercase tracking-widest text-[9px]">
                                    {type === 'SELL' ? 'Est. Sale Value' : 'Est. Total Cost'}
                                </span>
                                <span className="font-bold text-zinc-900">₹{totalCost.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="flex items-center gap-1.5 font-bold text-zinc-400 uppercase tracking-widest text-[9px]">
                                    <Wallet size={12} />
                                    Balance
                                </span>
                                <span className="font-bold text-zinc-900">₹{user?.balance?.toLocaleString('en-IN')}</span>
                            </div>
                            {type === 'SELL' && ownedQty !== null && (
                                <div className="flex justify-between items-center text-xs">
                                    <span className="flex items-center gap-1.5 font-bold text-zinc-400 uppercase tracking-widest text-[9px]">
                                        <Layers size={12} />
                                        Holdings
                                    </span>
                                    <span className="font-bold text-zinc-900">{ownedQty} shares</span>
                                </div>
                            )}
                        </div>

                        {type === 'BUY' && !isAffordable && (
                            <div className="bg-rose-50 text-rose-600 p-3 rounded-lg text-[10px] font-bold flex items-center gap-2 border border-rose-100">
                                <Info size={14} />
                                Insufficient balance for this transaction.
                            </div>
                        )}

                        {type === 'SELL' && cantSell && (
                            <div className="bg-rose-50 text-rose-600 p-3 rounded-lg text-[10px] font-bold flex items-center gap-2 border border-rose-100">
                                <Info size={14} />
                                You don't own this stock. Visit the Market to buy.
                            </div>
                        )}

                        <button
                            onClick={handleTrade}
                            disabled={loading || (type === 'BUY' && !isAffordable) || (type === 'SELL' && cantSell)}
                            className={`w-full py-3.5 rounded-lg font-bold text-sm shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2 ${
                                type === 'BUY' 
                                    ? 'bg-zinc-900 text-white hover:bg-zinc-800 disabled:bg-zinc-100 disabled:text-zinc-400 disabled:shadow-none' 
                                    : 'bg-zinc-900 text-white hover:bg-zinc-800 disabled:bg-zinc-100 disabled:text-zinc-400 disabled:shadow-none'
                            }`}
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                            ) : (
                                <>
                                    Confirm {type}
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <div className="bg-zinc-50/50 p-5 text-center border-t border-zinc-100">
                    <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest leading-relaxed px-4">
                        Market orders are executed at the current live price. 
                        Trading involves financial risk.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TradingModal;
