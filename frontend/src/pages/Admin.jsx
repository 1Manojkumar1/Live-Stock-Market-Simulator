import React, { useState } from 'react';
import UsersList from '../components/Admin/UsersList';

import SystemLogs from '../components/Admin/SystemLogs';
import Admindashboard from '../components/Admin/Admindashboard';
import SystemSettings from '../components/Admin/SystemSettings';
import RewardsSettings from '../components/Admin/RewardsSettings';
import { LayoutGrid, Users, History, Settings, Gift } from 'lucide-react';

const Admin = () => {
    const [activeTab, setActiveTab] = useState('overview');

    const tabs = [
        { id: 'overview', name: 'Overview', icon: <LayoutGrid size={20} /> },
        { id: 'users', name: 'User Management', icon: <Users size={20} /> },
        { id: 'transactions', name: 'Audit Logs', icon: <History size={20} /> },
        { id: 'rewards', name: 'Rewards Management', icon: <Gift size={20} /> },
        { id: 'settings', name: 'System Settings', icon: <Settings size={20} /> },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'overview': return <Admindashboard onNavigate={setActiveTab} />;
            case 'users': return <UsersList />;
            case 'transactions': return <SystemLogs />;
            case 'rewards': return <RewardsSettings />;
            case 'settings': return <SystemSettings />;
            default: return <Admindashboard onNavigate={setActiveTab} />;
        }
    };



    return (
        <div className="min-h-screen bg-zinc-50/50">
            {/* Sub-navigation for Admin Sections */}
            <div className="bg-white border-b border-zinc-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 lg:px-6">
                    <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-0.5">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 py-4 px-1 border-b-2 transition-all font-bold text-[10px] uppercase tracking-wider whitespace-nowrap ${
                                    activeTab === tab.id
                                        ? 'border-zinc-900 text-zinc-900'
                                        : 'border-transparent text-zinc-400 hover:text-zinc-600'
                                }`}
                            >
                                {React.cloneElement(tab.icon, { size: 14 })}
                                {tab.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <main className="animate-in fade-in duration-300">
                {renderContent()}
            </main>
        </div>
    );
};

export default Admin;
