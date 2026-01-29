'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, X, ArrowRight, Zap, ListChecks } from 'lucide-react';

interface QueuedVote {
    id: string;
    title: string;
    weight: number;
}

export default function BulkVotingQueue() {
    const [queue, setQueue] = useState<QueuedVote[]>([
        { id: '1', title: 'Stacks Wallet Integration', weight: 4 },
        { id: '2', title: 'Ecosystem Analytics Bot', weight: 9 },
        { id: '3', title: 'Developer Docs Refresh', weight: 1 },
    ]);

    const totalCost = queue.reduce((sum, v) => sum + Math.pow(v.weight, 2), 0);

    const removeFromQueue = (id: string) => {
        setQueue(queue.filter(v => v.id !== id));
    };

    return (
        <div className="p-8 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-[32px] overflow-hidden flex flex-col h-full">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h3 className="text-xl font-black uppercase tracking-tight text-white mb-1">Voting Queue</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Batch your quadratic votes for gas efficiency</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-purple-600/10 flex items-center justify-center border border-purple-500/30">
                    <Layers className="w-6 h-6 text-purple-500" />
                </div>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar mb-8">
                <AnimatePresence mode="popLayout">
                    {queue.map((v) => (
                        <motion.div
                            key={v.id}
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between group"
                        >
                            <div>
                                <h4 className="text-[10px] font-black text-white uppercase tracking-tight mb-1">{v.title}</h4>
                                <div className="flex items-center gap-2">
                                    <span className="text-[9px] font-bold text-purple-500 uppercase">Weight: {v.weight}</span>
                                    <span className="text-[8px] font-black text-slate-600">|</span>
                                    <span className="text-[9px] font-bold text-orange-500 uppercase">Cost: {Math.pow(v.weight, 2)} STX</span>
                                </div>
                            </div>
                            <button
                                onClick={() => removeFromQueue(v.id)}
                                className="p-2 hover:bg-red-500/10 rounded-xl text-slate-600 hover:text-red-500 transition-colors"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {queue.length === 0 && (
                    <div className="h-40 flex flex-col items-center justify-center text-center opacity-40">
                        <ListChecks className="w-8 h-8 text-slate-700 mb-4" />
                        <p className="text-[10px] font-black text-slate-500 uppercase">Queue is empty</p>
                    </div>
                )}
            </div>

            <div className="p-6 bg-black/40 rounded-[24px] border border-white/5">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Estimated Total Cost</p>
                        <p className="text-2xl font-black text-white">{totalCost} <span className="text-sm text-slate-500">STX</span></p>
                    </div>
                    <div className="text-right">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Batch Savings</p>
                        <p className="text-sm font-black text-green-500">~0.12 STX GAS</p>
                    </div>
                </div>

                <button className="w-full flex items-center justify-center gap-3 py-5 bg-orange-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-orange-500 transition-all shadow-xl shadow-orange-950/40">
                    <Zap className="w-4 h-4 fill-current" />
                    EXECUTE BATCH VOTE
                </button>
            </div>
        </div>
    );
}
