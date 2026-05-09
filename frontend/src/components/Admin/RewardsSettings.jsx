import React, { useState, useEffect } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";
import { Gift, Save, Edit3, Clock, Trophy, Medal, Calendar } from 'lucide-react';


const RewardsSettings = () => {
    const [settings, setSettings] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('weekly'); 

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const res = await api.get("/admin-api/settings");
            setSettings(res.data);
        } catch (err) {
            console.error("Failed to fetch reward settings", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await api.put("/admin-api/settings", settings);
            setIsEditing(false);
            toast.success("Reward settings updated successfully!");
        } catch (err) {
            toast.error("Failed to update settings");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-black"></div>
            </div>
        );
    }

    const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    // Helper to get nested values with defaults
    const getVal = (key, def) => settings[key] ?? def;

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-8">
            <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                    <div>
                        <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
                            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
                                <Gift size={24} />
                            </div>
                            Rewards Management
                        </h3>
                        <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-2">Manage periodic incentives for top traders</p>
                    </div>
                    
                    <div className="flex items-center gap-4 bg-gray-100 p-1.5 rounded-2xl">
                        <button 
                            onClick={() => setActiveTab('weekly')}
                            className={`px-6 py-2.5 rounded-xl font-black text-[10px] tracking-widest uppercase transition-all ${
                                activeTab === 'weekly' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            Weekly
                        </button>
                        <button 
                            onClick={() => setActiveTab('monthly')}
                            className={`px-6 py-2.5 rounded-xl font-black text-[10px] tracking-widest uppercase transition-all ${
                                activeTab === 'monthly' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            Monthly
                        </button>
                    </div>

                    <button 
                        onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                        disabled={saving}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-xs tracking-widest uppercase transition-all active:scale-95 ${
                            isEditing 
                                ? 'bg-black text-white hover:bg-gray-800' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        {isEditing ? <Save size={16} /> : <Edit3 size={16} />}
                        {saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Edit Settings'}
                    </button>
                </div>

                {/* TIERED AMOUNTS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {/* 1st Place */}
                    <div className={`p-8 rounded-[2rem] border-2 transition-all ${isEditing ? 'border-yellow-100 bg-yellow-50/20' : 'border-gray-50 bg-gray-50/30'}`}>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-yellow-100 text-yellow-600 rounded-2xl">
                                <Trophy size={20} />
                            </div>
                            <span className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">1st Place</span>
                        </div>
                        {isEditing ? (
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-gray-400">₹</span>
                                <input 
                                    type="number"
                                    value={activeTab === 'weekly' ? getVal('weeklyReward1st', 1000) : getVal('monthlyReward1st', 5000)}
                                    onChange={(e) => setSettings({
                                        ...settings, 
                                        [activeTab === 'weekly' ? 'weeklyReward1st' : 'monthlyReward1st']: Number(e.target.value)
                                    })}
                                    className="w-full bg-white border border-gray-200 rounded-2xl pl-8 pr-4 py-4 font-black text-xl text-gray-900 focus:outline-none"
                                />
                            </div>
                        ) : (
                            <p className="text-4xl font-black text-gray-900">₹{(activeTab === 'weekly' ? getVal('weeklyReward1st', 1000) : getVal('monthlyReward1st', 5000)).toLocaleString()}</p>
                        )}
                    </div>

                    {/* 2nd Place */}
                    <div className={`p-8 rounded-[2rem] border-2 transition-all ${isEditing ? 'border-gray-200 bg-gray-50/50' : 'border-gray-50 bg-gray-50/30'}`}>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-gray-200 text-gray-600 rounded-2xl">
                                <Medal size={20} />
                            </div>
                            <span className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">2nd Place</span>
                        </div>
                        {isEditing ? (
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-gray-400">₹</span>
                                <input 
                                    type="number"
                                    value={activeTab === 'weekly' ? getVal('weeklyReward2nd', 500) : getVal('monthlyReward2nd', 2500)}
                                    onChange={(e) => setSettings({
                                        ...settings, 
                                        [activeTab === 'weekly' ? 'weeklyReward2nd' : 'monthlyReward2nd']: Number(e.target.value)
                                    })}
                                    className="w-full bg-white border border-gray-200 rounded-2xl pl-8 pr-4 py-4 font-black text-xl text-gray-900 focus:outline-none"
                                />
                            </div>
                        ) : (
                            <p className="text-4xl font-black text-gray-900">₹{(activeTab === 'weekly' ? getVal('weeklyReward2nd', 500) : getVal('monthlyReward2nd', 2500)).toLocaleString()}</p>
                        )}
                    </div>

                    {/* 3rd Place */}
                    <div className={`p-8 rounded-[2rem] border-2 transition-all ${isEditing ? 'border-orange-100 bg-orange-50/20' : 'border-gray-50 bg-gray-50/30'}`}>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl">
                                <Medal size={20} />
                            </div>
                            <span className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">3rd Place</span>
                        </div>
                        {isEditing ? (
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-gray-400">₹</span>
                                <input 
                                    type="number"
                                    value={activeTab === 'weekly' ? getVal('weeklyReward3rd', 250) : getVal('monthlyReward3rd', 1000)}
                                    onChange={(e) => setSettings({
                                        ...settings, 
                                        [activeTab === 'weekly' ? 'weeklyReward3rd' : 'monthlyReward3rd']: Number(e.target.value)
                                    })}
                                    className="w-full bg-white border border-gray-200 rounded-2xl pl-8 pr-4 py-4 font-black text-xl text-gray-900 focus:outline-none"
                                />
                            </div>
                        ) : (
                            <p className="text-4xl font-black text-gray-900">₹{(activeTab === 'weekly' ? getVal('weeklyReward3rd', 250) : getVal('monthlyReward3rd', 1000)).toLocaleString()}</p>
                        )}
                    </div>
                </div>

                {/* SCHEDULING SECTION */}
                <div className="bg-gray-50 rounded-[2.5rem] p-8 mb-10 border border-gray-100">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                        <Calendar size={14} />
                        Distribution Schedule
                    </h4>
                    <div className="flex flex-col md:flex-row items-center gap-10">
                        {activeTab === 'weekly' ? (
                            <div className="flex-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Day of the Week</label>
                                <div className="flex flex-wrap gap-2">
                                    {weekDays.map((day, idx) => (
                                        <button
                                            key={day}
                                            disabled={!isEditing}
                                            onClick={() => setSettings({...settings, weeklyDistributionDay: idx})}
                                            className={`px-4 py-2 rounded-xl font-black text-[10px] tracking-widest uppercase transition-all ${
                                                getVal('weeklyDistributionDay', 0) === idx 
                                                    ? 'bg-black text-white' 
                                                    : 'bg-white text-gray-400 border border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            {day.slice(0, 3)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Day of the Month (1-31)</label>
                                <input 
                                    type="number"
                                    min="1"
                                    max="31"
                                    disabled={!isEditing}
                                    value={getVal('monthlyDistributionDate', 1)}
                                    onChange={(e) => setSettings({...settings, monthlyDistributionDate: Number(e.target.value)})}
                                    className="bg-white border border-gray-200 rounded-xl px-6 py-3 font-black text-gray-900 focus:outline-none w-32"
                                />
                            </div>
                        )}
                        <div className="p-6 bg-white rounded-2xl border border-gray-100 flex-1">
                            <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-2">Automated Info</p>
                            <p className="text-xs text-gray-500 leading-relaxed font-medium">
                                The system will automatically credit the top 3 traders every 
                                <span className="text-gray-900 font-black"> {activeTab === 'weekly' ? weekDays[getVal('weeklyDistributionDay', 0)] : `day ${getVal('monthlyDistributionDate', 1)} of the month`}</span>.
                            </p>
                        </div>
                    </div>
                </div>

                {(activeTab === 'weekly' ? settings.lastWeeklyDistribution : settings.lastMonthlyDistribution) && (
                    <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">
                        <Clock size={12} />
                        Last {activeTab} distribution: {new Date(activeTab === 'weekly' ? settings.lastWeeklyDistribution : settings.lastMonthlyDistribution).toLocaleString()}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RewardsSettings;
