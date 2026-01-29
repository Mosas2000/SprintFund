'use client';

import {
    PerformanceTracker,
    OptimizationPanel,
    ProbabilityCalculator
} from './index';
import {
    User,
    Lock,
    ChevronRight,
    Zap,
    Award,
    Clock,
    TrendingUp
} from 'lucide-react';

export default function PersonalTab() {
    // Assume user is connected for this view
    const isConnected = true;

    if (!isConnected) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8">
                <div className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800 mb-6">
                    <Lock className="w-8 h-8 text-slate-500" />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight mb-2">Wallet Disconnected</h3>
                <p className="text-sm font-bold text-slate-500 max-w-sm uppercase tracking-widest leading-relaxed">
                    Connect your Stacks wallet to view your personal performance metrics and tailored optimization strategies.
                </p>
                <button className="mt-8 px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-black text-xs transition-all shadow-lg shadow-orange-900/20">
                    CONNECT WALLET
                </button>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-12 bg-slate-950/20">
            {/* Header Info */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-slate-900/50 p-8 rounded-[40px] border border-slate-800">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-[20px] bg-orange-600 flex items-center justify-center text-2xl font-black text-white shadow-xl shadow-orange-900/40">
                        M
                    </div>
                    <div>
                        <h2 className="text-2xl font-black tracking-tight uppercase">mosas.btc</h2>
                        <div className="flex gap-4 mt-1">
                            <div className="flex items-center gap-1.5">
                                <Award className="w-3.5 h-3.5 text-yellow-500" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Level 12 Contributor</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-blue-500" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Member since Jan 2024</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-xs font-black rounded-xl border border-slate-700 transition-all uppercase tracking-widest leading-none">
                        Edit profile
                    </button>
                    <button className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-black rounded-xl transition-all shadow-lg shadow-orange-900/20 uppercase tracking-widest leading-none">
                        Share Stats
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Main Trackers - 3/4 Width */}
                <div className="lg:col-span-3 space-y-12">
                    {/* Performance Tracker Section */}
                    <section className="bg-slate-900/30 border border-slate-800 rounded-[40px] p-2">
                        <PerformanceTracker />
                    </section>

                    {/* Optimization Panel Section */}
                    <section>
                        <div className="flex items-center justify-between mb-8 px-4">
                            <div>
                                <h3 className="text-xl font-black uppercase tracking-tight">Growth Strategies</h3>
                                <p className="text-[10px] font-black text-slate-500 uppercase mt-1">Tailored actions to improve your platform impact</p>
                            </div>
                            <div className="px-4 py-1.5 bg-orange-600/10 border border-orange-500/30 rounded-full text-[10px] font-black text-orange-500 uppercase tracking-widest">
                                8 New Suggestions
                            </div>
                        </div>
                        <div className="bg-slate-900/30 border border-slate-800 rounded-[40px] p-2">
                            <OptimizationPanel />
                        </div>
                    </section>

                    {/* Probability Tool Section */}
                    <section className="bg-slate-900/30 border border-slate-800 rounded-[40px] p-2">
                        <div className="p-8 pb-4">
                            <h3 className="text-xl font-black uppercase tracking-tight">Success Simulator</h3>
                            <p className="text-[10px] font-black text-slate-500 uppercase mt-1">Simulate your next proposal outcome before submitting</p>
                        </div>
                        <ProbabilityCalculator />
                    </section>
                </div>

                {/* Personal Sidebar - 1/4 Width */}
                <div className="space-y-8">
                    {/* User Reputation Card */}
                    <div className="bg-slate-900/50 border border-slate-800 rounded-[32px] p-8 border-l-4 border-l-orange-600">
                        <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">Reputation Score</h4>
                        <div className="flex items-end gap-3 mb-6">
                            <span className="text-5xl font-black text-white leading-none">4.8</span>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">/ 5.0</span>
                        </div>
                        <div className="flex items-center gap-2 mb-8">
                            <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <Star key={i} className={`w-3.5 h-3.5 ${i <= 4 ? 'text-yellow-500 fill-yellow-500' : 'text-slate-700'} `} />
                                ))}
                            </div>
                            <span className="text-[10px] font-black text-green-500 uppercase px-2 py-0.5 bg-green-500/10 rounded">Exemplary</span>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                <span className="text-slate-400">Voter Trust</span>
                                <span>98%</span>
                            </div>
                            <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-orange-600 w-[98%]" />
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest pt-2">
                                <span className="text-slate-400">Execution Rate</span>
                                <span>85%</span>
                            </div>
                            <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 w-[85%]" />
                            </div>
                        </div>
                    </div>

                    {/* Achievements Snippet */}
                    <div className="bg-slate-900/50 border border-slate-800 rounded-[32px] p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">Achievements</h4>
                            <ChevronRight className="w-4 h-4 text-slate-500" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { icon: '🚀', label: 'Launcher' },
                                { icon: '🗳️', label: 'Voter' },
                                { icon: '💎', label: 'Contributor' },
                                { icon: '🔥', label: 'Streak' },
                            ].map(a => (
                                <div key={a.label} className="aspect-square bg-slate-950/50 border border-slate-800 rounded-2xl flex flex-col items-center justify-center gap-2 group hover:border-orange-500/50 transition-all cursor-pointer">
                                    <span className="text-2xl group-hover:scale-110 transition-transform">{a.icon}</span>
                                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">{a.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Personalized Feed Alert */}
                    <div className="bg-blue-600 p-8 rounded-[32px] text-white overflow-hidden relative group">
                        <div className="relative z-10">
                            <Zap className="w-6 h-6 text-blue-200 mb-4" />
                            <h4 className="text-lg font-black leading-tight mb-2 tracking-tight">AI Strategy Update</h4>
                            <p className="text-xs font-medium text-blue-100 uppercase tracking-widest leading-relaxed mb-6">
                                You have a 12% higher success rate on Wednesdays. Consider timing your next proposal.
                            </p>
                            <button className="text-[10px] font-black uppercase tracking-widest underline decoration-2 underline-offset-4 hover:text-blue-200 transition-colors">
                                View analysis
                            </button>
                        </div>
                        <TrendingUp className="absolute -bottom-10 -right-10 w-48 h-48 opacity-10 group-hover:scale-110 transition-transform duration-1000" />
                    </div>

                    {/* Recent Personal Activity */}
                    <div className="bg-slate-900/50 border border-slate-800 rounded-[32px] p-8">
                        <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-8">Recent History</h4>
                        <div className="space-y-6">
                            {[
                                { title: 'Voted on #482', time: '2h ago', icon: '🗳️' },
                                { title: 'Proposal #412 funded', time: '1d ago', icon: '💰' },
                                { title: 'New Badge: Top 10%', time: '3d ago', icon: '🏆' },
                            ].map((h, i) => (
                                <div key={i} className="flex gap-4 items-start">
                                    <span className="text-sm">{h.icon}</span>
                                    <div>
                                        <p className="text-xs font-bold text-slate-200">{h.title}</p>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{h.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
