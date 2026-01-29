'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Check, Plus, Tag } from 'lucide-react';

const CATEGORIES = ['DeFi', 'NFT', 'DAO', 'Infrastructure', 'Community', 'Gaming', 'Education', 'Security'];

export default function InterestProfiler() {
    const [selected, setSelected] = useState<string[]>(['DeFi', 'Infrastructure']);

    const toggleCategory = (cat: string) => {
        if (selected.includes(cat)) {
            setSelected(selected.filter(c => c !== cat));
        } else {
            setSelected([...selected, cat]);
        }
    };

    return (
        <div className="p-8 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-[32px] overflow-hidden">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h3 className="text-xl font-black uppercase tracking-tight text-white mb-1">Interest Profiler</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Personalize your recommendation engine</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-purple-600/10 flex items-center justify-center border border-purple-500/30">
                    <Brain className="w-6 h-6 text-purple-500" />
                </div>
            </div>

            <div className="flex flex-wrap gap-3 mb-10">
                {CATEGORIES.map((cat) => {
                    const isSelected = selected.includes(cat);
                    return (
                        <button
                            key={cat}
                            onClick={() => toggleCategory(cat)}
                            className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${isSelected ? 'bg-orange-600 border-orange-500 text-white shadow-xl shadow-orange-950/40' : 'bg-white/5 border-white/5 text-slate-500 hover:text-white hover:border-white/10'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                {isSelected ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                                {cat}
                            </div>
                        </button>
                    );
                })}
            </div>

            <div className="p-6 bg-black/40 rounded-[24px] border border-white/5">
                <div className="flex items-center gap-3 mb-4">
                    <Tag className="w-4 h-4 text-blue-500" />
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">Active Filters</h4>
                </div>
                <p className="text-[11px] font-medium text-slate-400 leading-relaxed uppercase tracking-tighter">
                    Your dashboard will prioritize <span className="text-white font-black">{selected.length} categories</span>. We'll alert you when high-impact proposals matching these tags are submitted.
                </p>
            </div>
        </div>
    );
}
