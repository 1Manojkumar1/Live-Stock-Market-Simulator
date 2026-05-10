import { useState, useEffect } from "react";
import api from "../../services/api";
import {Users, UserCheck, UserMinus, UserX, Activity, Search } from 'lucide-react';
import Loader from '../Loader';

function AdminDashboard({ }) {
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
      className={`p-5 rounded-xl border transition-all duration-200 group cursor-pointer ${
        activeFilter === filterKey 
          ? 'bg-zinc-900 text-white border-zinc-900' 
          : 'bg-white text-zinc-900 border-zinc-200 hover:border-zinc-300 hover:shadow-sm'
      }`}
    >
      <div className="flex justify-between items-center">
        <div className={`p-3 rounded-lg transition-transform group-hover:scale-105 ${
            activeFilter === filterKey ? 'bg-white/10 text-white' : `${color} text-white`
        }`}>
          <Icon size={20} />
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5 text-zinc-400 group-hover:text-zinc-500 transition-colors">{title}</p>
          <h3 className="text-2xl font-bold leading-none">{value}</h3>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-40">
        <Loader />
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
      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-zinc-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
            <div className="p-2 bg-zinc-100 rounded text-zinc-600">
              {activeFilter === 'all' ? <Users size={16} /> : <Activity size={16} />}
            </div>
            {activeFilter === 'all' ? 'All Registered Users' : `${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Traders`}
          </h3>
          
          {/* SEARCH BAR */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
            <input 
                type="text"
                placeholder="Search traders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg pl-10 pr-4 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 transition-all placeholder:text-zinc-400"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 border-b border-zinc-200">
                <th className="py-3 px-5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Name</th>
                <th className="py-3 px-5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Email</th>
                <th className="py-3 px-5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Balance</th>
                <th className="py-3 px-5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Status</th>
                <th className="py-3 px-5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">Online</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-zinc-50/50 transition-colors group text-sm">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded flex items-center justify-center text-white font-bold text-xs ${u.isLoggedIn ? 'bg-green-500' : 'bg-zinc-300'}`}>
                          {u.name.charAt(0)}
                        </div>
                        <span className="font-medium text-zinc-900">{u.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="text-zinc-500">{u.email}</span>
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="font-semibold text-zinc-900">₹{u.balance?.toLocaleString('en-IN')}</span>
                    </td>
                    <td className="py-3.5 px-5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight border ${
                        u.status === 'blocked'
                          ? 'bg-red-50 text-red-600 border-red-100'
                          : 'bg-green-50 text-green-600 border-green-100'
                      }`}>
                        {u.status === 'blocked' ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${u.isLoggedIn ? 'text-green-600' : 'text-zinc-400'}`}>
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