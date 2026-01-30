'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Calendar } from 'lucide-react';

export default function ParticipationHeatmap() {
    // Simulating 7 days x 12 intervals
    const grid = Array.from({ length: 84 }).map(() => Math.random());

    return (
        <div className="p-8 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-[40px] overflow-hidden">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h3 className="text-xl font-black uppercase tracking-tight text-white mb-1">Activity Pulse</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Synchronized governance participation heatmap</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-purple-600/10 flex items-center justify-center border border-purple-500/30">
                    <Calendar className="w-6 h-6 text-purple-500" />
                </div>
            </div>

            <div className="grid grid-cols-12 gap-1 mb-6">
                {grid.map((val, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.005 }}
                        className="aspect-square rounded-[4px] transition-all hover:scale-125 cursor-help"
                        style={{
                            backgroundColor: `rgba(234, 88, 12, ${val})`,
                            border: val > 0.8 ? '1px solid rgba(255,255,255,0.2)' : 'none'
                        }}
                        title={`${(val * 100).toFixed(0)}% Participation`}
                    />
                ))}
            </div>

            <div className="flex justify-between items-center text-[8px] font-black text-slate-600 uppercase tracking-widest">
                <span>Low Intensity</span>
                <div className="flex gap-1">
                    {[0.1, 0.3, 0.5, 0.7, 0.9].map(o => (
                        <div key={o} className="w-2 h-2 rounded-sm" style={{ backgroundColor: `rgba(234, 88, 12, ${o})` }} />
                    ))}
                </div>
                <span>Peak Load</span>
            </div>

            <div className="mt-8 p-6 bg-black/40 rounded-[24px] border border-white/5">
                <p className="text-[10px] font-medium text-slate-400 leading-relaxed uppercase tracking-tighter italic">
                    Platform peak activity detected on <span className="text-white font-black">Wednesday 14:00 UTC</span>. Suggesting high-impact proposals be submitted during these intervals.
                </p>
            </div>
        </div>
    );
}
