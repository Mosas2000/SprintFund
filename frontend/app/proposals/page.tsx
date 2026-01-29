'use client';

import React from 'react';
import Header from '@/components/Header';
import GovernanceTimeline from '@/components/GovernanceTimeline';
import QuorumMonitor from '@/components/QuorumMonitor';
import BulkVotingQueue from '@/components/BulkVotingQueue';
import AuditTrail from '@/components/AuditTrail';
import ParticipationHeatmap from '@/components/ParticipationHeatmap';
import EcosystemRoadmap from '@/components/EcosystemRoadmap';
import { motion } from 'framer-motion';

export default function GovernancePage() {
    return (
        <div className="min-h-screen bg-transparent">
            <Header />

            <main className="pt-32 pb-20 px-8 max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row justify-between items-end gap-12 mb-20">
                    <div className="max-w-2xl">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-7xl font-black text-white uppercase tracking-tighter mb-8 leading-none"
                        >
                            Vanguard <br /> Governance
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl font-medium text-slate-400 uppercase tracking-tighter leading-relaxed"
                        >
                            Radical transparency for the Stacks ecosystem. Every vote, every block, every decision—recorded forever.
                        </motion.p>
                    </div>

                    <NetworkStatus />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    <div className="lg:col-span-2">
                        <QuorumMonitor currentVoters={78} totalMembers={150} quorumThreshold={0.4} />
                    </div>
                    <div className="lg:col-span-1">
                        <BulkVotingQueue />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <GovernanceTimeline />
                    <ParticipationHeatmap />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    <div className="lg:col-span-1">
                        <AuditTrail />
                    </div>
                    <div className="lg:col-span-2">
                        <EcosystemRoadmap />
                    </div>
                </div>
            </main>
        </div>
    );
}

function NetworkStatus() {
    return (
        <div className="flex items-center gap-6 px-8 py-4 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl">
            <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)] animate-pulse" />
                <span className="text-xs font-black text-white uppercase tracking-widest">Mainnet Live</span>
            </div>
            <div className="h-6 w-[1px] bg-white/10" />
            <div>
                <p className="text-[8px] font-black text-slate-500 uppercase mb-0.5 tracking-[0.2em]">Gas Price</p>
                <p className="text-xs font-black text-white uppercase">0.0012 STX</p>
            </div>
        </div>
    );
}
