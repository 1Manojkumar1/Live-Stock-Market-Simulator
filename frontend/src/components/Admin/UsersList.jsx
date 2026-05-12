import { useState, useEffect } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";
import { User, Mail, Shield, Wallet, Lock, Unlock, Eye, X } from 'lucide-react';
import Loader from '../Loader';

//usersList component
const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  //fetch users on component mount and update state on success
  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchUsers();
  }, []);

  //fetch users from API and update state
  const fetchUsers = async () => {
    try {
      // setLoading
      setLoading(true);
      const res = await api.get("/admin-api/users");
      setUsers(res.data.users);
    } catch {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  //toggle block/unblock user and update state on success
  const toggleBlockUser = async (user) => {
    //update user status
    const isBlocked = user.status === 'blocked';
    //update user status
    const endpoint = `/admin-api/users/${user._id}/${isBlocked ? 'unblock' : 'block'}`;
    
    try {
      // setLoading
      await api.patch(endpoint);
      //update user status
      toast.success(`User ${isBlocked ? 'unblocked' : 'blocked'} successfully`);
      fetchUsers();
      //update selected user
      if (selectedUser && selectedUser._id === user._id) {
        //update selected user
        setSelectedUser({ ...user, status: isBlocked ? 'active' : 'blocked' });
      }
    } catch {
      toast.error(`Failed to ${isBlocked ? 'unblock' : 'block'} user`);
    }
  };

  //render component
  if (loading) {
    return (
      <div className="flex justify-center items-center py-40">
        <Loader />
      </div>
    );
  }
//render component
  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-6">
      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/30">
            <h3 className="text-sm font-bold text-zinc-900 tracking-tight uppercase flex items-center gap-2">
                <User size={16} className="text-zinc-400" />
                User Directory
            </h3>
            <div className="bg-zinc-100 px-3 py-1 rounded text-[10px] font-bold text-zinc-500 uppercase tracking-wider border border-zinc-200">
                {users.length} Traders
            </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 border-b border-zinc-200">
                <th className="py-3 px-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Profile</th>
                <th className="py-3 px-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-center">Status</th>
                <th className="py-3 px-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-zinc-50/50 transition-colors group text-sm">
                  <td className="py-3.5 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-zinc-900 text-white rounded flex items-center justify-center font-bold text-xs">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-zinc-900 leading-tight">{user.name}</p>
                        <p className="text-[10px] text-zinc-400 font-medium">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-6 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight border ${
                      user.status === 'blocked' 
                        ? 'bg-red-50 text-red-600 border-red-100' 
                        : 'bg-green-50 text-green-600 border-green-100'
                    }`}>
                      {user.status || 'Active'}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="inline-flex items-center gap-1.5 text-[10px] font-bold text-zinc-900 bg-white border border-zinc-200 hover:border-zinc-900 px-3 py-1.5 rounded transition-all active:scale-95 shadow-sm"
                    >
                      <Eye size={12} />
                      AUDIT
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm z-100 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-zinc-200 animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-zinc-900 text-white rounded-lg flex items-center justify-center text-xl font-bold shadow-sm">
                  {selectedUser.name.charAt(0)}
                </div>
                <button onClick={() => setSelectedUser(null)} className="p-2 hover:bg-zinc-100 rounded-full transition-colors text-zinc-400">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6 mb-8">
                <div>
                  <h3 className="text-xl font-bold text-zinc-900 tracking-tight">{selectedUser.name}</h3>
                  <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-medium mt-1">
                    <Mail size={14} />
                    {selectedUser.email}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-100">
                    <div className="flex items-center gap-1.5 text-zinc-400 text-[9px] font-bold uppercase tracking-widest mb-1">
                      <Shield size={12} />
                      Permissions
                    </div>
                    <p className="font-bold text-zinc-900 text-sm capitalize">{selectedUser.role}</p>
                  </div>
                  <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-100">
                    <div className="flex items-center gap-1.5 text-zinc-400 text-[9px] font-bold uppercase tracking-widest mb-1">
                      <Wallet size={12} />
                      Equity
                    </div>
                    <p className="font-bold text-zinc-900 text-sm">₹{selectedUser.balance?.toLocaleString('en-IN') || 0}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => toggleBlockUser(selectedUser)}
                className={`w-full flex items-center justify-center gap-2 font-bold py-3 rounded-lg transition-all active:scale-95 shadow-sm text-sm tracking-wide ${
                  selectedUser.status === 'blocked'
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200/50'
                    : 'bg-rose-600 text-white hover:bg-rose-700 shadow-rose-200/50'
                }`}
              >
                {selectedUser.status === 'blocked' ? <Unlock size={18} /> : <Lock size={18} />}
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