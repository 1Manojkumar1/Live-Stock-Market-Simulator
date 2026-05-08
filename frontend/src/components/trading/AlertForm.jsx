import { useState, useContext } from 'react';
import api from '../../services/api';
import { AuthContext } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { Bell, ArrowUp, ArrowDown, Send, X } from 'lucide-react';

const AlertForm = ({ stockId, symbol, onClose }) => {
    const { user } = useContext(AuthContext);
    const [targetPrice, setTargetPrice] = useState('');
    const [direction, setDirection] = useState('ABOVE');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!targetPrice) return toast.error("Please set a target price");

        try {
            setLoading(true);
            await api.post('/user-api/alerts', {
                userId: user.id || user._id,
                stockId,
                targetPrice: Number(targetPrice),
                direction // 'ABOVE' or 'BELOW'
            });
            toast.success(`Price alert set for ${symbol} at ₹${targetPrice}`);
            if (onClose) onClose();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to set alert");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-110 flex items-center justify-center p-4">
            <div className="bg-white rounded-4xl p-8 border border-gray-100 shadow-2xl max-w-sm w-full animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-yellow-50 text-yellow-600 rounded-2xl">
                            <Bell size={24} />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 tracking-tight">Price Sentinel</h3>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Condition</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setDirection('ABOVE')}
                                className={`flex items-center justify-center gap-2 py-4 rounded-2xl border-2 transition-all font-black text-xs tracking-widest ${
                                    direction === 'ABOVE' 
                                        ? 'bg-black text-white border-black shadow-lg shadow-black/20' 
                                        : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'
                                }`}
                            >
                                <ArrowUp size={16} />
                                ABOVE
                            </button>
                            <button
                                type="button"
                                onClick={() => setDirection('BELOW')}
                                className={`flex items-center justify-center gap-2 py-4 rounded-2xl border-2 transition-all font-black text-xs tracking-widest ${
                                    direction === 'BELOW' 
                                        ? 'bg-black text-white border-black shadow-lg shadow-black/20' 
                                        : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'
                                }`}
                            >
                                <ArrowDown size={16} />
                                BELOW
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Target Price for {symbol} (₹)</label>
                        <input
                            type="number"
                            value={targetPrice}
                            onChange={(e) => setTargetPrice(e.target.value)}
                            placeholder="Enter price threshold"
                            className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-6 py-4 focus:bg-white focus:border-black transition-all outline-none font-black text-xl shadow-inner"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white font-black py-5 rounded-3xl shadow-xl shadow-black/20 hover:bg-gray-800 transition-all active:scale-95 flex items-center justify-center gap-3 mt-4"
                    >
                        {loading ? (
                            <div className="animate-spin rounded-full h-6 w-6 border-2 border-white/30 border-t-white"></div>
                        ) : (
                            <>
                                ARM SENTINEL
                                <Send size={18} />
                            </>
                        )}
                    </button>
                </form>
                
                <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-6">
                    Real-time market surveillance active
                </p>
            </div>
        </div>
    );
};

export default AlertForm;
