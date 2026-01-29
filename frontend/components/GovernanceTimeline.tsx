'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { History, CheckCircle2, XCircle, Clock, Zap } from 'lucide-react';

const governanceEvents = [
    {
        id: '1',
        type: 'executed',
        title: 'Increase Micro-Grant Cap',
        description: 'Platform cap increased from 500 STX to 1000 STX per proposal.',
        date: 'Jan 28, 2024',
        voters: 452
    },
    {
        id: '2',
        type: 'failed',
        title: 'Reduced Voting Period',
        description: 'Proposal to reduce voting window to 12 hours failed quorum.',
        date: 'Jan 25, 2024',
        voters: 124
    },
    {
        id: '3',
        type: 'executed',
        title: 'Infrastructure Tier Activation',
        description: 'New category for core protocol tooling enabled with 2x matching.',
        date: 'Jan 20, 2024',
        voters: 398
    }
];

export default function GovernanceTimeline() {
    return (
        <div className="p-8 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-[32px] overflow-hidden relative">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-white mb-1">Governance History</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Interactive timeline of platform evolution</p>
                </div>
                <History className="w-5 h-5 text-slate-500" />
            </div>

            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/5 before:to-transparent">
                {governanceEvents.map((event, index) => (
                    <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
                    >
                        {/* Dot */}
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-slate-900 absolute left-0 md:left-1/2 md:-ml-5 z-10 transition-colors group-hover:border-orange-500/50 shadow-xl">
                            {event.type === 'executed' ? (
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                            ) : (
                                <XCircle className="w-5 h-5 text-red-500" />
                            )}
                        </div>

                        {/* Content Card */}
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-white/5 border border-white/5 group-hover:bg-white/[0.07] group-hover:border-white/10 transition-all">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 group-hover:text-orange-500 transition-colors">
                                    {event.date}
                                </span>
                                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-950 rounded text-[8px] font-black text-slate-400 uppercase">
                                    <Zap className="w-2.5 h-2.5" />
                                    {event.voters} Voters
                                </div>
                            </div>
                            <h4 className="text-sm font-black text-white uppercase tracking-tight mb-2 group-hover:text-orange-500 transition-colors">
                                {event.title}
                            </h4>
                            <p className="text-xs font-medium text-slate-400 leading-relaxed italic">
                                "{event.description}"
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <button className="w-full mt-10 py-4 bg-white/5 hover:bg-white/10 text-[10px] font-black text-slate-400 uppercase tracking-widest transition-all rounded-2xl border border-white/5 group">
                Exploration Mode: View Full Archive <Clock className="inline w-3 h-3 ml-2 group-hover:animate-spin" />
            </button>
        </div>
    );
}
