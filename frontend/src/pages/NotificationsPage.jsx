import React from 'react';
import NotificationCenter from '../components/dashboard/NotificationCenter';
import { Bell, ShieldCheck } from 'lucide-react';

const NotificationsPage = () => {
    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* Page Header */}
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-zinc-900 text-white rounded-2xl shadow-lg shadow-zinc-200">
                        <Bell size={24} />
                    </div>
                    <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Social Notifications</h1>
                </div>
                <p className="text-zinc-500 font-medium max-w-xl">
                    Track real-time moves from the traders you follow and stay ahead of market trends.
                </p>
            </div>

            {/* Notification Center */}
            <NotificationCenter />

            {/* Footer / Tip */}
            <div className="bg-zinc-50 border border-zinc-100 p-6 rounded-3xl flex items-start gap-4">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                    <ShieldCheck size={20} />
                </div>
                <div>
                    <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Trading Tip</h4>
                    <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                        Don't just copy—analyze! Use these alerts to understand the logic behind a top trader's decisions. Check their Public Profile to see their long-term ROI before following their moves.
                    </p>
                </div>
            </div>

        </div>
    );
};

export default NotificationsPage;
