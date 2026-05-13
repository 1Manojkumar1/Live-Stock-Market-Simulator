import React, { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { Wallet, LifeBuoy } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const WalletCard = () => {
    const { user, setUser } = useContext(AuthContext);
    const [amount, setAmount] = useState('');
    const [showAdd, setShowAdd] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleRescue = async () => {
        if (!window.confirm("Are you sure? This will restore your balance to ₹1,00,000 and reset your session ROI.")) return;

        try {
            setLoading(true);
            const res = await api.post('/user-api/rescue-reset', {
                userId: user.id || user._id
            });
            
            setUser({ ...user, balance: res.data.newBalance });
            toast.success("Rescue mission successful! Balance restored.");
        } catch (err) {
            toast.error(err.response?.data?.message || 'Rescue failed');
        } finally {
            setLoading(false);
        }
    };

    const isEligibleForRescue = (user?.balance < 5000); // We'll assume frontend check for simplicity, backend enforces it strictly

    return (
        <div className="bg-zinc-900 text-white rounded-xl p-5 shadow-sm relative overflow-hidden group">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all duration-500"></div>
            
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div className="p-2.5 bg-white/10 rounded-lg backdrop-blur-md">
                        <Wallet className="text-white" size={18} />
                    </div>
                </div>

                <p className="text-zinc-400 text-[10px] font-bold mb-1 uppercase tracking-wider">Available Balance</p>
                <h2 className="text-2xl font-bold mb-5 tracking-tight">
                    ₹{user?.balance?.toLocaleString('en-IN') || '0'}
                </h2>

                {isEligibleForRescue && (
                    <button 
                        onClick={handleRescue}
                        disabled={loading}
                        className="flex items-center gap-2 bg-amber-500 text-zinc-900 px-4 py-2 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-amber-400 transition-all active:scale-95 shadow-lg shadow-amber-500/20"
                    >
                        {loading ? (
                            <div className="animate-spin rounded-full h-3 w-3 border-2 border-zinc-900/30 border-t-zinc-900"></div>
                        ) : (
                            <LifeBuoy size={14} />
                        )}
                        Request Rescue
                    </button>
                )}

                {!isEligibleForRescue && (
                    <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-bold uppercase tracking-widest bg-white/5 w-fit px-3 py-1.5 rounded-lg border border-white/5">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        Wallet Healthy
                    </div>
                )}
            </div>
        </div>
    );
};

export default WalletCard;