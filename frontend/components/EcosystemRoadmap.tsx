'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Flag, Check, Zap, Rocket, Globe } from 'lucide-react';

const roadmap = [
    { q: 'Q4 2023', title: 'Genesis Alpha', status: 'completed', desc: 'Mainnet launch of the core quadratic engine.' },
    { q: 'Q1 2024', title: 'Advocacy Tier', status: 'active', desc: 'Implementation of delegation and reputation systems.' },
    { q: 'Q2 2024', title: 'Flash-Escrow', status: 'pending', desc: 'Automated milestone-based fund releases.' },
    { q: 'Q3 2024', title: 'Cross-Chain Grants', status: 'pending', desc: 'Interoperable funding via sBTC integration.' },
];

export default function EcosystemRoadmap() {
    return (
        <div className="p-10 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-[48px] overflow-hidden">
            <div className="flex justify-between items-start mb-16">
                <div>
                    <h3 className="text-4xl font-black uppercase tracking-tight text-white mb-2 leading-none">Vanguard Roadmap</h3>
                    <p className="text-sm font-bold text-slate-500 uppercase">The evolution of SprintFund protocol</p>
                </div>
                <Rocket className="w-12 h-12 text-orange-600/50" />
            </div>

            <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-[23px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-600 via-white/10 to-transparent" />

                <div className="space-y-12">
                    {roadmap.map((step, i) => (
                        <motion.div
                            key={step.q}
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex gap-10 group"
                        >
                            <div className={`shrink-0 w-12 h-12 rounded-2xl border flex items-center justify-center relative z-10 transition-all ${step.status === 'completed' ? 'bg-orange-600 border-orange-500 shadow-xl shadow-orange-900/40 text-white' :
                                    step.status === 'active' ? 'bg-white/10 border-white/20 text-orange-500' :
                                        'bg-slate-950 border-white/5 text-slate-700'
                                }`}>
                                {step.status === 'completed' ? <Check className="w-6 h-6" /> : <Flag className="w-5 h-5" />}
                            </div>

                            <div className="flex-1 pb-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${step.status === 'active' ? 'text-orange-500' : 'text-slate-600'
                                        }`}>{step.q}</span>
                                    {step.status === 'active' && (
                                        <div className="px-2 py-0.5 bg-orange-500/10 rounded text-[8px] font-black text-orange-500 uppercase animate-pulse">In Progress</div>
                                    )}
                                </div>
                                <h4 className="text-xl font-black text-white uppercase tracking-tight mb-2 group-hover:text-orange-600 transition-colors">
                                    {step.title}
                                </h4>
                                <p className="text-sm font-medium text-slate-400 leading-relaxed uppercase tracking-tighter italic">
                                    "{step.desc}"
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
