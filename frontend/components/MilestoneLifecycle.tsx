'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Target, CheckCircle2, Circle, Clock, ArrowRight, FileCheck } from 'lucide-react';

interface Milestone {
    id: string;
    title: string;
    description: string;
    amount: number;
    status: 'completed' | 'active' | 'pending';
}

const mockMilestones: Milestone[] = [
    { id: '1', title: 'MVP Development', description: 'Core smart contract implementation and initial unit tests.', amount: 250, status: 'completed' },
    { id: '2', title: 'Security Audit', description: 'Third-party code review and vulnerability mitigation.', amount: 150, status: 'active' },
    { id: '3', title: 'Mainnet Deployment', description: 'Final project launch and liquidity injection.', amount: 400, status: 'pending' },
];

export default function MilestoneLifecycle() {
    const totalAmount = mockMilestones.reduce((sum, m) => sum + m.amount, 0);
    const fundedAmount = mockMilestones.filter(m => m.status === 'completed').reduce((sum, m) => sum + m.amount, 0);
    const progress = (fundedAmount / totalAmount) * 100;

    return (
        <div className="p-8 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-[32px] overflow-hidden flex flex-col h-full">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h3 className="text-xl font-black uppercase tracking-tight text-white mb-1">Grant Milestones</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Track progress and unlock funding tiers</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center border border-blue-500/30">
                    <Target className="w-6 h-6 text-blue-500" />
                </div>
            </div>

            <div className="mb-8">
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <span className="text-2xl font-black text-white">{fundedAmount}</span>
                        <span className="text-xs font-bold text-slate-500 uppercase ml-2">/ {totalAmount} STX Funded</span>
                    </div>
                    <span className="text-sm font-black text-blue-500">{progress.toFixed(0)}%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1 }}
                        className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.4)]"
                    />
                </div>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {mockMilestones.map((ms, index) => (
                    <motion.div
                        key={ms.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-5 rounded-[24px] border transition-all group ${ms.status === 'completed' ? 'bg-green-500/5 border-green-500/20' :
                                ms.status === 'active' ? 'bg-blue-500/5 border-blue-500/20' :
                                    'bg-white/5 border-white/5'
                            }`}
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                                {ms.status === 'completed' ? (
                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                ) : ms.status === 'active' ? (
                                    <Clock className="w-5 h-5 text-blue-500 animate-pulse" />
                                ) : (
                                    <Circle className="w-5 h-5 text-slate-700" />
                                )}
                                <div>
                                    <h4 className={`text-xs font-black uppercase tracking-tight ${ms.status === 'completed' ? 'text-green-500' :
                                            ms.status === 'active' ? 'text-white' :
                                                'text-slate-500'
                                        }`}>{ms.title}</h4>
                                    <p className="text-[9px] font-bold text-slate-500 uppercase">{ms.amount} STX Allocated</p>
                                </div>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${ms.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                                    ms.status === 'active' ? 'bg-blue-500/10 text-blue-500' :
                                        'bg-slate-950 text-slate-600'
                                }`}>
                                {ms.status}
                            </span>
                        </div>

                        <p className="text-[11px] font-medium text-slate-400 leading-relaxed italic mb-4">
                            "{ms.description}"
                        </p>

                        {ms.status === 'active' && (
                            <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-[9px] font-black text-white uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-blue-900/40">
                                <FileCheck className="w-3.5 h-3.5" />
                                Submit Proof of Completion
                                <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                            </button>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
