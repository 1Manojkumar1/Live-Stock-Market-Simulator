import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { Users, UserCheck, UserMinus, UserX, Activity, TrendingUp, Clock, Wallet, Settings, History, Package, Search, Gift, ShieldAlert, Cpu } from 'lucide-react';

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
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

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

  const getFilteredUsers = () => {
    let filtered = data.users;
    
    // Category filter
    switch (activeFilter) {
      case 'active': filtered = filtered.filter(u => u.isLoggedIn); break;
      case 'idle': filtered = filtered.filter(u => !u.isLoggedIn); break;
      case 'restricted': filtered = filtered.filter(u => u.status === 'blocked'); break;
      default: break;
    }

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(u => 
        u.name.toLowerCase().includes(q) || 
        u.email.toLowerCase().includes(q)
      );
    }

    return filtered;
  };

  const filteredUsers = getFilteredUsers();

  const StatCard = ({ title, value, icon: Icon, color, filterKey }) => (
    <div 
      onClick={() => setActiveFilter(filterKey)}
      className={`p-8 rounded-[2rem] shadow-sm border transition-all duration-300 group cursor-pointer ${
        activeFilter === filterKey 
          ? 'bg-black text-white border-black scale-[1.02]' 
          : 'bg-white text-gray-900 border-gray-100 hover:shadow-xl hover:border-gray-200'
      }`}
    >
      <div className="flex justify-between items-start">
        <div className={`p-4 rounded-2xl shadow-lg transition-transform group-hover:scale-110 ${
            activeFilter === filterKey ? 'bg-white/10 text-white' : `${color} text-white shadow-current/20`
        }`}>
          <Icon size={24} />
        </div>
        <div className="text-right">
          <p className="text-xs font-black uppercase tracking-widest mb-1 text-gray-400">{title}</p>
          <h3 className="text-4xl font-black leading-none">{value}</h3>
        </div>
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
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-10">
      {/* TOP STATS */}
      <div className="w-full overflow-x-auto pb-4">
        <div className="flex gap-4 lg:gap-8 min-w-[800px] lg:min-w-full">
          <div className="flex-1"><StatCard title="Total Traders" value={data.stats.totalUsers} icon={Users} color="bg-blue-600" filterKey="all" /></div>
          <div className="flex-1"><StatCard title="Active Now" value={data.stats.loggedInUsers} icon={UserCheck} color="bg-green-500" filterKey="active" /></div>
          <div className="flex-1"><StatCard title="Idle Accounts" value={data.stats.loggedOutUsers} icon={UserMinus} color="bg-orange-500" filterKey="idle" /></div>
          <div className="flex-1"><StatCard title="Restricted" value={data.users.filter(u => u.status === 'blocked').length} icon={UserX} color="bg-red-500" filterKey="restricted" /></div>
        </div>
      </div>

      {/* FULL USERS LIST */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
          <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase flex items-center gap-3">
            <div className="p-2.5 bg-gray-100 rounded-xl text-gray-600">
              {activeFilter === 'all' ? <Users size={20} /> : <Activity size={20} />}
            </div>
            {activeFilter === 'all' ? 'All Registered Users' : `${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Traders`}
          </h3>
          
          {/* SEARCH BAR */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 py-3.5 font-bold text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
            />
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
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
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
                ))
              ) : (
                <tr>
                    <td colSpan="5" className="py-20 text-center">
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No traders found.</p>
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;