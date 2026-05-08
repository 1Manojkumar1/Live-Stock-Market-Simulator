import React, { useState, useEffect } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";
import { History, User, Mail, Activity, Clock, IndianRupee, ShieldCheck } from 'lucide-react';

const SystemConfig = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin-api/transactions");
      setTransactions(res.data.transactions);
    } catch (err) {
      toast.error("Failed to fetch system logs");
    } finally {
      setLoading(false);
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
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <ShieldCheck size={20} />
                </div>
                <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase">Audit Logs</h3>
            </div>
            <div className="bg-black text-white px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-black/10">
                {transactions.length} Verified Records
            </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/30 border-b border-gray-100">
                <th className="py-5 px-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Trader Identifier</th>
                <th className="py-5 px-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Asset Information</th>
                <th className="py-5 px-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Execution Type</th>
                <th className="py-5 px-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Transaction Value</th>
                <th className="py-5 px-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Execution Time</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {transactions.length > 0 ? (
                transactions.map((trans) => (
                  <tr key={trans._id} className="hover:bg-gray-50/50 transition-all duration-200 group">
                    <td className="py-6 px-8">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 border border-gray-100 group-hover:bg-black group-hover:text-white transition-all">
                          <User size={18} />
                        </div>
                        <div>
                          <p className="font-black text-gray-900 leading-tight">{trans.userId?.name || 'System User'}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{trans.userId?.email || 'N/A'}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-6 px-8">
                      <div>
                        <p className="font-black text-gray-900 leading-tight">{trans.stockId?.symbol || 'N/A'}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider truncate max-w-[150px]">{trans.stockId?.stockName || 'Unknown Entity'}</p>
                      </div>
                    </td>

                    <td className="py-6 px-8">
                      <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        trans.type === "BUY"
                          ? "bg-green-50 text-green-600 border-green-100"
                          : "bg-red-50 text-red-600 border-red-100"
                      }`}>
                        {trans.type}
                      </span>
                    </td>

                    <td className="py-6 px-8">
                      <div>
                        <p className="font-black text-gray-900 leading-tight">₹{trans.totalAmount?.toLocaleString('en-IN')}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">{trans.quantity} units @ ₹{trans.price?.toLocaleString('en-IN')}</p>
                      </div>
                    </td>

                    <td className="py-6 px-8 text-right">
                      <div className="flex flex-col items-end">
                        <p className="text-xs font-black text-gray-900 mb-1">
                          {new Date(trans.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </p>
                        <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                          <Clock size={12} />
                          {new Date(trans.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-24 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                        <History size={32} className="text-gray-200" />
                      </div>
                      <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Awaiting Market Activity</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SystemConfig;