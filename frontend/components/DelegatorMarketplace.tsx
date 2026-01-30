'use client';

import React, { useState } from 'react';
import DelegatorCard from './DelegatorCard';
import { motion } from 'framer-motion';

const MOCK_DELEGATORS = [
    { name: 'Hiro Protagonist', handle: '@hiro.btc', weight: '240K', votingRate: '98', successRate: '92', tags: ['Core Developer', 'Security'] },
    { name: 'Stacks Whale', handle: '@whale.stx', weight: '1.2M', votingRate: '45', successRate: '88', tags: ['Investor', 'Treasury'] },
    { name: 'Sovereign Dev', handle: '@sov.btc', weight: '15K', votingRate: '100', successRate: '95', tags: ['Early Adopter', 'Infrastructure'] },
    { name: 'Governance Ninja', handle: '@ninja.stx', weight: '88K', votingRate: '92', successRate: '85', tags: ['Community Lead', 'Growth'] },
];

export default function DelegatorMarketplace() {
    const [search, setSearch] = useState('');

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black italic uppercase text-white tracking-tighter">Delegator Marketplace</h2>
                    <p className="text-sm text-slate-500">Transparent community weight discovery system.</p>
                </div>
                <div className="relative group">
                    <input
                        type="text"
                        placeholder="Search by name, handle, or tag..."
                        className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl w-full md:w-[400px] text-white focus:outline-none focus:border-orange-500 transition-all"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <div className="absolute top-0 right-0 p-3 text-slate-500 group-focus-within:text-orange-500 transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {MOCK_DELEGATORS.map(delegator => (
                    <DelegatorCard key={delegator.handle} {...delegator} />
                ))}
            </div>

            <div className="p-8 rounded-2xl border border-white/5 bg-gradient-to-br from-orange-600/10 to-transparent flex flex-col md:flex-row items-center gap-8">
                <div className="p-4 rounded-xl bg-orange-600 text-white font-black text-2xl border border-orange-400">
                    BECOME A DELEGATOR
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h4 className="text-xl font-bold text-white mb-1">Impact the Ecosystem</h4>
                    <p className="text-sm text-slate-400">Apply to become a verified delegator and help shape the future of the SprintFund community.</p>
                </div>
                <button className="px-8 py-3 rounded-xl bg-white text-slate-950 font-black whitespace-nowrap hover:bg-orange-500 transition-all">
                    APPLY NOW
                </button>
            </div>
        </div>
    );
}
