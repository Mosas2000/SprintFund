'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Sparkles, Brain, Zap, Target, AlertCircle, ArrowRight, BarChart3, Globe } from 'lucide-react';
import ProbabilityCalculator from './ProbabilityCalculator';
import OptimizationPanel from './OptimizationPanel';

const growthData = [
    { month: 'Jan', total: 400, predicted: 420 },
    { month: 'Feb', total: 600, predicted: 680 },
    { month: 'Mar', total: 850, predicted: 1020 },
    { month: 'Apr', total: null, predicted: 1450 },
    { month: 'May', total: null, predicted: 1890 },
    { month: 'Jun', total: null, predicted: 2450 },
];

export default function PredictionsTab() {
    return (
        <div className="p-10 space-y-16 max-w-7xl mx-auto">
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

            {/* Industrial Probability Engine */}
            <section className="bg-slate-900/50 border border-slate-800 rounded-[64px] p-12 backdrop-blur-xl shadow-2xl">
                <div className="flex items-center gap-3 mb-12">
                    <Zap className="w-5 h-5 text-orange-500" />
                    <h3 className="text-xl font-black text-white uppercase tracking-widest">Sovereign Probability Engine v4.2</h3>
                </div>
                <ProbabilityCalculator />
            </section>

            {/* Strategic Optimization Hub */}
            <section className="bg-slate-950/40 border border-slate-800 rounded-[64px] p-12 backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-12">
                    <Target className="w-5 h-5 text-orange-500" />
                    <h3 className="text-xl font-black text-white uppercase tracking-widest">Strategic Refinement Hub</h3>
                </div>
                <OptimizationPanel />
            </section>

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
