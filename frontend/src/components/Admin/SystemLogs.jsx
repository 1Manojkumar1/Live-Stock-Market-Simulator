import React, { useState, useEffect } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";
import { History, User, Mail, Activity, Clock, IndianRupee, ShieldCheck } from 'lucide-react';
import Loader from '../Loader';

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
      <div className="flex justify-center items-center py-40">
        <Loader />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-6">
      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/30">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-zinc-100 text-zinc-600 rounded">
                    <ShieldCheck size={16} />
                </div>
                <h3 className="text-sm font-bold text-zinc-900 tracking-tight uppercase">Audit Logs</h3>
            </div>
            <div className="bg-zinc-900 text-white px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider border border-zinc-900">
                {transactions.length} Records
            </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 border-b border-zinc-200">
                <th className="py-3 px-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Trader</th>
                <th className="py-3 px-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Asset</th>
                <th className="py-3 px-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Type</th>
                <th className="py-3 px-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Value</th>
                <th className="py-3 px-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">Time</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-100">
              {transactions.length > 0 ? (
                transactions.map((trans) => (
                  <tr key={trans._id} className="hover:bg-zinc-50/50 transition-colors group text-sm">
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-zinc-100 rounded flex items-center justify-center text-zinc-400 border border-zinc-200 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                          <User size={14} />
                        </div>
                        <div>
                          <p className="font-bold text-zinc-900 leading-tight">{trans.userId?.name || 'System'}</p>
                          <p className="text-[10px] text-zinc-400 font-medium">{trans.userId?.email || 'N/A'}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-6">
                      <div>
                        <p className="font-bold text-zinc-900 leading-tight">{trans.stockId?.symbol || 'N/A'}</p>
                        <p className="text-[10px] text-zinc-400 font-medium truncate max-w-[120px]">{trans.stockId?.stockName || 'Unknown'}</p>
                      </div>
                    </td>

                    <td className="py-3.5 px-6">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight border ${
                        trans.type === "BUY"
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                          : "bg-rose-50 text-rose-600 border-rose-100"
                      }`}>
                        {trans.type}
                      </span>
                    </td>

                    <td className="py-3.5 px-6">
                      <div>
                        <p className="font-bold text-zinc-900 leading-tight text-sm">₹{trans.totalAmount?.toLocaleString('en-IN')}</p>
                        <p className="text-[10px] text-zinc-400 font-medium">{trans.quantity} @ ₹{trans.price?.toLocaleString('en-IN')}</p>
                      </div>
                    </td>

                    <td className="py-3.5 px-6 text-right">
                      <div className="flex flex-col items-end">
                        <p className="text-xs font-bold text-zinc-900 mb-0.5">
                          {new Date(trans.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </p>
                        <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-medium uppercase tracking-tight">
                          <Clock size={10} />
                          {new Date(trans.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-16 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-zinc-50 rounded-full flex items-center justify-center mb-3">
                        <History size={24} className="text-zinc-200" />
                      </div>
                      <p className="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">No activity recorded</p>
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