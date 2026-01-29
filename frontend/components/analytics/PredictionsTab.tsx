'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Sparkles, Brain, Zap, Target, AlertCircle, ArrowRight, BarChart3, Globe } from 'lucide-react';
import { predictProposalSuccess } from '@/utils/successPredictor';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const growthData = [
    { month: 'Jan', total: 400, predicted: 420 },
    { month: 'Feb', total: 600, predicted: 680 },
    { month: 'Mar', total: 850, predicted: 1020 },
    { month: 'Apr', total: null, predicted: 1450 },
    { month: 'May', total: null, predicted: 1890 },
    { month: 'Jun', total: null, predicted: 2450 },
];

export default function PredictionsTab() {
    const [simulation, setSimulation] = useState({
        title: '',
        description: '',
        category: 'Infrastructure',
        hasMedia: false,
        reputation: 4.5
    });

    const prediction = predictProposalSuccess({
        titleLength: simulation.title.length,
        descLength: simulation.description.length,
        category: simulation.category,
        hasMedia: simulation.hasMedia,
        proposerReputation: simulation.reputation
    });

    return (
        <div className="p-10 space-y-12 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                <div className="max-w-xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-orange-600/20 flex items-center justify-center border border-orange-500/30">
                            <Brain className="w-6 h-6 text-orange-500" />
                        </div>
                        <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">Predictive <br /> Intelligence</h2>
                    </div>
                    <p className="text-lg font-medium text-slate-500 uppercase tracking-tighter leading-relaxed">
                        Leveraging historical governance data and behavioral patterns to forecast platform evolution and proposal outcomes.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                    <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl text-center">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Model Accuracy</p>
                        <p className="text-2xl font-black text-white">92.4%</p>
                    </div>
                    <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl text-center">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Data Points</p>
                        <p className="text-2xl font-black text-white">45.2K</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Simulation Sandbox */}
                <section className="bg-slate-900/50 border border-slate-800 rounded-[48px] p-10 backdrop-blur-xl group hover:border-slate-700 transition-all">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-sm font-black uppercase tracking-[0.3em] text-slate-400">Proposal Sandbox</h3>
                        <Zap className="w-5 h-5 text-orange-500" />
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Target Title</label>
                            <input
                                type="text"
                                placeholder="Enter hypothetical title..."
                                className="w-full bg-black/40 border border-white/5 rounded-2xl p-5 text-white placeholder-slate-700 outline-none focus:border-orange-500/50 transition-all font-medium"
                                onChange={(e) => setSimulation({ ...simulation, title: e.target.value })}
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Technical Description</label>
                            <textarea
                                rows={4}
                                placeholder="Detail the technical merit..."
                                className="w-full bg-black/40 border border-white/5 rounded-2xl p-5 text-white placeholder-slate-700 outline-none focus:border-orange-500/50 transition-all font-medium resize-none"
                                onChange={(e) => setSimulation({ ...simulation, description: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Category</label>
                                <select
                                    className="w-full bg-black/40 border border-white/5 rounded-2xl p-5 text-slate-300 outline-none appearance-none"
                                    onChange={(e) => setSimulation({ ...simulation, category: e.target.value })}
                                >
                                    <option>Infrastructure</option>
                                    <option>DeFi</option>
                                    <option>Education</option>
                                    <option>Gaming</option>
                                </select>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Media Attachments</label>
                                <button
                                    onClick={() => setSimulation({ ...simulation, hasMedia: !simulation.hasMedia })}
                                    className={`w-full p-5 rounded-2xl border transition-all text-xs font-black uppercase tracking-widest ${simulation.hasMedia ? 'bg-orange-600 border-orange-500 text-white' : 'bg-black/40 border-white/5 text-slate-500'
                                        }`}
                                >
                                    {simulation.hasMedia ? 'INCLUDED' : 'MISSING'}
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Prediction Output */}
                <section className="space-y-10">
                    <div className="bg-slate-900 border border-slate-800 rounded-[48px] p-12 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                            <Target className="w-48 h-48 text-orange-500" />
                        </div>

                        <div className="relative z-10 flex flex-col items-center text-center">
                            <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em] mb-6">Confidence Score</p>
                            <div className="relative mb-8">
                                <svg className="w-48 h-48 -rotate-90">
                                    <circle cx="96" cy="96" r="88" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                                    <motion.circle
                                        cx="96" cy="96" r="88" fill="none"
                                        stroke="#EA580C" strokeWidth="12"
                                        strokeDasharray="553"
                                        initial={{ strokeDashoffset: 553 }}
                                        animate={{ strokeDashoffset: 553 - (553 * (prediction.probability / 100)) }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                        strokeLinecap="round"
                                        className="drop-shadow-[0_0_10px_rgba(234,88,12,0.4)]"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-5xl font-black text-white">{prediction.probability}%</span>
                                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Success</span>
                                </div>
                            </div>

                            <div className={`px-6 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest mb-10 ${prediction.rating === 'EXCELLENT' ? 'bg-green-500/10 border-green-500/30 text-green-500' :
                                    prediction.rating === 'STRONG' ? 'bg-blue-500/10 border-blue-500/30 text-blue-500' :
                                        'bg-orange-500/10 border-orange-500/30 text-orange-500'
                                }`}>
                                {prediction.rating} PROPOSAL CANDIDATE
                            </div>

                            <div className="w-full space-y-3">
                                {prediction.tips.length > 0 ? (
                                    prediction.tips.map((tip, i) => (
                                        <div key={i} className="flex items-center gap-3 p-4 bg-orange-600/5 border border-orange-500/10 rounded-2xl text-left">
                                            <AlertCircle className="w-4 h-4 text-orange-500 shrink-0" />
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{tip}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex items-center gap-3 p-4 bg-green-500/5 border border-green-500/10 rounded-2xl">
                                        <Target className="w-4 h-4 text-green-500" />
                                        <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Optimal Submission Parameters Met</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="p-8 bg-black/40 border border-white/5 rounded-[40px] flex items-center justify-between group cursor-help transition-all hover:bg-black/60">
                        <div>
                            <p className="text-xs font-black text-white uppercase tracking-tight mb-1">Benchmarking Algorithm</p>
                            <p className="text-[10px] font-bold text-slate-600 uppercase">Comparison against 12,000+ similar grants</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-slate-700 group-hover:text-orange-500 transition-all" />
                    </div>
                </section>
            </div>

            {/* Ecosystem Forecasting */}
            <section className="bg-slate-900 border border-slate-800 rounded-[48px] p-12">
                <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-16">
                    <div>
                        <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2">Growth Projection</h3>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Exponential participation model v4.1</p>
                    </div>
                    <div className="flex gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-slate-700" />
                            <span className="text-[10px] font-black text-slate-500 uppercase">Historical</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-orange-600 shadow-[0_0_10px_rgba(234,88,12,0.4)]" />
                            <span className="text-[10px] font-black text-orange-500 uppercase">Forecast</span>
                        </div>
                    </div>
                </div>

                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={growthData}>
                            <defs>
                                <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#EA580C" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#EA580C" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                            <XAxis
                                dataKey="month"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px', fontSize: '10px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="total"
                                stroke="#475569"
                                strokeWidth={4}
                                fill="transparent"
                            />
                            <Area
                                type="monotone"
                                dataKey="predicted"
                                stroke="#EA580C"
                                strokeWidth={4}
                                fill="url(#growthGradient)"
                                strokeDasharray="10 10"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { title: 'Projected Quorum', value: '74%', icon: Target, desc: 'Likely participation for upcoming Q2 cycles.' },
                        { title: 'Treasury Stability', value: 'High', icon: Globe, desc: '98% confidence in 12-month capital runway.' },
                        { title: 'Network Load', value: 'Optimal', icon: BarChart3, desc: 'Gas costs predicted to remain stable.' },
                    ].map((stat, i) => (
                        <div key={i} className="p-8 bg-black/40 border border-white/5 rounded-[32px] group hover:bg-white/5 transition-all">
                            <stat.icon className="w-8 h-8 text-slate-700 mb-6 group-hover:text-orange-500 transition-colors" />
                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">{stat.title}</h4>
                            <p className="text-2xl font-black text-white mb-4">{stat.value}</p>
                            <p className="text-[10px] font-medium text-slate-600 leading-relaxed uppercase tracking-tight">{stat.desc}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
