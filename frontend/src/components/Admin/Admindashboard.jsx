import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { Users, UserCheck, UserMinus, UserX, Activity, TrendingUp, Clock, Wallet, Settings, History, Package } from 'lucide-react';

function AdminDashboard({ onNavigate }) {
  const [data, setData] = useState({
    stats: {
      totalUsers: 0,
      loggedInUsers: 0,
      loggedOutUsers: 0
    },
    users: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin-api/dashboard");
      setData(res.data);
    } catch (err) {
      console.error("Failed to fetch stats", err);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, description }) => (
    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group">
      <div className="flex justify-between items-start mb-6">
        <div className={`p-4 rounded-2xl ${color} text-white shadow-lg shadow-current/20 group-hover:scale-110 transition-transform`}>
          <Icon size={24} />
        </div>
        <div className="text-right">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{title}</p>
          <h3 className="text-4xl font-black text-gray-900 leading-none">{value}</h3>
        </div>
      </div>
      <p className="text-sm text-gray-400 font-medium leading-relaxed">{description}</p>
      <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between text-gray-300 group-hover:text-black transition-colors cursor-pointer">
        <span className="text-[10px] font-black uppercase tracking-widest">Real-time Data</span>
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        <StatCard 
          title="Total Traders" 
          value={data.stats.totalUsers} 
          icon={Users} 
          color="bg-blue-600" 
          description="Total registered accounts in the system."
        />
        <StatCard 
          title="Active Now" 
          value={data.stats.loggedInUsers} 
          icon={UserCheck} 
          color="bg-green-500" 
          description="Traders currently online and authenticated."
        />
        <StatCard 
          title="Idle Accounts" 
          value={data.stats.loggedOutUsers} 
          icon={UserMinus} 
          color="bg-orange-500" 
          description="Users not currently active in the simulator."
        />
        <StatCard 
          title="Restricted" 
          value={data.users.filter(u => u.status === 'blocked').length} 
          icon={UserX} 
          color="bg-red-500" 
          description="Accounts currently under administrative suspension."
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            {/* ONLINE TRADERS SUMMARY */}
            <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
                        <div className="p-2.5 bg-gray-100 rounded-xl text-gray-600">
                            <Clock size={20} />
                        </div>
                        Trader Activity
                    </h3>
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-green-600 bg-green-50 px-3 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            {data.stats.loggedInUsers} Online
                        </span>
                        <span className="text-[10px] font-black text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full uppercase tracking-wider">
                            {data.stats.loggedOutUsers} Offline
                        </span>
                    </div>
                </div>

                <div className="space-y-4">
                    {data.users.slice(0, 5).map((u) => (
                        <div key={u._id} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-transparent hover:border-gray-100 hover:bg-white transition-all group">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-lg ${u.isLoggedIn ? 'bg-green-500 shadow-green-100' : 'bg-gray-400 shadow-gray-100'}`}>
                                    {u.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-black text-gray-900 text-sm leading-tight">{u.name}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{u.email}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="flex items-center gap-1.5 justify-end mb-1">
                                    <Wallet size={12} className="text-gray-300" />
                                    <span className="font-black text-gray-900 text-xs">₹{u.balance?.toLocaleString('en-IN')}</span>
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-widest ${u.isLoggedIn ? 'text-green-500' : 'text-gray-400'}`}>
                                    {u.status === 'blocked' ? 'Blocked' : u.isLoggedIn ? 'Online Now' : 'Disconnected'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* SYSTEM QUICK STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-all">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl w-fit mb-4">
                        <Package size={20} />
                    </div>
                    <p className="text-3xl font-black text-gray-900">{data.stats.totalUsers}</p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Total Registered Users</p>
                </div>
                <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-all">
                    <div className="p-3 bg-green-50 text-green-600 rounded-xl w-fit mb-4">
                        <TrendingUp size={20} />
                    </div>
                    <p className="text-3xl font-black text-gray-900">{data.users.filter(u => u.isLoggedIn).length}</p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Active Sessions</p>
                </div>
                <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-all">
                    <div className={`p-3 rounded-xl w-fit mb-4 ${data.users.filter(u => u.status === 'blocked').length > 0 ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-400'}`}>
                        <UserX size={20} />
                    </div>
                    <p className="text-3xl font-black text-gray-900">{data.users.filter(u => u.status === 'blocked').length}</p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Restricted Accounts</p>
                </div>
            </div>
        </div>

        <div className="space-y-8">
            <div className="bg-black rounded-[2.5rem] p-10 text-white shadow-2xl shadow-black/30 flex flex-col justify-between group h-full">
                <div>
                    <h3 className="text-xl font-black mb-2 uppercase tracking-tight">Quick Actions</h3>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-10">Administrative Tools</p>
                    
                    <div className="space-y-4">
                        <button
                            onClick={() => onNavigate?.('settings')}
                            className="w-full bg-white/5 hover:bg-white/10 text-white font-black py-5 rounded-2xl transition-all flex items-center justify-center gap-3 border border-white/10 hover:border-white/20 active:scale-95 text-xs tracking-widest"
                        >
                            <Settings size={20} className="text-blue-400" />
                            SYSTEM SETTINGS
                        </button>
                        <button
                            onClick={() => onNavigate?.('transactions')}
                            className="w-full bg-white/5 hover:bg-white/10 text-white font-black py-5 rounded-2xl transition-all flex items-center justify-center gap-3 border border-white/10 hover:border-white/20 active:scale-95 text-xs tracking-widest"
                        >
                            <History size={20} className="text-green-400" />
                            VIEW AUDIT LOGS
                        </button>
                        <button
                            onClick={() => onNavigate?.('users')}
                            className="w-full bg-white/5 hover:bg-white/10 text-white font-black py-5 rounded-2xl transition-all flex items-center justify-center gap-3 border border-white/10 hover:border-white/20 active:scale-95 text-xs tracking-widest"
                        >
                            <Users size={20} className="text-purple-400" />
                            MANAGE USERS
                        </button>
                    </div>
                </div>
                
                <div className="mt-auto pt-10">
                    <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3">System Status</p>
                        <div className="flex items-center gap-3">
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-500/50" />
                            <span className="text-xs font-black text-gray-300 uppercase tracking-widest">Server Connected</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* FULL USERS LIST */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
          <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase flex items-center gap-3">
            <div className="p-2.5 bg-gray-100 rounded-xl text-gray-600">
              <Users size={20} />
            </div>
            Registered Users
          </h3>
          <div className="bg-gray-100 px-4 py-1.5 rounded-full text-[10px] font-black text-gray-500 uppercase tracking-widest">
            {data.users.length} Total
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/30 border-b border-gray-100">
                <th className="py-5 px-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Name</th>
                <th className="py-5 px-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Email</th>
                <th className="py-5 px-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Balance</th>
                <th className="py-5 px-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                <th className="py-5 px-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Online</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.users.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50/50 transition-all duration-200 group">
                  <td className="py-5 px-8">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-lg ${u.isLoggedIn ? 'bg-green-500 shadow-green-100' : 'bg-gray-400 shadow-gray-100'}`}>
                        {u.name.charAt(0)}
                      </div>
                      <span className="font-black text-gray-900">{u.name}</span>
                    </div>
                  </td>
                  <td className="py-5 px-8">
                    <span className="text-sm text-gray-500 font-bold">{u.email}</span>
                  </td>
                  <td className="py-5 px-8">
                    <span className="font-black text-gray-900">₹{u.balance?.toLocaleString('en-IN')}</span>
                  </td>
                  <td className="py-5 px-8">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                      u.status === 'blocked'
                        ? 'bg-red-50 text-red-600 border-red-100'
                        : 'bg-green-50 text-green-600 border-green-100'
                    }`}>
                      {u.status === 'blocked' ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td className="py-5 px-8 text-right">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${u.isLoggedIn ? 'text-green-500' : 'text-gray-400'}`}>
                      {u.isLoggedIn ? 'Online' : 'Offline'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;