import React, { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { Wallet, Plus, ArrowUpRight, ShieldCheck } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const WalletCard = () => {
    const { user, setUser } = useContext(AuthContext);
    const [amount, setAmount] = useState('');
    const [showAdd, setShowAdd] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleAddFunds = async (e) => {
        e.preventDefault();
        if (!amount || isNaN(amount) || amount <= 0) return;

        try {
            setLoading(true);
            const res = await api.post('/user-api/add-funds', {
                userId: user.id || user._id,
                amount: Number(amount)
            });
            
            setUser({ ...user, balance: res.data.newBalance });
            toast.success(`₹${amount} added to your wallet!`);
            setAmount('');
            setShowAdd(false);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to add funds');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-zinc-900 text-white rounded-xl p-5 shadow-sm relative overflow-hidden group">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all duration-500"></div>
            
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div className="p-2.5 bg-white/10 rounded-lg backdrop-blur-md">
                        <Wallet className="text-white" size={18} />
                    </div>
                    <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full text-[10px] font-bold border border-emerald-500/20">
                        <ShieldCheck size={12} />
                        Verified
                    </div>
                </div>

                <p className="text-zinc-400 text-[10px] font-bold mb-1 uppercase tracking-wider">Available Balance</p>
                <h2 className="text-2xl font-bold mb-5 tracking-tight">
                    ₹{user?.balance?.toLocaleString('en-IN') || '0'}
                </h2>

                {!showAdd ? (
                    <button 
                        onClick={() => setShowAdd(true)}
                        className="flex items-center gap-2 bg-white text-zinc-900 px-4 py-2 rounded-lg font-bold text-xs hover:bg-zinc-100 transition-all active:scale-95 shadow-sm"
                    >
                        <Plus size={14} />
                        Add Funds
                    </button>
                ) : (
                    <form onSubmit={handleAddFunds} className="flex gap-2 animate-in fade-in slide-in-from-bottom-1 duration-200">
                        <input
                            type="number"
                            placeholder="Amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:ring-1 focus:ring-white/50 w-24"
                            autoFocus
                        />
                        <button 
                            type="submit"
                            disabled={loading}
                            className="bg-white text-zinc-900 px-3 py-1.5 rounded-lg font-bold text-xs hover:bg-zinc-100 disabled:opacity-50"
                        >
                            {loading ? '...' : 'Add'}
                        </button>
                        <button 
                            type="button"
                            onClick={() => setShowAdd(false)}
                            className="text-white/60 hover:text-white px-1 text-xs"
                        >
                            Cancel
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default WalletCard;