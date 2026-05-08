import React, { useState } from 'react';
import UsersList from '../components/Admin/UsersList';
import StockManager from '../components/Admin/StockManager';
import SystemLogs from '../components/Admin/SystemLogs';
import Admindashboard from '../components/Admin/Admindashboard';
import SystemSettings from '../components/Admin/SystemSettings';
import { LayoutGrid, Users, Package, History, Settings } from 'lucide-react';

const Admin = () => {
    const [activeTab, setActiveTab] = useState('overview');

    const tabs = [
        { id: 'overview', name: 'Overview', icon: <LayoutGrid size={20} /> },
        { id: 'users', name: 'User Management', icon: <Users size={20} /> },
        { id: 'stocks', name: 'Stock Inventory', icon: <Package size={20} /> },
        { id: 'transactions', name: 'Audit Logs', icon: <History size={20} /> },
        { id: 'settings', name: 'System Settings', icon: <Settings size={20} /> },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'overview': return <Admindashboard onNavigate={setActiveTab} />;
            case 'users': return <UsersList />;
            case 'stocks': return <StockManager />;
            case 'transactions': return <SystemLogs />;
            case 'settings': return <SystemSettings />;
            default: return <Admindashboard onNavigate={setActiveTab} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Sub-navigation for Admin Sections */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex items-center gap-8 overflow-x-auto no-scrollbar py-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 py-5 px-2 border-b-2 transition-all font-black text-xs uppercase tracking-widest whitespace-nowrap ${
                                    activeTab === tab.id
                                        ? 'border-black text-black'
                                        : 'border-transparent text-gray-400 hover:text-gray-600'
                                }`}
                            >
                                {tab.icon}
                                {tab.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <main className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                {renderContent()}
            </main>
        </div>
    );
};

export default Admin;
