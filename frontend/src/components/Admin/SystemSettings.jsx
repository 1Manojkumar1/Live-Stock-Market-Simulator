import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Settings, Save, ShieldAlert, CircleDollarSign, Percent, Construction } from 'lucide-react';

const SystemSettings = () => {
    const [settings, setSettings] = useState({
        tradingEnabled: true,
        maintenanceMode: false,
        defaultBalance: 10000,
        transactionFeePercent: 1
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

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

    const handleToggle = (field) => {
        setSettings({ ...settings, [field]: !settings[field] });
    };

    const handleChange = (e) => {
        setSettings({ ...settings, [e.target.name]: Number(e.target.value) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            await api.put('/admin-api/settings', settings);
            toast.success("Global settings updated successfully");
        } catch (err) {
            toast.error("Failed to update settings");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
        );
    }

    return (
        <div className="p-4 lg:p-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-10 border-b border-gray-50 flex items-center gap-4">
                    <div className="p-4 bg-black text-white rounded-[1.5rem] shadow-xl shadow-black/10">
                        <Settings size={28} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">System Configuration</h2>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Global platform behavior & parameters</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-10 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Switches */}
                        <div className="space-y-8">
                            <div className="flex items-center justify-between p-6 bg-gray-50/50 rounded-3xl border border-gray-50 hover:bg-white hover:border-gray-100 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl ${settings.tradingEnabled ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                        <ShieldAlert size={20} />
                                    </div>
                                    <div>
                                        <p className="font-black text-gray-900 text-sm">Trading Status</p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase">Enable/Disable Market execution</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleToggle('tradingEnabled')}
                                    className={`w-14 h-8 rounded-full transition-all relative ${settings.tradingEnabled ? 'bg-green-500' : 'bg-gray-300'}`}
                                >
                                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${settings.tradingEnabled ? 'right-1' : 'left-1 shadow-sm'}`} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-6 bg-gray-50/50 rounded-3xl border border-gray-50 hover:bg-white hover:border-gray-100 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl ${settings.maintenanceMode ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-400'}`}>
                                        <Construction size={20} />
                                    </div>
                                    <div>
                                        <p className="font-black text-gray-900 text-sm">Maintenance Mode</p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase">Lock system for updates</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleToggle('maintenanceMode')}
                                    className={`w-14 h-8 rounded-full transition-all relative ${settings.maintenanceMode ? 'bg-orange-500' : 'bg-gray-300'}`}
                                >
                                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${settings.maintenanceMode ? 'right-1' : 'left-1 shadow-sm'}`} />
                                </button>
                            </div>
                        </div>

                        {/* Numeric Inputs */}
                        <div className="space-y-8">
                            <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-50">
                                <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">
                                    <CircleDollarSign size={12} />
                                    Initial Trader Balance (₹)
                                </label>
                                <input
                                    type="number"
                                    name="defaultBalance"
                                    value={settings.defaultBalance}
                                    onChange={handleChange}
                                    className="w-full bg-white border-2 border-transparent rounded-2xl px-5 py-3 focus:border-black transition-all outline-none font-black text-lg shadow-sm"
                                />
                            </div>

                            <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-50">
                                <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">
                                    <Percent size={12} />
                                    Transaction Fee (%)
                                </label>
                                <input
                                    type="number"
                                    name="transactionFeePercent"
                                    value={settings.transactionFeePercent}
                                    onChange={handleChange}
                                    className="w-full bg-white border-2 border-transparent rounded-2xl px-5 py-3 focus:border-black transition-all outline-none font-black text-lg shadow-sm"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-10 border-t border-gray-50">
                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full bg-black text-white font-black py-6 rounded-[2rem] shadow-2xl shadow-black/20 hover:bg-gray-800 transition-all active:scale-95 flex items-center justify-center gap-3 tracking-[0.2em] uppercase text-sm"
                        >
                            {saving ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                            ) : (
                                <>
                                    <Save size={20} />
                                    Commit System Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SystemSettings;
