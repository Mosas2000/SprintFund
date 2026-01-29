'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Award, Star, TrendingUp, Filter } from 'lucide-react';

const members = [
    { address: 'SP12...ABCD', name: 'Mosa', reputation: 4.9, proposals: 12, votes: 456, joined: 'Oct 2023' },
    { address: 'SP34...EFGH', name: 'Stark', reputation: 4.8, proposals: 8, votes: 312, joined: 'Nov 2023' },
    { address: 'SP56...IJKL', name: 'Alice', reputation: 4.7, proposals: 15, votes: 890, joined: 'Dec 2023' },
    { address: 'SP78...MNOP', name: 'Bob', reputation: 4.6, proposals: 4, votes: 120, joined: 'Jan 2024' },
];

export default function CommunityDirectory() {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="pt-32 pb-20 px-8 max-w-7xl mx-auto min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
                <div className="max-w-xl">
                    <h2 className="text-6xl font-black text-white uppercase tracking-tighter mb-6 leading-none">Citizen Register</h2>
                    <p className="text-lg font-medium text-slate-400 uppercase tracking-tighter leading-relaxed">
                        Transparent profiles for every contributor, voter, and delegate. Reputation is earned, not bought.
                    </p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="SEARCH CITIZENS..."
                            className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:border-orange-500 transition-all text-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all">
                        <Filter className="w-5 h-5 text-slate-400" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {members.map((m, i) => (
                    <motion.div
                        key={m.address}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="p-8 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-[40px] group hover:bg-slate-900/80 transition-all border-b-4 border-b-transparent hover:border-b-orange-600"
                    >
                        <div className="w-20 h-20 rounded-3xl bg-slate-900 border border-white/10 flex items-center justify-center text-xl font-black text-orange-500 mb-8 mx-auto group-hover:scale-110 transition-transform">
                            {m.name.charAt(0)}
                        </div>

                        <div className="text-center mb-8">
                            <h4 className="text-lg font-black text-white uppercase tracking-tight mb-1">{m.name}</h4>
                            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{m.address}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="p-4 bg-black/40 rounded-2xl border border-white/5 text-center">
                                <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Reputation</p>
                                <p className="text-xs font-black text-white">{m.reputation}</p>
                            </div>
                            <div className="p-4 bg-black/40 rounded-2xl border border-white/5 text-center">
                                <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Proposals</p>
                                <p className="text-xs font-black text-white">{m.proposals}</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between px-2">
                            <span className="text-[9px] font-bold text-slate-600 uppercase">Joined {m.joined}</span>
                            <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                <span className="text-[9px] font-black text-white">4.9</span>
                            </div>
                        </div>

                        <button className="w-full mt-8 py-4 bg-white/5 hover:bg-orange-600 text-[9px] font-black text-slate-400 group-hover:text-white uppercase tracking-widest transition-all rounded-2xl border border-white/5">
                            VIEW FULL PROFILE
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
