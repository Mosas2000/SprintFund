'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Database, ArrowUpRight, Shield, Globe } from 'lucide-react';

const allocationData = [
    { name: 'Active Grants', value: 45000, color: '#EA580C' },
    { name: 'Matching Pool', value: 25000, color: '#3B82F6' },
    { name: 'Operational Fund', value: 10000, color: '#10B981' },
    { name: 'Safety Reserve', value: 20000, color: '#6366F1' },
];

export default function TreasuryTransparency() {
    const totalTreasury = allocationData.reduce((sum, item) => sum + item.value, 0);

    return (
        <div className="p-8 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-[40px] overflow-hidden">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h3 className="text-xl font-black uppercase tracking-tight text-white mb-1">Treasury Watch</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Real-time on-chain capital distribution</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-green-600/10 flex items-center justify-center border border-green-500/30">
                    <Globe className="w-6 h-6 text-green-500" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-10">
                <div className="h-64 relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={allocationData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={8}
                                dataKey="value"
                            >
                                {allocationData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', fontSize: '10px' }}
                                itemStyle={{ color: '#fff' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-2xl font-black text-white">{totalTreasury / 1000}k</span>
                        <span className="text-[10px] font-black text-slate-500 uppercase">STX Total</span>
                    </div>
                </div>

                <div className="space-y-4">
                    {allocationData.map((item) => (
                        <div key={item.name} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                                <span className="text-[10px] font-black text-white uppercase tracking-wider">{item.name}</span>
                            </div>
                            <span className="text-xs font-black text-slate-400">{((item.value / totalTreasury) * 100).toFixed(0)}%</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="p-4 bg-black/40 rounded-2xl border border-white/5 text-center">
                    <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Matching Mult.</p>
                    <p className="text-lg font-black text-white">4.2x</p>
                </div>
                <div className="p-4 bg-black/40 rounded-2xl border border-white/5 text-center">
                    <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Burn Rate</p>
                    <p className="text-lg font-black text-white">2k/mo</p>
                </div>
                <div className="p-4 bg-black/40 rounded-2xl border border-white/5 text-center">
                    <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Health Score</p>
                    <p className="text-lg font-black text-green-500">A+</p>
                </div>
            </div>

            <button className="w-full flex items-center justify-between p-5 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] transition-all group border border-white/5">
                FULL AUDIT TRAIL (CSV)
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
        </div>
    );
}
