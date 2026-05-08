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
        <div className="bg-black text-white rounded-3xl p-6 shadow-xl relative overflow-hidden group">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-500"></div>
            
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                    <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                        <Wallet className="text-white" size={24} />
                    </div>
                    <div className="flex items-center gap-2 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-500/30">
                        <ShieldCheck size={14} />
                        Verified Account
                    </div>
                </div>

                <p className="text-gray-400 text-sm font-medium mb-1 uppercase tracking-widest">Available Balance</p>
                <h2 className="text-4xl font-black mb-6 tracking-tight">
                    ₹{user?.balance?.toLocaleString('en-IN') || '0'}
                </h2>

                {!showAdd ? (
                    <button 
                        onClick={() => setShowAdd(true)}
                        className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-2xl font-bold text-sm hover:bg-gray-100 transition-all active:scale-95"
                    >
                        <Plus size={18} />
                        Add Funds
                    </button>
                ) : (
                    <form onSubmit={handleAddFunds} className="flex gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <input
                            type="number"
                            placeholder="Amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="bg-white/10 border border-white/20 rounded-2xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/50 w-32"
                            autoFocus
                        />
                        <button 
                            type="submit"
                            disabled={loading}
                            className="bg-white text-black px-4 py-2 rounded-2xl font-bold text-sm hover:bg-gray-100 disabled:opacity-50"
                        >
                            {loading ? '...' : 'Add'}
                        </button>
                        <button 
                            type="button"
                            onClick={() => setShowAdd(false)}
                            className="text-white/60 hover:text-white px-2 py-2"
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