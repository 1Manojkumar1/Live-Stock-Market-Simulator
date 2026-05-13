import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, BellOff, Trash2, CheckCircle, ExternalLink, Clock, Trash } from 'lucide-react';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../services/api';
import Loader from '../Loader';
import toast from 'react-hot-toast';

const NotificationCenter = () => {
    const { user } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchNotifications();
    }, [user?._id]);

    const fetchNotifications = async () => {
        if (!user?._id) return;
        try {
            const res = await api.get(`/user-api/notifications/${user._id}`);
            setNotifications(res.data.notifications);
        } catch (err) {
            console.error("Failed to fetch notifications", err);
        } finally {
            setLoading(false);
        }
    };

    const deleteNotification = async (id) => {
        try {
            await api.delete(`/user-api/notifications/${id}`);
            setNotifications(notifications.filter(n => n._id !== id));
            toast.success("Notification cleared");
        } catch (err) {
            toast.error("Failed to delete");
        }
    };

    const clearAll = async () => {
        try {
            await api.delete(`/user-api/notifications/clear/${user._id}`);
            setNotifications([]);
            toast.success("Inbox cleared");
        } catch (err) {
            toast.error("Failed to clear inbox");
        }
    };

    if (loading) return <div className="h-64 flex items-center justify-center"><Loader /></div>;

    return (
        <div className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
            {/* Header */}
            <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-zinc-900 text-white rounded-xl">
                        <Bell size={18} />
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-zinc-900 tracking-tight">Social Alerts</h2>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Stay updated with followed traders</p>
                    </div>
                </div>
                {notifications.length > 0 && (
                    <button 
                        onClick={clearAll}
                        className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-100 transition-all active:scale-95"
                    >
                        <Trash size={14} />
                        Clear All
                    </button>
                )}
            </div>

            {/* List */}
            <div className="divide-y divide-zinc-100 max-h-[500px] overflow-y-auto custom-scrollbar">
                {notifications.length > 0 ? (
                    notifications.map((n) => (
                        <div key={n._id} className="p-5 flex items-start justify-between group hover:bg-zinc-50/50 transition-all">
                            <div className="flex gap-4">
                                <div className={`mt-1 p-2 rounded-full ${
                                    n.type === 'TRADE' ? 'bg-amber-50 text-amber-600' : 'bg-zinc-100 text-zinc-400'
                                }`}>
                                    <CheckCircle size={16} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-zinc-900">{n.title}</p>
                                    <p className="text-xs text-zinc-500 leading-relaxed max-w-md">{n.message}</p>
                                    <div className="flex items-center gap-3 pt-2">
                                        <div className="flex items-center gap-1 text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                                            <Clock size={12} />
                                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        {n.data?.traderId && (
                                            <button 
                                                onClick={() => navigate(`/profile/${n.data.traderId}`)}
                                                className="flex items-center gap-1 text-[9px] font-black text-zinc-900 uppercase tracking-widest hover:underline"
                                            >
                                                <ExternalLink size={10} />
                                                View Trader
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <button 
                                onClick={() => deleteNotification(n._id)}
                                className="opacity-0 group-hover:opacity-100 p-2 hover:bg-zinc-100 text-zinc-400 hover:text-rose-500 rounded-lg transition-all"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="py-20 flex flex-col items-center justify-center text-center px-10">
                        <div className="w-16 h-16 bg-zinc-50 rounded-3xl flex items-center justify-center text-zinc-200 mb-4 border border-zinc-100">
                            <BellOff size={32} />
                        </div>
                        <h3 className="text-sm font-black text-zinc-900 mb-1 uppercase tracking-tight">Your Inbox is Empty</h3>
                        <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest leading-loose max-w-[200px]">
                            Follow top traders to see their moves here in real-time.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationCenter;
