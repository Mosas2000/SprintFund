'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip as RechartsTooltip, Cell } from 'recharts';
import { BarChart3, TrendingUp, Info } from 'lucide-react';

const benchmarkData = [
    { name: 'SprintFund', efficiency: 94, color: '#EA580C' },
    { name: 'DAO A', efficiency: 72, color: '#3B82F6' },
    { name: 'DAO B', efficiency: 58, color: '#3B82F6' },
    { name: 'Ecosys Avg', efficiency: 65, color: '#64748b' },
];

export default function EcosystemBenchmarks() {
    return (
        <div className="p-8 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-[40px] overflow-hidden">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h3 className="text-xl font-black uppercase tracking-tight text-white mb-1">Efficiency Benchmark</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Comparative funding velocity analysis</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center border border-blue-500/30">
                    <BarChart3 className="w-6 h-6 text-blue-500" />
                </div>
            </div>

            <div className="h-48 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={benchmarkData}>
                        <XAxis dataKey="name" hide />
                        <RechartsTooltip
                            contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', fontSize: '10px' }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Bar dataKey="efficiency" radius={[4, 4, 0, 0]}>
                            {benchmarkData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="space-y-4">
                {benchmarkData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">{item.name}</span>
                        </div>
                        <span className="text-xs font-black text-slate-400">{item.efficiency}%</span>
                    </div>
                ))}
            </div>

            <div className="mt-8 flex items-center gap-2 p-4 bg-blue-500/5 rounded-xl border border-blue-500/10">
                <Info className="w-4 h-4 text-blue-500 shrink-0" />
                <p className="text-[10px] font-medium text-slate-400 leading-relaxed uppercase tracking-tight">
                    SprintFund outperforms the ecosystem average by <span className="text-white font-black">29%</span> in time-to-funding resolution.
                </p>
            </div>
        </div>
    );
}
