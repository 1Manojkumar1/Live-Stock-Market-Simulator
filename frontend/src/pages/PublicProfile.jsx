import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { User, Briefcase, TrendingUp, Calendar, ArrowUpRight, ArrowDownRight, UserPlus, UserMinus, Activity, Globe } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

const PublicProfile = () => {
    const { userId } = useParams();
    const { user: currentUser } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get(`/user-api/profile/${userId}`);
                setProfile(res.data);
                
                if (currentUser && currentUser._id !== userId) {
                    const statusRes = await api.get(`/user-api/follow-status?followerId=${currentUser._id}&followingId=${userId}`);
                    setIsFollowing(statusRes.data.isFollowing);
                }
            } catch (err) {
                console.error("Failed to fetch profile", err);
                toast.error("Profile not found");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [userId, currentUser]);

    const handleFollow = async () => {
        try {
            if (isFollowing) {
                await api.post('/user-api/unfollow', { followerId: currentUser._id, followingId: userId });
                toast.success(`Unfollowed ${profile.user.name}`);
            } else {
                await api.post('/user-api/follow', { followerId: currentUser._id, followingId: userId });
                toast.success(`Following ${profile.user.name}`);
            }
            setIsFollowing(!isFollowing);
        } catch (err) {
            toast.error("Action failed");
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center"><Loader /></div>;
    if (!profile) return <div className="h-screen flex items-center justify-center text-zinc-400">Profile not found</div>;

    const { user, holdings, recentActivity } = profile;

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
            
            {/* Profile Header */}
            <div className="bg-white rounded-3xl p-8 border border-zinc-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-zinc-900 rounded-2xl flex items-center justify-center text-white text-3xl font-black">
                        {user.name.charAt(0)}
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-2xl font-black text-zinc-900">{user.name}</h1>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black tracking-widest uppercase ${
                                user.sentiment === 'BULLISH' ? 'bg-emerald-50 text-emerald-600' : 
                                user.sentiment === 'BEARISH' ? 'bg-rose-50 text-rose-600' : 'bg-zinc-100 text-zinc-500'
                            }`}>
                                {user.sentiment}
                            </span>
                        </div>
                        <div className="flex items-center gap-4 text-zinc-400 text-xs font-bold uppercase tracking-widest">
                            <span className="flex items-center gap-1.5"><Calendar size={14} /> Joined {new Date(user.joinedAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                {currentUser && currentUser._id !== userId && (
                    <button 
                        onClick={handleFollow}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all active:scale-95 ${
                            isFollowing 
                            ? 'bg-zinc-100 text-zinc-600 border border-zinc-200 hover:bg-zinc-200' 
                            : 'bg-zinc-900 text-white hover:bg-zinc-800 shadow-lg shadow-zinc-200'
                        }`}
                    >
                        {isFollowing ? <UserMinus size={16} /> : <UserPlus size={16} />}
                        {isFollowing ? 'Unfollow' : 'Follow Trader'}
                    </button>
                )}
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Trader ROI</p>
                    <p className={`text-3xl font-black ${user.roi >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                        {user.roi >= 0 ? '+' : ''}{user.roi}%
                    </p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Stocks Owned</p>
                    <p className="text-3xl font-black text-zinc-900">{holdings.length}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Activity Level</p>
                    <div className="flex items-center gap-2 text-xl font-bold text-zinc-900">
                        <Activity size={20} className="text-amber-500" />
                        {recentActivity.length > 5 ? 'Very Active' : 'Strategic'}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Holdings Table */}
                <div className="space-y-4">
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2 px-2">
                        <Briefcase size={14} />
                        Current Holdings
                    </h3>
                    <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-zinc-50 border-b border-zinc-200">
                                <tr>
                                    <th className="px-4 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Asset</th>
                                    <th className="px-4 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Qty</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                                {holdings.length > 0 ? holdings.map((h, i) => (
                                    <tr key={i} className="hover:bg-zinc-50 transition-colors">
                                        <td className="px-4 py-4">
                                            <p className="font-black text-zinc-900 text-sm tracking-tight">{h.symbol}</p>
                                            <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">{h.category}</p>
                                        </td>
                                        <td className="px-4 py-4 text-right font-bold text-zinc-900 text-sm">
                                            {h.quantity}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="2" className="px-4 py-8 text-center text-zinc-400 text-xs font-bold uppercase tracking-widest">No active holdings</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="space-y-4">
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2 px-2">
                        <TrendingUp size={14} />
                        Recent Moves
                    </h3>
                    <div className="space-y-3">
                        {recentActivity.length > 0 ? recentActivity.map((a, i) => (
                            <div key={i} className="bg-white p-4 rounded-2xl border border-zinc-200 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${a.type === 'BUY' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                        {a.type === 'BUY' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-zinc-900">{a.type === 'BUY' ? 'Purchased Asset' : 'Liquidated Position'}</p>
                                        <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{new Date(a.timestamp).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <p className="text-xs font-black text-zinc-900">₹{a.price}</p>
                            </div>
                        )) : (
                            <div className="bg-white p-8 rounded-2xl border border-zinc-200 text-center text-zinc-400 text-xs font-bold uppercase tracking-widest">No recent trades</div>
                        )}
                    </div>
                </div>

            </div>

        </div>
    );
};

export default PublicProfile;
