'use client';

import React from 'react';
import LiveVoteStream from './LiveVoteStream';
import { motion } from 'framer-motion';

export default function WarRoom() {
    return (
        <div className="min-h-screen bg-slate-950 text-white p-8 font-sans selection:bg-orange-500/30">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-500 text-[10px] font-bold tracking-tighter uppercase border border-red-500/20">
                                Critical Operation
                            </span>
                            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                                System Time: {new Date().toLocaleTimeString()}
                            </span>
                        </div>
                        <h1 className="text-5xl font-black tracking-tighter italic uppercase text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-500">
                            DAO War Room
                        </h1>
                    </div>
                    <div className="flex gap-4">
                        <div className="p-4 rounded-xl border border-white/5 bg-white/5 backdrop-blur-sm min-w-[140px]">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Active STX</p>
                            <p className="text-2xl font-black text-orange-500 tabular-nums font-mono">1.28M</p>
                        </div>
                        <div className="p-4 rounded-xl border border-white/5 bg-white/5 backdrop-blur-sm min-w-[140px]">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Active Proposals</p>
                            <p className="text-2xl font-black text-white tabular-nums font-mono">14</p>
                        </div>
                    </div>
                </header>

                {/* Tactical Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Main Visualizer */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="aspect-video rounded-2xl border border-white/10 bg-slate-900 overflow-hidden relative group">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(249,115,22,0.1),transparent)]" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-32 h-32 rounded-full border-4 border-orange-500/30 border-t-orange-500 animate-spin mb-4" />
                                    <p className="text-slate-400 font-mono text-sm tracking-widest uppercase">Initializing Tactical Overlay...</p>
                                </div>
                            </div>

                            {/* Overlay UI */}
                            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-slate-500 uppercase">Current Focus</p>
                                    <p className="text-xl font-black italic">SIP-024: CORE PROTOCOL UPGRADE</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-slate-500 uppercase">Consensus Status</p>
                                    <p className="text-xl font-black italic text-green-400">FAVORABLE (82%)</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-6 rounded-2xl border border-white/5 bg-white/2">
                                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Voter Distribution</h4>
                                <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden flex">
                                    <div className="h-full bg-green-500" style={{ width: '82%' }} />
                                    <div className="h-full bg-red-500" style={{ width: '18%' }} />
                                </div>
                                <div className="flex justify-between mt-2 text-[10px] font-mono text-slate-400">
                                    <span>YES: 82%</span>
                                    <span>NO: 18%</span>
                                </div>
                            </div>
                            <div className="p-6 rounded-2xl border border-white/5 bg-white/2">
                                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Quorum Progress</h4>
                                <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-orange-500" style={{ width: '64%' }} />
                                </div>
                                <div className="flex justify-between mt-2 text-[10px] font-mono text-slate-400">
                                    <span>PROGRESS: 64%</span>
                                    <span>TARGET: 50%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Side Panels */}
                    <div className="lg:col-span-4 space-y-8">
                        <section className="p-6 rounded-2xl border border-white/10 bg-slate-900">
                            <LiveVoteStream />
                        </section>

                        <section className="p-6 rounded-2xl border border-white/10 bg-slate-900/50 space-y-4">
                            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tactical Alerts</h4>
                            <div className="space-y-3">
                                <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20 flex gap-3">
                                    <span className="text-orange-500 uppercase text-[10px] font-bold">INFO</span>
                                    <p className="text-xs text-slate-300">Large delegation event detected: 250K STX.</p>
                                </div>
                                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex gap-3">
                                    <span className="text-red-500 uppercase text-[10px] font-bold">WARN</span>
                                    <p className="text-xs text-slate-300">Quorum threshold reached for SIP-024.</p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
