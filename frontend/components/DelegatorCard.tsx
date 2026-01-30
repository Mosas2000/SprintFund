'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface DelegatorCardProps {
    name: string;
    handle: string;
    weight: string;
    votingRate: string;
    successRate: string;
    tags: string[];
}

export default function DelegatorCard({ name, handle, weight, votingRate, successRate, tags }: DelegatorCardProps) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="p-6 rounded-2xl border border-white/5 bg-slate-900 hover:bg-slate-800/80 transition-all group relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08s5.97 1.09 6 3.08c-1.29 1.94-3.5 3.22-6 3.22z" />
                </svg>
            </div>

            <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center font-black text-white text-xl">
                        {name[0]}
                    </div>
                    <div>
                        <h3 className="font-bold text-white group-hover:text-orange-400 transition-colors">{name}</h3>
                        <p className="text-xs text-slate-500">{handle}</p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-2 py-4 border-y border-white/5">
                    <div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Weight</p>
                        <p className="text-sm font-black text-white">{weight}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Activity</p>
                        <p className="text-sm font-black text-white">{votingRate}%</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Impact</p>
                        <p className="text-sm font-black text-white">{successRate}%</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] text-slate-400 font-semibold border border-white/5 uppercase tracking-tighter">
                            {tag}
                        </span>
                    ))}
                </div>

                <button className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-orange-600 text-white text-sm font-bold transition-all border border-white/10 hover:border-orange-500">
                    Delegate Weight
                </button>
            </div>
        </motion.div>
    );
}
