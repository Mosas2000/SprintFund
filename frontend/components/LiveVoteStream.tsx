'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VoteEvent {
    id: string;
    voter: string;
    type: 'YES' | 'NO';
    weight: string;
    timestamp: Date;
}

export default function LiveVoteStream() {
    const [votes, setVotes] = useState<VoteEvent[]>([]);

    useEffect(() => {
        // Simulate live data stream
        const interval = setInterval(() => {
            const newVote: VoteEvent = {
                id: Math.random().toString(36).substr(2, 9),
                voter: `${Math.random().toString(36).substr(2, 5)}.btc`,
                type: Math.random() > 0.4 ? 'YES' : 'NO',
                weight: (Math.random() * 1000).toFixed(0),
                timestamp: new Date()
            };
            setVotes(prev => [newVote, ...prev].slice(0, 10));
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between px-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    Live Governance Stream
                </span>
                <span className="text-[10px] text-slate-500">REAL-TIME</span>
            </div>

            <div className="space-y-2">
                <AnimatePresence initial={false}>
                    {votes.map(vote => (
                        <motion.div
                            key={vote.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="p-3 rounded-lg bg-white/5 border border-white/5 flex items-center justify-between"
                        >
                            <div className="flex flex-col">
                                <span className="text-xs font-mono text-slate-300">{vote.voter}</span>
                                <span className="text-[10px] text-slate-500">{vote.timestamp.toLocaleTimeString()}</span>
                            </div>
                            <div className="text-right">
                                <div className={`text-xs font-bold ${vote.type === 'YES' ? 'text-green-400' : 'text-red-400'}`}>
                                    {vote.type} {vote.weight} STX
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
