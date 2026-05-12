import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Settings, Save, ShieldAlert, CircleDollarSign, Percent, Construction, Edit3 } from 'lucide-react';
import Loader from '../Loader';

//system settings component
const SystemSettings = () => {
    const [settings, setSettings] = useState({
        tradingEnabled: true,
        maintenanceMode: false,
        defaultBalance: 10000,
        transactionFeePercent: 1
    });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Fetch settings on mount and update state
    useEffect(() => {
        fetchSettings();
    }, []);

    // Fetch settings from API and update state
    const fetchSettings = async () => {
        try {
            setLoading(true);
            const res = await api.get('/admin-api/settings');
            setSettings(res.data);
        } catch (err) {
            toast.error("Failed to load system settings");
        } finally {
            setLoading(false);
        }
    };

    // Toggle settings
    const handleToggle = (field) => {
        if (!isEditing) return;
        setSettings({ ...settings, [field]: !settings[field] });
    };

    // Handle changes
    const handleChange = (e) => {
        setSettings({ ...settings, [e.target.name]: Number(e.target.value) });
    };

    // Save settings to API and update state on success
    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        try {
            // setLoading and setSaving before making the API call
            setSaving(true);
            await api.put('/admin-api/settings', settings);
            toast.success("Global settings updated successfully");
            setIsEditing(false);
        } catch (err) {
            toast.error("Failed to update settings",err);
        } finally {
            setSaving(false);
        }
    };
     // Render the component
    if (loading) {
        return (
            <div className="flex justify-center items-center py-40">
                <Loader />
            </div>
        );
    }
    // Render the component
    return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden">
            <div className="p-6 border-b border-zinc-100 flex flex-col md:flex-row justify-between items-center gap-6 bg-zinc-50/30">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-zinc-900 text-white rounded shadow-sm">
                        <Settings size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-zinc-900 tracking-tight uppercase">System Configuration</h2>
                        <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mt-1">Global platform behavior & parameters</p>
                    </div>
                </div>
                {/* save button */}
                <button
                    onClick={() => isEditing ? handleSubmit() : setIsEditing(true)}
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

            <div className="p-6 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Switches */}
                    <div className="space-y-6">
                        <div className={`flex items-center justify-between p-4 rounded-lg border transition-all ${isEditing ? 'bg-white border-zinc-200 shadow-sm' : 'bg-zinc-50/50 border-zinc-100'}`}>
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded ${settings.tradingEnabled ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                                    <ShieldAlert size={16} />
                                </div>
                                <div>
                                    <p className="font-bold text-zinc-900 text-xs">Trading Status</p>
                                    <p className="text-[9px] text-zinc-400 font-bold uppercase">Market execution</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                disabled={!isEditing}
                                onClick={() => handleToggle('tradingEnabled')}
                                className={`w-10 h-5 rounded-full transition-all relative ${settings.tradingEnabled ? 'bg-emerald-500' : 'bg-zinc-300'} ${!isEditing && 'opacity-50 cursor-not-allowed'}`}
                            >
                                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${settings.tradingEnabled ? 'right-0.5' : 'left-0.5 shadow-sm'}`} />
                            </button>
                        </div>

                        <div className={`flex items-center justify-between p-4 rounded-lg border transition-all ${isEditing ? 'bg-white border-zinc-200 shadow-sm' : 'bg-zinc-50/50 border-zinc-100'}`}>
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded ${settings.maintenanceMode ? 'bg-amber-100 text-amber-600' : 'bg-zinc-100 text-zinc-400'}`}>
                                    <Construction size={16} />
                                </div>
                                <div>
                                    <p className="font-bold text-zinc-900 text-xs">Maintenance</p>
                                    <p className="text-[9px] text-zinc-400 font-bold uppercase">Lock for updates</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                disabled={!isEditing}
                                onClick={() => handleToggle('maintenanceMode')}
                                className={`w-10 h-5 rounded-full transition-all relative ${settings.maintenanceMode ? 'bg-amber-500' : 'bg-zinc-300'} ${!isEditing && 'opacity-50 cursor-not-allowed'}`}
                            >
                                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${settings.maintenanceMode ? 'right-0.5' : 'left-0.5 shadow-sm'}`} />
                            </button>
                        </div>
                    </div>

                    {/* Numeric Inputs */}
                    <div className="space-y-6">
                        <div className={`p-4 rounded-lg border transition-all ${isEditing ? 'bg-white border-zinc-200 shadow-sm' : 'bg-zinc-50/50 border-zinc-100'}`}>
                            <label className="flex items-center gap-1.5 text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-2 ml-0.5">
                                <CircleDollarSign size={12} />
                                Trader Balance (₹)
                            </label>
                            <input
                                type="number"
                                name="defaultBalance"
                                disabled={!isEditing}
                                value={settings.defaultBalance}
                                onChange={handleChange}
                                className={`w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 transition-all outline-none font-bold text-base focus:ring-1 focus:ring-zinc-900 ${!isEditing && 'bg-transparent border-transparent cursor-default'}`}
                            />
                        </div>

                        <div className={`p-4 rounded-lg border transition-all ${isEditing ? 'bg-white border-zinc-200 shadow-sm' : 'bg-zinc-50/50 border-zinc-100'}`}>
                            <label className="flex items-center gap-1.5 text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-2 ml-0.5">
                                <Percent size={12} />
                                Trade Fee (%)
                            </label>
                            <input
                                type="number"
                                name="transactionFeePercent"
                                disabled={!isEditing}
                                value={settings.transactionFeePercent}
                                onChange={handleChange}
                                className={`w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 transition-all outline-none font-bold text-base focus:ring-1 focus:ring-zinc-900 ${!isEditing && 'bg-transparent border-transparent cursor-default'}`}
                            />
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemSettings;
