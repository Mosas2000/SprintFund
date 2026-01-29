'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Shield, ArrowRight, Star, Search } from 'lucide-react';

const delegates = [
    { address: 'SP12...ABCD', name: 'Mosa', reputation: 4.9, activeVotes: 156, categories: ['DeFi', 'Infrastructure'] },
    { address: 'SP34...EFGH', name: 'Stark', reputation: 4.8, activeVotes: 98, categories: ['DAO', 'Security'] },
    { address: 'SP56...IJKL', name: 'Alice', reputation: 4.7, activeVotes: 234, categories: ['NFT', 'Community'] },
];

export default function VoteDelegationSystem() {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="p-8 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-[32px] overflow-hidden flex flex-col h-full">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h3 className="text-xl font-black uppercase tracking-tight text-white mb-1">Voting Delegation</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Delegate your power to trusted advocates</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-orange-600/10 flex items-center justify-center border border-orange-500/30">
                    <Shield className="w-6 h-6 text-orange-500" />
                </div>
            </div>

            <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                    type="text"
                    placeholder="SEARCH REGISTERED DELEGATES..."
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:border-orange-500 transition-all text-white placeholder:text-slate-600"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {delegates.map((delegate) => (
                    <motion.div
                        key={delegate.address}
                        whileHover={{ x: 5 }}
                        className="p-4 bg-white/5 border border-white/5 rounded-[24px] hover:bg-white/10 hover:border-white/10 transition-all group cursor-pointer"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-xs font-black text-slate-500 group-hover:bg-orange-600 group-hover:text-white transition-all">
                                    {delegate.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="text-xs font-black text-white uppercase">{delegate.name}</h4>
                                    <p className="text-[9px] font-bold text-slate-500 uppercase">{delegate.address}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 px-2 py-0.5 bg-yellow-500/10 rounded text-yellow-500 text-[9px] font-black uppercase">
                                <Star className="w-3 h-3 fill-yellow-500" /> {delegate.reputation}
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                            {delegate.categories.map(cat => (
                                <span key={cat} className="px-2 py-0.5 bg-white/5 border border-white/5 rounded text-[8px] font-black text-slate-400 uppercase tracking-tighter group-hover:text-white transition-colors">
                                    {cat}
                                </span>
                            ))}
                        </div>

                        <button className="w-full flex items-center justify-between p-3 bg-slate-950 rounded-xl text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover:bg-orange-600 group-hover:text-white transition-all">
                            DELEGATE VOTING POWER
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </motion.div>
                ))}
            </div>

            <div className="mt-8 pt-6 border-t border-white/5">
                <div className="flex items-center justify-between px-2">
                    <div>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Your Delegation</p>
                        <p className="text-xs font-black text-white uppercase italic">No active delegates</p>
                    </div>
                    <button className="text-[9px] font-black text-orange-500 uppercase tracking-widest hover:underline decoration-2 underline-offset-4">
                        Become a delegate
                    </button>
                </div>
            </div>
        </div>
    );
}
