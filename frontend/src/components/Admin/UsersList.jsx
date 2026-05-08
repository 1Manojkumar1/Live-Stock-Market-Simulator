import React, { useState, useEffect } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";
import { User, Mail, Shield, Wallet, Lock, Unlock, Eye, X } from 'lucide-react';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin-api/users");
      setUsers(res.data.users);
    } catch (err) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const toggleBlockUser = async (user) => {
    const isBlocked = user.status === 'blocked';
    const endpoint = `/admin-api/users/${user._id}/${isBlocked ? 'unblock' : 'block'}`;
    
    try {
      await api.patch(endpoint);
      toast.success(`User ${isBlocked ? 'unblocked' : 'blocked'} successfully`);
      fetchUsers();
      if (selectedUser && selectedUser._id === user._id) {
        setSelectedUser({ ...user, status: isBlocked ? 'active' : 'blocked' });
      }
    } catch (err) {
      toast.error(`Failed to ${isBlocked ? 'unblock' : 'block'} user`);
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
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
            <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase">User Directory</h3>
            <div className="bg-gray-100 px-4 py-1.5 rounded-full text-[10px] font-black text-gray-500 uppercase tracking-widest">
                {users.length} Registered Traders
            </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/30 border-b border-gray-100">
                <th className="py-5 px-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">User Profile</th>
                <th className="py-5 px-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">Current Status</th>
                <th className="py-5 px-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Management</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-all duration-200 group">
                  <td className="py-6 px-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center font-black text-sm shadow-lg shadow-black/10 group-hover:scale-110 transition-transform">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-gray-900 leading-tight text-base">{user.name}</p>
                        <p className="text-xs text-gray-400 font-bold mt-0.5">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-6 px-8 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                      user.status === 'blocked' 
                        ? 'bg-red-50 text-red-600 border-red-100' 
                        : 'bg-green-50 text-green-600 border-green-100'
                    }`}>
                      {user.status || 'Active'}
                    </span>
                  </td>
                  <td className="py-6 px-8 text-right">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="inline-flex items-center gap-2 text-xs font-black text-black bg-white border-2 border-gray-100 hover:border-black px-5 py-2.5 rounded-2xl transition-all active:scale-95 shadow-sm"
                    >
                      <Eye size={16} />
                      AUDIT ACCOUNT
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-300">
            <div className="p-10">
              <div className="flex justify-between items-start mb-10">
                <div className="w-20 h-20 bg-black text-white rounded-[2rem] flex items-center justify-center text-3xl font-black shadow-2xl shadow-black/20">
                  {selectedUser.name.charAt(0)}
                </div>
                <button onClick={() => setSelectedUser(null)} className="p-3 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                  <X size={28} />
                </button>
              </div>

              <div className="space-y-8 mb-12">
                <div>
                  <h3 className="text-3xl font-black text-gray-900 tracking-tight mb-2">{selectedUser.name}</h3>
                  <div className="flex items-center gap-2 text-gray-400 font-bold">
                    <Mail size={18} />
                    {selectedUser.email}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                    <div className="flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">
                      <Shield size={14} />
                      Role Permissions
                    </div>
                    <p className="font-black text-gray-900 text-lg">{selectedUser.role}</p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                    <div className="flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">
                      <Wallet size={14} />
                      Equity Balance
                    </div>
                    <p className="font-black text-gray-900 text-lg">₹{selectedUser.balance?.toLocaleString('en-IN') || 0}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => toggleBlockUser(selectedUser)}
                className={`w-full flex items-center justify-center gap-3 font-black py-6 rounded-[2rem] transition-all active:scale-95 shadow-2xl text-base tracking-widest ${
                  selectedUser.status === 'blocked'
                    ? 'bg-green-600 text-white shadow-green-200 hover:bg-green-700'
                    : 'bg-red-600 text-white shadow-red-200 hover:bg-red-700'
                }`}
              >
                {selectedUser.status === 'blocked' ? <Unlock size={24} /> : <Lock size={24} />}
                {selectedUser.status === 'blocked' ? 'RESTORE ACCOUNT' : 'SUSPEND ACCOUNT'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersList;