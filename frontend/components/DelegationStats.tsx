'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users, Shield, TrendingUp, ArrowRight } from 'lucide-react';

export default function DelegationStats() {
    return (
        <div className="p-8 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-[40px] overflow-hidden">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h3 className="text-xl font-black uppercase tracking-tight text-white mb-1">Advocacy Metrics</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Tracking power delegated to your wallet</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-orange-600/10 flex items-center justify-center border border-orange-500/30">
                    <Shield className="w-6 h-6 text-orange-500" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="p-6 bg-white/5 rounded-3xl border border-white/5 text-center group hover:bg-white/10 transition-all">
                    <Users className="w-6 h-6 text-blue-500 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                    <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Delegators</p>
                    <p className="text-2xl font-black text-white">45</p>
                </div>
                <div className="p-6 bg-white/5 rounded-3xl border border-white/5 text-center group hover:bg-white/10 transition-all">
                    <TrendingUp className="w-6 h-6 text-green-500 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                    <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Total Power</p>
                    <p className="text-2xl font-black text-white">1,240</p>
                </div>
            </div>

            <div className="p-6 bg-black/40 rounded-[24px] border border-white/5 mb-8">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Influence</span>
                    <span className="text-xs font-black text-orange-500">Tier 3 Advocate</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '65%' }}
                        className="h-full bg-orange-600 shadow-[0_0_15px_rgba(234,88,12,0.4)]"
                    />
                </div>
                <p className="text-[9px] font-medium text-slate-500 mt-4 uppercase tracking-tighter italic">
                    Maintain 1,000+ power for 30 days to unlock Guardian Badge.
                </p>
            </div>

            <button className="w-full flex items-center justify-between p-5 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] transition-all group border border-white/5">
                MANAGE DELEGATORS
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
    );
}
