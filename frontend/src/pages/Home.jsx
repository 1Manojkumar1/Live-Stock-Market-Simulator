import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, ShieldCheck, Zap, BarChart3, ArrowRight, Globe, PlayCircle } from 'lucide-react';

const Home = () => {
    return (
        <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white">
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-zinc-900 text-white flex items-center justify-center rounded font-bold text-lg">
                            C
                        </div>
                        <span className="text-lg font-bold text-zinc-900 tracking-tight">Cruzz</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 transition-colors">Login</Link>
                        <Link to="/register" className="bg-zinc-900 text-white px-5 py-2 rounded text-[11px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-sm">Get Started</Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-50 pb-20 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-900 mb-8 max-w-4xl mx-auto leading-[0.9]">
                        Master the <span className="text-zinc-400">Market</span> without the risk
                    </h1>
                    <p className="text-zinc-500 text-sm md:text-base max-w-2xl mx-auto mb-12 leading-relaxed">
                        Join Cruzz, the ultimate real-time stock market simulator. Practice your trading strategies with live data, compete with others, and refine your portfolio in a professional, risk-free environment
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/register" className="w-full sm:w-auto bg-zinc-900 text-white px-8 py-4 rounded font-bold text-xs uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-lg flex items-center justify-center gap-2">
                            Start Trading
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
