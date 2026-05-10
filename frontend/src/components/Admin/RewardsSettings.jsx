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
    <div className="max-w-5xl mx-auto p-4 lg:p-6 space-y-6">
        <div className="bg-white rounded-xl p-6 border border-zinc-200 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                <div>
                    <h3 className="text-lg font-bold text-zinc-900 uppercase tracking-tight flex items-center gap-2">
                        <div className="p-2 bg-zinc-100 text-zinc-600 rounded">
                            <Gift size={16} />
                        </div>
                        Rewards Management
                    </h3>
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1.5">Manage periodic incentives for top traders</p>
                </div>
                    
                <div className="flex items-center gap-2 bg-zinc-100 p-1 rounded-lg">
                    <button 
                        onClick={() => setActiveTab('weekly')}
                        className={`px-4 py-1.5 rounded-md font-bold text-[10px] tracking-wider uppercase transition-all ${
                            activeTab === 'weekly' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'
                        }`}
                    >
                        Weekly
                    </button>
                    <button 
                        onClick={() => setActiveTab('monthly')}
                        className={`px-4 py-1.5 rounded-md font-bold text-[10px] tracking-wider uppercase transition-all ${
                            activeTab === 'monthly' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'
                        }`}
                    >
                        Monthly
                    </button>
                </div>

                <button 
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    disabled={saving}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-[10px] tracking-widest uppercase transition-all active:scale-95 shadow-sm border ${
                        isEditing 
                            ? 'bg-zinc-900 text-white border-zinc-900 hover:bg-zinc-800' 
                            : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-900 hover:text-zinc-900'
                    }`}
                >
                    {isEditing ? <Save size={14} /> : <Edit3 size={14} />}
                    {saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Edit'}
                </button>
            </div>

                {/* TIERED AMOUNTS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* 1st Place */}
                    <div className={`p-6 rounded-xl border transition-all ${isEditing ? 'border-amber-100 bg-amber-50/30' : 'border-zinc-50 bg-zinc-50/50'}`}>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-amber-100 text-amber-600 rounded">
                                <Trophy size={16} />
                            </div>
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">1st Place</span>
                        </div>
                        {isEditing ? (
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-zinc-400 text-sm">₹</span>
                                <input 
                                    type="number"
                                    value={activeTab === 'weekly' ? getVal('weeklyReward1st', 1000) : getVal('monthlyReward1st', 5000)}
                                    onChange={(e) => setSettings({
                                        ...settings, 
                                        [activeTab === 'weekly' ? 'weeklyReward1st' : 'monthlyReward1st']: Number(e.target.value)
                                    })}
                                    className="w-full bg-white border border-zinc-200 rounded-lg pl-6 pr-3 py-2.5 font-bold text-lg text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                                />
                            </div>
                        ) : (
                            <p className="text-2xl font-bold text-zinc-900">₹{(activeTab === 'weekly' ? getVal('weeklyReward1st', 1000) : getVal('monthlyReward1st', 5000)).toLocaleString()}</p>
                        )}
                    </div>

                    {/* 2nd Place */}
                    <div className={`p-6 rounded-xl border transition-all ${isEditing ? 'border-zinc-200 bg-zinc-50/50' : 'border-zinc-50 bg-zinc-50/50'}`}>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-zinc-200 text-zinc-600 rounded">
                                <Medal size={16} />
                            </div>
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">2nd Place</span>
                        </div>
                        {isEditing ? (
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-zinc-400 text-sm">₹</span>
                                <input 
                                    type="number"
                                    value={activeTab === 'weekly' ? getVal('weeklyReward2nd', 500) : getVal('monthlyReward2nd', 2500)}
                                    onChange={(e) => setSettings({
                                        ...settings, 
                                        [activeTab === 'weekly' ? 'weeklyReward2nd' : 'monthlyReward2nd']: Number(e.target.value)
                                    })}
                                    className="w-full bg-white border border-zinc-200 rounded-lg pl-6 pr-3 py-2.5 font-bold text-lg text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                                />
                            </div>
                        ) : (
                            <p className="text-2xl font-bold text-zinc-900">₹{(activeTab === 'weekly' ? getVal('weeklyReward2nd', 500) : getVal('monthlyReward2nd', 2500)).toLocaleString()}</p>
                        )}
                    </div>

                    {/* 3rd Place */}
                    <div className={`p-6 rounded-xl border transition-all ${isEditing ? 'border-orange-100 bg-orange-50/30' : 'border-zinc-50 bg-zinc-50/50'}`}>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-orange-100 text-orange-600 rounded">
                                <Medal size={16} />
                            </div>
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">3rd Place</span>
                        </div>
                        {isEditing ? (
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-zinc-400 text-sm">₹</span>
                                <input 
                                    type="number"
                                    value={activeTab === 'weekly' ? getVal('weeklyReward3rd', 250) : getVal('monthlyReward3rd', 1000)}
                                    onChange={(e) => setSettings({
                                        ...settings, 
                                        [activeTab === 'weekly' ? 'weeklyReward3rd' : 'monthlyReward3rd']: Number(e.target.value)
                                    })}
                                    className="w-full bg-white border border-zinc-200 rounded-lg pl-6 pr-3 py-2.5 font-bold text-lg text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                                />
                            </div>
                        ) : (
                            <p className="text-2xl font-bold text-zinc-900">₹{(activeTab === 'weekly' ? getVal('weeklyReward3rd', 250) : getVal('monthlyReward3rd', 1000)).toLocaleString()}</p>
                        )}
                    </div>
                </div>

                {/* SCHEDULING SECTION */}
                <div className="bg-zinc-50 rounded-xl p-6 mb-8 border border-zinc-100">
                    <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                        <Calendar size={12} />
                        Distribution Schedule
                    </h4>
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        {activeTab === 'weekly' ? (
                            <div className="flex-1">
                                <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-3 block">Payout Day</label>
                                <div className="flex flex-wrap gap-1.5">
                                    {weekDays.map((day, idx) => (
                                        <button
                                            key={day}
                                            disabled={!isEditing}
                                            onClick={() => setSettings({...settings, weeklyDistributionDay: idx})}
                                            className={`px-3 py-1.5 rounded font-bold text-[9px] tracking-wider uppercase transition-all ${
                                                getVal('weeklyDistributionDay', 0) === idx 
                                                    ? 'bg-zinc-900 text-white' 
                                                    : 'bg-white text-zinc-400 border border-zinc-200 hover:border-zinc-400'
                                            }`}
                                        >
                                            {day.slice(0, 3)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1">
                                <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-3 block">Day of Month</label>
                                <input 
                                    type="number"
                                    min="1"
                                    max="31"
                                    disabled={!isEditing}
                                    value={getVal('monthlyDistributionDate', 1)}
                                    onChange={(e) => setSettings({...settings, monthlyDistributionDate: Number(e.target.value)})}
                                    className="bg-white border border-zinc-200 rounded px-4 py-2 font-bold text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 w-24 text-sm"
                                />
                            </div>
                        )}
                        <div className="p-4 bg-white rounded-lg border border-zinc-100 flex-1">
                            <p className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest mb-1.5">Automation Status</p>
                            <p className="text-[10px] text-zinc-500 leading-relaxed font-medium">
                                The system will automatically credit the top 3 traders every 
                                <span className="text-zinc-900 font-bold"> {activeTab === 'weekly' ? weekDays[getVal('weeklyDistributionDay', 0)] : `day ${getVal('monthlyDistributionDate', 1)} of the month`}</span>.
                            </p>
                        </div>
                    </div>
                </div>

                {(activeTab === 'weekly' ? settings.lastWeeklyDistribution : settings.lastMonthlyDistribution) && (
                    <div className="mt-6 flex items-center justify-center gap-1.5 text-[9px] font-bold text-zinc-300 uppercase tracking-widest">
                        <Clock size={10} />
                        Last {activeTab} payout: {new Date(activeTab === 'weekly' ? settings.lastWeeklyDistribution : settings.lastMonthlyDistribution).toLocaleString()}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RewardsSettings;
