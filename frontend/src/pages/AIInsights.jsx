import React, { useState, useEffect, useContext } from 'react';
import { Brain, TrendingUp, ShieldAlert, Sparkles, Target, Zap, ArrowRight, ShieldCheck, HeartPulse, Info } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';
import Loader from '../components/Loader';

const AIInsights = () => {
    const { user } = useContext(AuthContext);
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalysis = async () => {
            try {
                const res = await api.get(`/user-api/analyze/${user._id}`);
                setReport(res.data.report);
            } catch (err) {
                console.error("AI Analysis failed", err);
            } finally {
                setLoading(false);
            }
        };
        if (user?._id) fetchAnalysis();
    }, [user?._id]);

    if (loading) return <div className="h-screen flex items-center justify-center"><Loader /></div>;

    const ScoreCard = ({ title, score, icon: Icon, colorClass }) => (
        <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <div className={`p-2 rounded-lg ${colorClass.bg} ${colorClass.text}`}>
                    <Icon size={20} />
                </div>
                <span className="text-2xl font-black text-zinc-900">{score}<span className="text-xs text-zinc-400">/100</span></span>
            </div>
            <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">{title}</p>
                <div className="h-1.5 w-full bg-zinc-50 rounded-full overflow-hidden">
                    <div 
                        className={`h-full ${colorClass.bar} transition-all duration-1000`} 
                        style={{ width: `${score}%` }}
                    />
                </div>
            </div>
        </div>
    );

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* Header Hero */}
            <div className="bg-zinc-900 rounded-[2rem] p-10 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12">
                    <Brain size={200} />
                </div>
                <div className="relative z-10 space-y-6 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                        <Sparkles size={12} className="text-amber-400" />
                        AI Trading Behavioral Report
                    </div>
                    <div>
                        <h1 className="text-4xl font-black tracking-tight mb-3">
                            You are a <span className="text-amber-400">{report.behaviorType}</span>
                        </h1>
                        <p className="text-zinc-400 text-lg leading-relaxed">
                            {report.summary}
                        </p>
                    </div>
                </div>
            </div>

            {/* Analysis Scores */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ScoreCard title="Discipline" score={report.scores.discipline} icon={Target} colorClass={{ bg: 'bg-zinc-50', text: 'text-zinc-600', bar: 'bg-zinc-900' }} />
                <ScoreCard title="Risk Management" score={report.scores.riskManagement} icon={ShieldCheck} colorClass={{ bg: 'bg-emerald-50', text: 'text-emerald-600', bar: 'bg-emerald-500' }} />
                <ScoreCard title="Emotional Stability" score={report.scores.emotionalStability} icon={HeartPulse} colorClass={{ bg: 'bg-rose-50', text: 'text-rose-600', bar: 'bg-rose-500' }} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Mistakes Section */}
                <div className="space-y-4">
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2 px-2">
                        <ShieldAlert size={14} className="text-rose-500" />
                        Psychological Blindspots
                    </h3>
                    <div className="space-y-3">
                        {report.mistakes.map((m, i) => (
                            <div key={i} className="group flex items-center gap-4 bg-white p-5 rounded-2xl border border-zinc-100 hover:border-rose-100 hover:shadow-md transition-all">
                                <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 text-xs font-bold">
                                    !
                                </div>
                                <p className="text-zinc-700 font-medium">{m}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Suggestions Section */}
                <div className="space-y-4">
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2 px-2">
                        <Zap size={14} className="text-amber-500" />
                        The Road to Mastery
                    </h3>
                    <div className="space-y-3">
                        {report.suggestions.map((s, i) => (
                            <div key={i} className="group flex items-start gap-4 bg-white p-5 rounded-2xl border border-zinc-100 hover:border-amber-100 hover:shadow-md transition-all">
                                <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
                                    <ArrowRight size={14} />
                                </div>
                                <p className="text-zinc-700 font-medium leading-relaxed">{s}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Educational Note */}
            <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-200 flex gap-4 items-center">
                <div className="p-3 bg-white rounded-xl border border-zinc-200 text-zinc-400 shadow-sm">
                    <Info size={20} />
                </div>
                <div>
                    <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">AI Coach Note</h4>
                    <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                        This analysis is based on your recent 10-20 transactions. It identifies patterns that often occur during high-stress market moments. Use these insights to build a mechanical, non-emotional trading system.
                    </p>
                </div>
            </div>

        </div>
    );
};

export default AIInsights;
