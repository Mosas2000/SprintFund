'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Target, Users, AlertCircle } from 'lucide-react';

interface QuorumMonitorProps {
    currentVoters: number;
    totalMembers: number;
    quorumThreshold: number; // e.g., 0.1 for 10%
}

export default function QuorumMonitor({ currentVoters = 45, totalMembers = 200, quorumThreshold = 0.25 }: QuorumMonitorProps) {
    const quorumCount = Math.ceil(totalMembers * quorumThreshold);
    const progress = (currentVoters / quorumCount) * 100;
    const isQuorumMet = currentVoters >= quorumCount;

    return (
        <div className="p-8 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-[32px] overflow-hidden relative group">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-white mb-1">Quorum Status</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Platform participation tracking</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${isQuorumMet ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'
                    }`}>
                    {isQuorumMet ? 'Threshold Met' : 'In Progress'}
                </div>
            </div>

            <div className="flex items-end gap-4 mb-6">
                <span className="text-5xl font-black text-white leading-none">{currentVoters}</span>
                <div className="pb-1">
                    <p className="text-[10px] font-black text-slate-500 uppercase mb-0.5">Active Voters</p>
                    <p className="text-xs font-bold text-white uppercase">/ {quorumCount} Required</p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="relative h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(progress, 100)}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={`h-full rounded-full ${isQuorumMet ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]' : 'bg-orange-500 shadow-[0_0_15px_rgba(234,88,12,0.5)]'
                        }`}
                />

                {/* Threshold Marker */}
                <div className="absolute top-0 bottom-0 w-[2px] bg-white/20" style={{ left: '100%' }} />
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5 group-hover:border-white/10 transition-colors">
                    <Target className="w-4 h-4 text-orange-500" />
                    <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase mb-0.5">Threshold</p>
                        <p className="text-xs font-bold text-white uppercase">{(quorumThreshold * 100).toFixed(0)}% Total</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5 group-hover:border-white/10 transition-colors">
                    <Users className="w-4 h-4 text-blue-500" />
                    <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase mb-0.5">Participation</p>
                        <p className="text-xs font-bold text-white uppercase">{((currentVoters / totalMembers) * 100).toFixed(1)}%</p>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex items-center gap-2 p-4 bg-orange-500/5 rounded-xl border border-orange-500/10">
                <AlertCircle className="w-4 h-4 text-orange-500 shrink-0" />
                <p className="text-[10px] font-medium text-slate-400 leading-relaxed uppercase tracking-tight">
                    {isQuorumMet
                        ? "Governance threshold achieved. Proposals are eligible for execution."
                        : `Need ${quorumCount - currentVoters} more voters to reach platform quorum.`}
                </p>
            </div>
        </div>
    );
}
